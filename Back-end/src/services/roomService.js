const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateRoomCode } = require('../utils/codeGenerator');

exports.createRoom = async (creatorUuid,genreId) => {
  let uniqueCode = '';
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = generateRoomCode();
    const existingRoom = await prisma.room.findUnique({
      where: { code: uniqueCode }
    });

    if (!existingRoom) {
      isUnique = true;
    }
  }

 
  const result = await prisma.$transaction(async (tx) => {
    const room = await tx.room.create({
      data: {
        code: uniqueCode,
        isActive: true,
        genreId: String(genreId)
      }
    });

    await tx.participant.create({
      data: {
        sessionUuid: creatorUuid, 
        roomId: room.id
      }
    });

    return room;
  });

  return result;
};

exports.joinRoom = async (code, userUuid) => {
  const room = await prisma.room.findUnique({
    where: { code: code }
  });

  if (!room) {
    throw new Error('Sala não encontrada.');
  }

  if (!room.isActive) {
    throw new Error('Esta sala já foi encerrada.');
  }

  const existingParticipant = await prisma.participant.findUnique({
    where: {
      sessionUuid_roomId: {
        sessionUuid: userUuid,
        roomId: room.id
      }
    }
  });

  if (existingParticipant) {
    return existingParticipant; 
  }

  const participant = await prisma.participant.create({
    data: {
      sessionUuid: userUuid,
      roomId: room.id
    }
  });

  return participant;
};

exports.getRoomStatus = async (sessionUuid, roomCode) => {
    const participant = await prisma.participant.findFirst({
        where: { 
            sessionUuid: sessionUuid,
            room: {
                code: roomCode 
            }
        },
        include: { room: true }
    });

    if (!participant) {
        return { hasMatch: false };
    }

    if (participant.room.matchedMovieId) {
        return {
            hasMatch: true,
            movieId: participant.room.matchedMovieId
        };
    }

    return { hasMatch: false };
};
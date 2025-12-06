const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateRoomCode } = require('../utils/codeGenerator');

exports.createRoom = async () => {
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

  const room = await prisma.room.create({
    data: {
      code: uniqueCode,
      isActive: true
    }
  });

  return room;
};

exports.joinRoom = async (code) => {
  const room = await prisma.room.findUnique({
    where: { code: code }
  });

  if (!room) {
    throw new Error('Sala não encontrada.');
  }

  if (!room.isActive) {
    throw new Error('Esta sala já foi encerrada.');
  }

  const sessionUuid = crypto.randomUUID();

  const participant = await prisma.participant.create({
    data: {
      sessionUuid: sessionUuid,
      roomId: room.id
    }
  });

  return participant;
};
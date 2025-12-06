const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.registerVote = async (sessionUuid, tmdbMovieId, voteType, roomCode) => {
  
  
  const participant = await prisma.participant.findFirst({
    where: { 
        sessionUuid: sessionUuid,
        room: {
            code: roomCode 
        }
    },
    include: { room: true } 
  });

  if (!participant) throw new Error('Participante não encontrado nesta sala');

  await prisma.vote.create({
    data: {
      participantId: participant.id,
      tmdbMovieId: Number(tmdbMovieId), 
      voteType: voteType 
    }
  });

  if (voteType === 'DISLIKE') {
    return { match: false };
  }

  const totalParticipants = await prisma.participant.count({
    where: { roomId: participant.roomId }
  });

  const totalLikes = await prisma.vote.count({
    where: {
      tmdbMovieId: Number(tmdbMovieId),
      voteType: 'LIKE',
      participant: {
        roomId: participant.roomId
      }
    }
  });

  console.log(`Sala ${roomCode} | Filme ${tmdbMovieId}: ${totalLikes}/${totalParticipants} likes`);

  if (totalLikes >= totalParticipants) {
    console.log("🔥 DEU MATCH! Salvando na sala...");

    await prisma.room.update({
      where: { id: participant.roomId },
      data: { 
        matchedMovieId: Number(tmdbMovieId), 
        isActive: false 
      }
    });

    return { 
      match: true, 
      movieId: tmdbMovieId,
    };
  }

  return { match: false };
};
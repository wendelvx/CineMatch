const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.registerVote = async (sessionUuid, tmdbMovieId, voteType) => {
  
  const participant = await prisma.participant.findFirst({
    where: { sessionUuid: sessionUuid },
    include: { room: true } 
  });

  if (!participant) throw new Error('Participante não encontrado');

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

  // 4. Conta quantos LIKES esse filme específico tem na sala
  const totalLikes = await prisma.vote.count({
    where: {
      tmdbMovieId: Number(tmdbMovieId),
      voteType: 'LIKE',
      participant: {
        roomId: participant.roomId
      }
    }
  });

  console.log(`Filme ${tmdbMovieId}: ${totalLikes}/${totalParticipants} likes`);

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
const voteService = require('../services/voteService');

exports.submitVote = async (req, res) => {
  
  const sessionUuid = req.headers['x-session-uuid']; 
  const { movieId, vote } = req.body;

  if (!sessionUuid) return res.status(401).json({ error: 'Identificação necessária.' });
  if (!movieId || !vote) return res.status(400).json({ error: 'Dados incompletos.' });

  try {
    const result = await voteService.registerVote(sessionUuid, movieId, vote);
    
    return res.status(201).json({ 
      success: true, 
      ...result 
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Voto já registrado para este filme.' });
    }
    
    console.error(error);
    return res.status(500).json({ error: 'Erro ao processar voto.' });
  }
};
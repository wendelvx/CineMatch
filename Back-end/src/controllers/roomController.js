const roomService = require('../services/roomService');

exports.createRoom = async (req, res) => {
  const sessionUuid = req.headers['x-session-uuid'];
  const { genreId } = req.body;

  if (!sessionUuid) {
    return res.status(400).json({ error: 'UUID de sessão é obrigatório.' });
  }
const selectedGenre = genreId || '28';
  try {
    const room = await roomService.createRoom(sessionUuid,selectedGenre);
    
    return res.status(201).json({
      success: true,
      roomCode: room.code,
      roomId: room.id,
      message: 'Sala criada com sucesso!'
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno ao criar sala.' 
    });
  }
};

exports.joinRoom = async (req, res) => {
  const { code } = req.body; 
  const sessionUuid = req.headers['x-session-uuid'];

  if (!code) return res.status(400).json({ error: 'Código da sala é obrigatório.' });
  if (!sessionUuid) return res.status(400).json({ error: 'UUID de sessão é obrigatório.' });

  try {
    const participant = await roomService.joinRoom(code, sessionUuid);

    return res.status(200).json({
      success: true,
      sessionUuid: participant.sessionUuid, 
      message: 'Entrou na sala com sucesso!'
    });

  } catch (error) {
    if (error.code === 'P2002') {
         return res.status(200).json({ success: true, message: 'Você já estava nesta sala.' });
    }

    if (error.message === 'Sala não encontrada.' || error.message === 'Esta sala já foi encerrada.') {
      return res.status(404).json({ success: false, error: error.message });
    }

    console.error(error);
    return res.status(500).json({ success: false, error: 'Erro interno ao entrar na sala.' });
  }
};

exports.checkStatus = async (req, res) => {
    const sessionUuid = req.headers['x-session-uuid'];
    if (!sessionUuid) return res.status(401).json({ error: 'Header hiatos.' });

    try {
        const status = await roomService.getRoomStatus(sessionUuid);
        return res.json(status);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao checar status.' });
    }
};
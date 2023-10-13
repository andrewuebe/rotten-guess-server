import jwt from 'jsonwebtoken';
import { Lobby } from '../database/models/Lobby';
import { Player } from '../database/models/Player';
import { errorResponse } from '../helpers/APIHelper';
import { error } from 'console';

export const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const playerId = decodedToken.id;

    // find Player in DB with this ID that has a lobby_token
    // if no player matches or the player has no lobby_token, throw error
    const player = await Player.findOne({ _id: playerId, lobby_token: { $exists: true } });
    if (!player) {
      return res.status(401).json(errorResponse({ message: "NO_PLAYER_FOUND" }));
    }

    // find Lobby in DB with this lobby_token
    const lobby = await Lobby.findOne({ lobby_token: player.lobby_token });
    if (!lobby) {
      return res.status(401).json(errorResponse({ message: "NO_LOBBY_FOUND" }));
    }

    res.locals.player = player;
    res.locals.lobby = lobby;
    next();
  } catch {
    return res.status(401).json(errorResponse({ message: "INVALID_TOKEN" }));
  }
}

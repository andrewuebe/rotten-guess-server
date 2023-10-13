import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../helpers/APIHelper';
import LobbyService from '../services/LobbyService';

export default class LobbyController {
  constructor(
    private service: LobbyService = new LobbyService(),
  ) { }

  getLobby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { player, lobby } = res.locals;
      const playerSafeValues = player.safeValues();
      const lobbySafeValues = lobby.safeValues();
      return res.status(200).json(successResponse({ player: playerSafeValues, lobby: lobbySafeValues }));
    } catch (e) {
      return next(e);
    }
  }

  createLobby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lobby = await this.service.createLobby();
      return res.status(200).json(successResponse(lobby));
    } catch (e) {
      return next(e);
    }
  }

  joinLobby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lobby = await this.service.joinLobbyNewPlayer(req.body.lobbyToken, req.body.playerName);
      return res.status(200).json(successResponse(lobby));
    } catch (e) {
      return next(e);
    }
  }
}
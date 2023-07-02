import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../helpers/APIHelper';
import LobbyService from '../services/LobbyService';

export default class LobbyController {
  constructor(
    private service: LobbyService
  ) { }

  getLobby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lobby = await this.service.getLobby(req.params.lobbyId);
      return res.status(200).json(successResponse(lobby));
    } catch (e) {
      return next(e);
    }
  }

  postLobby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lobby = await this.service.createLobby();
      return res.status(200).json(successResponse(lobby));
    } catch (e) {
      return next(e);
    }
  }
}
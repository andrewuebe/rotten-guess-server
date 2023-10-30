import { NextFunction, Request, Response } from "express";
import { successResponse } from '../helpers/APIHelper';
import GameService from "../services/GameService";
import GameHelper from "../helpers/GameHelper";
import { getSocket, io } from "../socket";
import { RoundStatus } from "../database/models/Game";
import logger from "../config/logger";

export default class GameController {
  constructor(
    private service: GameService = new GameService(),
  ) { }

  getGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lobby } = res.locals;
      const game = await this.service.getGame(lobby);
      const gameSafeValues = game.safeValues();
      return res.status(200).json(successResponse({ ...gameSafeValues }));
    } catch (e) {
      logger.error('GET_GAME_ERROR', { error: e });
      return next(e);
    }
  }

  startGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lobby, player } = res.locals; // Assume `user` is the user who initiated the game start
      const game = await this.service.createGame(lobby);
      const gameSafeValues = game.safeValues();

      const initiatingSocket = getSocket(player.id);

      initiatingSocket.broadcast.to(lobby.lobby_token).emit('game-started', { ...gameSafeValues });

      return res.status(200).json(successResponse({ ...gameSafeValues }));
    } catch (e) {
      return next(e);
    }
  }

  pickingEnd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lobby, player } = res.locals;
      const pick = req.body.pick;
      const updatedRound = await this.service.pickingEnd(lobby, pick);

      const initiatingSocket = getSocket(player.id);
      initiatingSocket.broadcast.to(lobby.lobby_token).emit('picking-end', { updatedRound });

      return res.status(200).json(successResponse({ updatedRound }));
    } catch (e) {
      return next(e);
    }
  }

  guessingSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lobby, player } = res.locals;
      const guess = req.body.guess;
      const { game, updatedRound } = await this.service.guessingSubmit(lobby, player, guess);

      if (updatedRound.round_status === RoundStatus.SCORES) {
        const initiatingSocket = getSocket(player.id);
        initiatingSocket.broadcast.to(lobby.lobby_token).emit('guessing-end', { game, updatedRound });

        // Set the server-side timer for SCORES phase
        const scoresDuration = 14500;
        setTimeout(async () => {
          game.current_round += 1;
          game.save();
          io.to(lobby.lobby_token).emit('start-next-round', { game });
        }, scoresDuration);
      }


      return res.status(200).json(successResponse({ game, updatedRound }));
    } catch (e) {
      return next(e);
    }
  }

}
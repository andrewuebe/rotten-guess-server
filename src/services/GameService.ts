import GameRepository from "../database/repositories/GameRepository";
import logger from '../config/logger';

export default class GameService {
  constructor() { }

  async getGame(lobby) {
    logger.info('GAME_REPOSITORY_GET_GAME', { lobby })
    const game = await GameRepository.getGame(lobby);
    return game;
  }

  async createGame(lobby) {
    logger.info('GAME_REPOSITORY_CREATE_GAME', { lobby })
    const game = await GameRepository.newGame(lobby);
    return game;
  }

  async pickingEnd(lobby, pick) {
    const game = await GameRepository.getGame(lobby);
    const updatedRound = await GameRepository.pickingEnd(game, pick);
    return updatedRound;
  }

  async guessingSubmit(lobby, player, guess) {
    const game = await GameRepository.getGame(lobby);
    const updatedRound = await GameRepository.guessingSubmit(lobby, game, player, guess);
    return updatedRound;
  }
}
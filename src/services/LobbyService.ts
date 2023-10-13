import LobbyHelper from "../helpers/LobbyHelper";
import { LobbyRepository } from '../database/repositories';
import { PlayerRepository } from '../database/repositories';
import logger from '../config/logger';
import jwt from 'jsonwebtoken';

export default class LobbyService {
  constructor() { }

  async createLobby() {
    logger.info('LOBBY_SERVICE_CREATE_LOBBY');
    const lobbyToken = await LobbyHelper.generateLobbyToken();
    const newPlayer = await PlayerRepository.newPlayer({ lobbyToken });
    const playerToAdd = { id: newPlayer._id, name: newPlayer.name };
    const token = jwt.sign({ ...playerToAdd, lobby_token: lobbyToken }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const newLobby = await LobbyRepository.newLobby(lobbyToken, playerToAdd);
    return { lobby: newLobby, token };
  }

  async putLobby(lobbyId: string) {
    logger.info('LOBBY_SERVICE_PUT_LOBBY', { lobbyId });
    return { lobbyId };
  }

  async joinLobbyNewPlayer(lobbyToken: string, playerName?: string) {
    logger.info('LOBBY_SERVICE_JOIN_LOBBY_NEW_PLAYER', { lobbyToken, playerName });
    const newPlayer = await PlayerRepository.newPlayer({ playerName, lobbyToken });
    const playerToAdd = { id: newPlayer._id, name: newPlayer.name };
    const token = jwt.sign({ ...playerToAdd, lobby_token: lobbyToken }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const lobby = await LobbyRepository.addPlayerToLobby(lobbyToken, playerToAdd);
    return { lobby, player: playerToAdd, token };
  }

  async deleteLobby(lobbyId: string) {
    logger.info('LOBBY_SERVICE_DELETE_LOBBY', { lobbyId });
    return { lobbyId };
  }
}
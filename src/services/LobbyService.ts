import LobbyHelper from "../helpers/LobbyHelper";
import { LobbyRepository } from '../database/repositories';
import { PlayerRepository } from '../database/repositories';
import jwt from 'jsonwebtoken';

export default class LobbyService {
  constructor() { }

  async createLobby() {
    console.log('lets create the lobby');
    const lobbyToken = await LobbyHelper.generateLobbyToken();
    const newPlayer = await PlayerRepository.newPlayer({ lobbyToken });
    const playerToAdd = { id: newPlayer._id, name: newPlayer.name };
    const token = jwt.sign(playerToAdd, process.env.JWT_SECRET, { expiresIn: '1h' })
    const newLobby = await LobbyRepository.newLobby(lobbyToken, playerToAdd);
    return { lobby: newLobby, token };
  }

  async putLobby(lobbyId: string) {
    console.log('lets put the lobby');
    return { lobbyId };
  }

  async joinLobbyNewPlayer(lobbyToken: string, playerName?: string) {
    console.log('lets join the lobby');
    const newPlayer = await PlayerRepository.newPlayer({ playerName, lobbyToken });
    const playerToAdd = { id: newPlayer._id, name: newPlayer.name };
    const token = jwt.sign(playerToAdd, process.env.JWT_SECRET, { expiresIn: '1h' })
    const lobby = await LobbyRepository.addPlayerToLobby(lobbyToken, playerToAdd);
    return { lobby, token };
  }

  async deleteLobby(lobbyId: string) {
    console.log('lets delete the lobby');
    return { lobbyId };
  }
}
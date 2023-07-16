import mongoose from 'mongoose';
import { Lobby } from '../models/Lobby';

export default class LobbyRepository {
  static async newLobby(lobbyToken, playerToAdd) {
    const lobby = new Lobby({ lobby_token: lobbyToken, players: [playerToAdd] });
    await lobby.save();
    return lobby;
  }

  static async addPlayerToLobby(lobbyToken, playerToAdd) {
    const lobby = await Lobby.findOne({ lobby_token: lobbyToken });
    lobby.players.push(playerToAdd);
    await lobby.save();
    return lobby;
  }
}
import { Lobby, LobbyDocument } from '../database/models/Lobby';

export default class LobbyHelper {
  private lobbyModel: LobbyDocument;
  constructor(lobbyModel?: LobbyDocument) {
    if (!lobbyModel) {
      throw new Error('Lobby model is required');
    }
    this.lobbyModel = lobbyModel;
  }

  static async generateLobbyToken(length = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingLobby = await Lobby.findOne({ lobby_token: result });
    if (existingLobby) {
      // If a collision is found, recursively generate a new token and return it
      return await this.generateLobbyToken(length);
    } else {
      // If no collision is found, return the generated token
      return result;
    }
  }
};

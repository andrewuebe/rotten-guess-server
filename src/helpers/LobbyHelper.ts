import { Lobby, LobbyDocument } from '../database/models/Lobby';

export default class LobbyHelper {
  private lobbyModel: LobbyDocument;
  constructor(lobbyModel?: LobbyDocument) {
    if (!lobbyModel) {
      throw new Error('Lobby model is required');
    }
    this.lobbyModel = lobbyModel;
  }

  get safeValues() {
    const { __v, _id, created_at, updated_at, ...safeValues } = this.lobbyModel.toObject();
    return safeValues;
  }

  static async generateLobbyToken(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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

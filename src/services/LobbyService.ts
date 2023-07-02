import { GameLobby } from 'ws-game-lobby';

export default class LobbyService {
  constructor() { }

  async getLobby(lobbyId: string) {
    console.log('lets get the lobby');
    return { lobbyId };
  }

  async createLobby() {
    console.log(GameLobby);
    const lobby = new GameLobby();
    console.log('lobby: ', lobby);
    return { lobbyId: '123' };
  }

  async putLobby(lobbyId: string) {
    console.log('lets put the lobby');
    return { lobbyId };
  }

  async deleteLobby(lobbyId: string) {
    console.log('lets delete the lobby');
    return { lobbyId };
  }
}
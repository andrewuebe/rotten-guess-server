export default class LobbyService {
  constructor() { }

  async getLobby(lobbyId: string) {
    console.log('lets get the lobby');
    return { lobbyId };
  }
  ß
  async createLobby() {
    console.log('lets create the lobby');
    return { lobbyId: '123' };
  }

  async putLobby(lobbyId: string) {
    console.log('lets put the lobby');
    return { lobbyId };
  }

  async joinLobby(lobbyId: string) {
    console.log('lets join the lobby');
    return { lobbyId };
  }

  async deleteLobby(lobbyId: string) {
    console.log('lets delete the lobby');
    return { lobbyId };
  }
}
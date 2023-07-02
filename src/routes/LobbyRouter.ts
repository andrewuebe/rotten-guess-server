import { Router } from 'express';
import LobbyController from '../controllers/LobbyController';
import LobbyService from 'src/services/LobbyService';

export default function LobbyRouter(
  lobbyService: LobbyService,
  controller: LobbyController = new LobbyController(lobbyService),
  router: Router = Router(),
): Router {
  router.post('/', controller.postLobby);
  router.get('/', controller.getLobby);
  // router.put('/', controller.putLobby);
  // router.delete('/', controller.deleteLobby);
  return router;
}
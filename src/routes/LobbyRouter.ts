import { Router } from 'express';
import LobbyController from '../controllers/LobbyController';

export default function LobbyRouter(
  controller: LobbyController = new LobbyController(),
  router: Router = Router(),
): Router {
  router.post('/', controller.postLobby);
  router.get('/', controller.getLobby);
  // router.put('/', controller.putLobby);
  // router.delete('/', controller.deleteLobby);
  return router;
}
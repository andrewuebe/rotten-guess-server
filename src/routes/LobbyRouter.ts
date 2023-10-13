import { Router } from 'express';
import LobbyController from '../controllers/LobbyController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export default function LobbyRouter(
  controller: LobbyController = new LobbyController(),
  router: Router = Router(),
): Router {
  router.post('/', controller.createLobby);
  router.get('/', AuthMiddleware, controller.getLobby);
  router.post('/join', controller.joinLobby);
  // router.put('/', controller.putLobby);
  // router.delete('/', controller.deleteLobby);
  return router;
}
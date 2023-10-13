import { Router } from 'express';
import GameController from '../controllers/GameController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export default function GameRouter(
  controller: GameController = new GameController(),
  router: Router = Router(),
): Router {
  router.get('/', AuthMiddleware, controller.getGame);
  router.post('/start', AuthMiddleware, controller.startGame);
  router.post('/round/picking-end', AuthMiddleware, controller.pickingEnd);
  router.post('/round/guessing-submit', AuthMiddleware, controller.guessingSubmit);
  // router.put('/', controller.putGame);
  // router.delete('/', controller.deleteGame);
  return router;
}
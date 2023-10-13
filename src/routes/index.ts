import { Router } from "express";
// TODO: AuthMiddleware

import LobbyRouter from './LobbyRouter';
import LobbyService from "src/services/LobbyService";
import GameRouter from "./GameRouter";
import MovieRouter from "./MovieRouter";

export default function Routes(
  // auth: AuthMiddleware,
  router: Router = Router(),
): Router {
  router.use('/lobby', LobbyRouter());
  router.use('/game', GameRouter());
  router.use('/movie', MovieRouter());
  return router;
}
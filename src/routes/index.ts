import { Router } from "express";
// TODO: AuthMiddleware

import LobbyRouter from './LobbyRouter';
import LobbyService from "src/services/LobbyService";

export default function Routes(
  // auth: AuthMiddleware,
  router: Router = Router(),
): Router {
  router.use('/lobby', LobbyRouter());
  return router;
}
import { Router } from 'express';
import MovieController from '../controllers/MovieController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export default function GameRouter(
  controller: MovieController = new MovieController(),
  router: Router = Router(),
): Router {
  router.get('/search', AuthMiddleware, controller.searchMovie);
  router.get('/:id', AuthMiddleware, controller.getMovieById);
  return router;
}
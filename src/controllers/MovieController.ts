import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../helpers/APIHelper';
import MovieService from '../services/MovieService';

export default class MovieController {
  constructor(
    private service: MovieService = new MovieService(),
  ) { }

  searchMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchResults = await this.service.searchMovie(req.query.query);
      return res.status(200).json(successResponse({ movies: searchResults }));
    } catch (e) {
      return next(e);
    }
  }

  getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = await this.service.getMovieById(req.params.id);
      return res.status(200).json(successResponse({ movie }));
    } catch (e) {
      return next(e);
    }
  }
}
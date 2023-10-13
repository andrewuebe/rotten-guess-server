import { MovieDocument } from "src/database/models/Movie";
import MovieRepository from "../database/repositories/MovieRepository";
import logger from '../config/logger';

export default class MovieService {
  constructor() { }

  async searchMovie(query) {
    logger.debug('MOVIE_REPOSITORY_SEARCH_MOVIE', { query });
    const movies: MovieDocument[] = await MovieRepository.findMoviesMatchingQuery(query, 6);
    return movies;
  }

  async getMovieById(id) {
    const movie: MovieDocument = await MovieRepository.findMovieById(id);
    return movie;
  }
}
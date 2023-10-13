import { Movie, MovieDocument } from '../models/Movie';

export default class MovieRepository {
  /**
   * Finds movies that match the given query string.
   *
   * @param {string} query - The search query string.
   * @param {number} limit - The maximum number of results to return.
   * @param {number} skip - The number of results to skip (for pagination).
   * @returns {Promise<MovieDocument[]>} - A promise that resolves to an array of matching movies.
   */
  static async findMoviesMatchingQuery(query: string, limit: number = 6, skip: number = 0): Promise<MovieDocument[]> {
    // TODO: Add input sanitization and validation
    const sanitizedQuery = query; // Replace this with actual sanitization logic

    const movies =
      await Movie.find({ title: { $regex: sanitizedQuery, $options: 'i' } })
        .sort({ ['box_office_rank']: 1 })
        .limit(limit)
        .skip(skip)
        .exec();

    return movies;
  }

  static async findMovieById(id: string): Promise<MovieDocument | null> {
    const movie = await Movie.findOne({ _id: id }).exec();
    return movie;
  }

  static async getMovieScoreById(id: string): Promise<number | null> {
    const movie = await Movie.findOne({ _id: id }).exec();
    return parseInt(movie?.rt_score) ?? null;
  }
}

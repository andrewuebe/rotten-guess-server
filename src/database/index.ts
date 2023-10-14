import mongoose from 'mongoose';
import config from '../config';
import logger from '../config/logger';
import { Movie } from './models/Movie';

let movieCount: number | null = null;

const connect = async () => {
  const mongoURL = config.db.mongo_url;
  const connectToURL = async () => {
    logger.info('MONGODB_CONNECTING');
    try {
      await mongoose.connect(mongoURL);
      logger.info('MONGODB_CONNECTED');

      // Fetching the count of movies during the initial connection
      movieCount = await Movie.countDocuments().exec();

    } catch (error) {
      logger.error('MONGODB_CONNECTION_ERROR', { error });
      return process.exit(1);
    }
  }

  mongoose.connection.on('disconnected', async () => {
    logger.info('MONGODB_DISCONNECTED');
    await connectToURL();
  });

  await connectToURL();
};

const getMovieCount = () => movieCount;

export default { connect, mongoose, getMovieCount };

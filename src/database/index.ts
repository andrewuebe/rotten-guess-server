import mongoose from 'mongoose';
import config from '../config';
import logger from '../config/logger';

/**
 * Connect to MongoDB database
 */
const connect = async () => {
  const mongoURL = config.db.mongo_url;
  const connectToURL = () => {
    logger.info('MOGODB_CONNECTING');
    return mongoose.connect(mongoURL).then((connection) => {
      logger.info('MOGODB_CONNECTED');
    }).catch((error) => {
      logger.error('MONDODB_CONNECTION_ERROR', { error });
      return process.exit(1);
    });
  }

  mongoose.connection.on('disconnected', async () => {
    logger.info('MONGODB_DISCONNECTED');
    await connectToURL();
  });

  await connectToURL();
};

export default { connect, mongoose };

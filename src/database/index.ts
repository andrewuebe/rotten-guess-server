import mongoose from 'mongoose';
import config from '../config';

/**
 * Connect to MongoDB database
 */
const connect = async () => {
  const mongoURL = config.db.mongo_url;
  const connectToURL = () => {
    console.log('MongoDB Connecting...');
    return mongoose.connect(mongoURL).then((connection) => {
      console.log('MongoDB Connected');
      return connection;
    }).catch((error) => {
      console.log('MongoDB Connection Error: ', error);
      return process.exit(1);
    });
  }

  mongoose.connection.on('disconnected', async () => {
    console.log('MongoDB Disconnected');
    await connectToURL();
  });

  await connectToURL();
};

export default { connect, mongoose };

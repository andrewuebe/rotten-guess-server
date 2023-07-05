import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import EventEmitter from 'events';
import express, { Express } from 'express';
import Routes from './routes';

export default class App extends EventEmitter {

  constructor(
    public expressApp: Express = express(),
  ) {
    super();
  }

  async prepare() {
    // Connect to DB and then start server
    try {
      // await db.connect();
      console.log('Connected to DB');

    } catch (err) {
      console.log('Error connecting to DB: ', err);
      process.exit(0);
    }
  }

  async init() {
    try {
      // Prepare app
      await this.prepare();

      // Add middleware
      this.expressApp.use(cors()); // todo: add httpConfig
      this.expressApp.use(express.json());
      this.expressApp.use(express.urlencoded({ extended: false }));

      // Add routes
      this.expressApp.use(Routes());

      this.ready();
    } catch (err) {
      console.log('Error initializing app: ', err);
    }
  }

  ready() {
    setTimeout(() => {
      this.emit('ready');
    }, 1);
  }
}

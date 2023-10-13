import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import db from './database';
import EventEmitter from 'events';
import express, { Express } from 'express';
import Routes from './routes';
import logger from './config/logger';

import { Player } from './database/models/Player';
import { Lobby } from './database/models/Lobby';
import { Movie } from './database/models/Movie';
import { Game } from './database/models/Game';


export default class App extends EventEmitter {

  constructor(
    public expressApp: Express = express(),
  ) {
    super();
  }

  async prepare() {
    // Connect to DB and then start server
    try {
      await db.connect();
      logger.info('Connected to DB');

      // Delete all players, lobbies and games older than 6 hours old
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      Player.deleteMany({ updated_at: { $lt: sixHoursAgo } })
        .then(() => logger.info('Deleted all players older than 6 hours old'));
      Lobby.deleteMany({ updated_at: { $lt: sixHoursAgo } })
        .then(() => logger.info('Deleted all lobbies older than 6 hours old'));
      Game.deleteMany({ updated_at: { $lt: sixHoursAgo } })
        .then(() => logger.info('Deleted all games older than 6 hours old'));
    } catch (err) {
      logger.error('Error connecting to DB', err);
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
      logger.error('Error initializing app', err);
    }
  }

  ready() {
    setTimeout(() => {
      this.emit('ready');
    }, 1);
  }
}

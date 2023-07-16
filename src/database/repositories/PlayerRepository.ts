import mongoose from 'mongoose';
import { Player } from '../models/Player';
import config from '../../config';

interface NewPlayerArgs {
  lobbyToken?: string;
  playerName?: string;
}

export default class PlayerRepository {

  static async newPlayer(args?: NewPlayerArgs) {
    const playerName = args?.playerName ?? this.generatePlayerName();
    const player = new Player({ name: playerName });
    if (args?.lobbyToken) {
      player.lobby_token = args.lobbyToken;
    }
    await player.save();
    return player;
  }

  static generatePlayerName() {
    const adjective = config.positiveAdjectives[Math.floor(Math.random() * config.positiveAdjectives.length)];
    const noun = config.positiveNouns[Math.floor(Math.random() * config.positiveNouns.length)];
    return `${adjective}${noun}`;
  }
}
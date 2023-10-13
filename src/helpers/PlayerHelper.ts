import { Player, PlayerDocument } from '../database/models/Player';

export default class PlayerHelper {
  private playerModel: PlayerDocument;

  constructor(playerModel?: PlayerDocument) {
    if (!playerModel) {
      throw new Error('Player model is required');
    }
    this.playerModel = playerModel;
  }
};

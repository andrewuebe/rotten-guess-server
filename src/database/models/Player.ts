import mongoose, { Schema, Document, Model } from 'mongoose';

interface PlayerModel {
  name: string;
  lobby_token?: string;
}

export interface PlayerDocument extends Document {
  name: string;
  lobby_token?: string;
  safeValues: () => any;
}

const PlayerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  lobby_token: {
    type: String,
    required: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

PlayerSchema.methods.safeValues = function () {
  const { name, lobby_token } = this.toObject();
  return { name, lobby_token };
}

const Player: Model<PlayerDocument> = mongoose.model<PlayerDocument>('Player', PlayerSchema);

export { Player };

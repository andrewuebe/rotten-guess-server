import mongoose, { Schema, Document, Model } from 'mongoose';

interface LobbyModel {
  lobby_token: string;
  game_id?: string;
  players?: any[];
  is_in_game?: boolean;
  is_public?: boolean;
  lobby_max_size?: number;
}

export interface LobbyDocument extends Document {
  lobby_token: string;
  game_id?: string;
  players?: any[];
  is_in_game?: boolean;
  is_public?: boolean;
  lobby_max_size?: number;
  readonly safeValues: any;
}


const LobbySchema: Schema = new Schema({
  lobby_token: {
    type: String,
    required: true
  },
  game_id: {
    type: String,
    default: null,
    required: false
  },
  players: {
    type: Array,
    default: [],
    required: false
  },
  is_in_game: {
    type: Boolean,
    default: false,
    required: false
  },
  is_public: {
    type: Boolean,
    default: false,
    required: false
  },
  lobby_max_size: {
    type: Number,
    default: 6,
    required: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

LobbySchema.methods.safeValues = function () {
  const { __v, _id, lobby_id, created_at, updated_at, ...safeValues } = this.toObject();
  return safeValues;
};

const Lobby: Model<LobbyDocument> = mongoose.model<LobbyDocument>('Lobby', LobbySchema);

export { Lobby };

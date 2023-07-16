import mongoose, { Schema, Document, Model } from 'mongoose';

interface LobbyModel {
  lobby_token: string;
  game_id?: string;
  players?: any[];
  is_active?: boolean;
  is_public?: boolean;
  lobby_max_size?: number;
}

export interface LobbyDocument extends Document {
  lobby_token: string;
  game_id?: string;
  players?: any[];
  is_active?: boolean;
  is_public?: boolean;
  lobby_max_size?: number;
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
  is_active: {
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
    default: 8,
    required: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Lobby: Model<LobbyDocument> = mongoose.model<LobbyDocument>('Lobby', LobbySchema);

export { Lobby };

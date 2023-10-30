import mongoose, { Schema, Document, Model } from 'mongoose';

interface Pick {
  movie_id?: string;
  rt_score?: number;
  timed_out?: boolean;
}

interface Guess {
  player_id: string;
  name: string;
  guess?: string;
  points?: number;
  timed_out?: boolean;
};

enum GameStatus {
  'IN_PROGRESS' = 'IN_PROGRESS',
  'FINISHED' = 'FINISHED'
}

enum RoundType {
  'GUESS_SCORE' = 'GUESS_SCORE',
  'GUESS_MOVIE' = 'GUESS_MOVIE'
};

enum RoundStatus {
  'PICKING' = 'PICKING',
  'GUESSING' = 'GUESSING',
  'SCORES' = 'SCORES'
};

interface GamePlayer {
  player_id: string;
  name: string;
}

interface EndTimes {
  [RoundStatus.PICKING]: Date | null;
  [RoundStatus.GUESSING]: Date | null;
  [RoundStatus.SCORES]: Date | null;
}

interface Round {
  round_number: number;
  round_type: RoundType;
  round_status: RoundStatus;
  picker_player: GamePlayer;
  pick: Pick;
  guesses: Guess[];
  end_times: EndTimes;
};

interface PlayerScore extends GamePlayer {
  score: number;
};

interface GameModel extends Document {
  lobby_id: string;
  current_round: number;
  status: string;
  rounds: Round[];
  player_scores: PlayerScore[];
  picked_movie_ids: string[];
  rounds_per_game: number;
  safeValues: () => any;
};


const gamePlayer = new Schema<GamePlayer>({
  player_id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const endTimes = new Schema<EndTimes>({
  PICKING: { type: Date, required: true },
  GUESSING: { type: Date, required: false },
  SCORES: { type: Date, required: false },
}, { _id: false });

const pickSchema = new Schema<Pick>({
  movie_id: { type: String, required: false, default: null },
  rt_score: { type: Number, required: false, default: null },
  timed_out: { type: Boolean, required: false, default: false }
}, { _id: false })

const guessSchema = new Schema<Guess>({
  player_id: { type: String, required: true },
  name: { type: String, required: true },
  guess: { type: String, required: false, },
  points: { type: Number, required: false, default: null },
  timed_out: { type: Boolean, required: false, default: false }
}, { _id: false });

const roundSchema = new Schema<Round>({
  round_number: { type: Number, required: true },
  round_type: { type: String, enum: Object.values(RoundType), required: true },
  round_status: { type: String, enum: Object.values(RoundStatus), required: true },
  picker_player: gamePlayer,
  pick: pickSchema,
  guesses: [guessSchema],
  end_times: endTimes
}, { _id: false });

const playerScoreSchema = new Schema<PlayerScore>({
  player_id: { type: String, required: true },
  score: { type: Number, required: true },
  name: { type: String, required: true },
}, { _id: false });

const gameSchema = new Schema<GameModel>({
  lobby_id: { type: String, required: true },
  current_round: { type: Number, default: 1 },
  status: { type: String, enum: Object.values(GameStatus), required: true },
  rounds: [roundSchema],
  player_scores: [playerScoreSchema],
  picked_movie_ids: [String],
  rounds_per_game: { type: Number, default: 5 }
});

gameSchema.methods.safeValues = function () {
  const {
    __v, _id, created_at, updated_at, lobby_id, rounds, ...otherKeyValues
  } = this.toObject();

  const safeRound = ({ round_number, round_type, round_status, picker_player, guesses, end_times, pick }) => ({
    round_number,
    round_type,
    round_status,
    picker_player: { name: picker_player.name },
    guesses: guesses.map(({ name, guess, points, timed_out }) => ({ name, guess, points, timed_out })),
    end_times,
    pick
  });

  const safeScore = ({ name, score }) => ({ name, score });

  return {
    ...otherKeyValues,
    rounds: rounds.map(safeRound),
    player_scores: this.player_scores.map(safeScore)
  };
};


const Game: Model<GameModel> = mongoose.model<GameModel>('Game', gameSchema);

export { Game, GamePlayer, GameModel, GameStatus, Guess, Round, PlayerScore, RoundType, RoundStatus, Pick };

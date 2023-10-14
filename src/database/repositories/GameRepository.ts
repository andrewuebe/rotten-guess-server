import GameHelper from '../../helpers/GameHelper';
import { Lobby } from '../models/Lobby';
import { Game, GameStatus, PlayerScore, RoundStatus, RoundType } from '../models/Game';

export default class GameRepository {
  static async getGame(lobby) {
    const game = await Game.findOne({ lobby_id: lobby._id });
    return game;
  }

  static async newGame(lobby) {
    const gameRound = 1;
    const firstRound = GameHelper.getNewGameRound(1, RoundType.GUESS_SCORE, lobby.players[0]);
    const baseScores = GameHelper.getBaseScores(lobby.players);
    const game = new Game({
      lobby_id: lobby._id,
      player_scores: baseScores,
      rounds: [firstRound],
      current_round: gameRound,
      status: GameStatus.IN_PROGRESS,
    });
    await game.save();
    await Lobby.findOneAndUpdate({ _id: lobby._id }, { is_in_game: true, game_id: game._id });
    return game;
  }

  static async pickingEnd(game, pick) {
    const currentRound = game.rounds[game.current_round - 1];
    let pickToSave = pick;
    if (pickToSave.timed_out) {
      // user timed out picking, so we have to pick for them
      pickToSave = await GameHelper.getTimedOutPick();
    }
    currentRound.pick = pickToSave;
    if (pickToSave.movie_id) {
      game.picked_movie_ids.push(pickToSave.movie_id);
    }
    currentRound.round_status = RoundStatus.GUESSING;
    currentRound.end_times.GUESSING = GameHelper.getEndTime(RoundStatus.GUESSING)
    game.rounds[game.current_round - 1] = currentRound;
    await game.save();
    return currentRound;
  }

  static async guessingSubmit(lobby, game, player, guess) {
    const currentRound = game.rounds[game.current_round - 1];
    const numberOfPlayers = lobby.players.length;

    currentRound.guesses.push({ player_id: player._id, ...guess });

    if (currentRound.guesses.length === numberOfPlayers) {
      currentRound.guesses = await GameHelper.calculateRoundPoints(currentRound.pick, currentRound.guesses, currentRound.round_type)
      game.player_scores = GameHelper.updateGamePoints(game.player_scores, currentRound.guesses, currentRound.picker_player.player_id);
      currentRound.round_status = RoundStatus.SCORES;
      currentRound.end_times.SCORES = GameHelper.getEndTime(RoundStatus.SCORES)
    }

    game.rounds[game.current_round - 1] = currentRound;
    const nextPicker = GameHelper.getNextRoundPicker(lobby.players, currentRound.picker_player.player_id);
    const nextRound = GameHelper.getNewGameRound(game.current_round + 1, RoundType.GUESS_SCORE, { id: nextPicker.player_id, name: nextPicker.name }, true);
    game.rounds.push(nextRound);
    await game.save();
    return currentRound;
  }
}
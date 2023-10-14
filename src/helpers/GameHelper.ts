import { PlayerDocument } from 'src/database/models/Player';
import MovieRepository from "../database/repositories/MovieRepository";
import { GamePlayer, GameModel, RoundType, RoundStatus, Guess, Pick, PlayerScore } from '../database/models/Game';
import logger from '../config/logger';

export default class GameHelper {
  private gameModel: GameModel;

  constructor(gameModel?: GameModel) {
    if (!gameModel) {
      throw new Error('Player model is required');
    }
    this.gameModel = gameModel;
  }

  static getNewGameRound(roundNumber: number, roundType: RoundType, pickerPlayer: { id: string, name: string }, notFirstRound?: boolean) {
    logger.debug('pickerPlayer', pickerPlayer);
    return {
      round_number: roundNumber,
      round_type: roundType,
      round_status: RoundStatus.PICKING,
      picker_player: {
        player_id: pickerPlayer.id,
        name: pickerPlayer.name,
      },
      guesses: [],
      end_times: {
        PICKING: notFirstRound ? this.getEndTime(RoundStatus.PICKING, notFirstRound) : this.getEndTime(RoundStatus.PICKING),
        GUESSING: null,
        SCORES: null,
      }
    }
  };

  static getNextRoundPicker(players: PlayerDocument[], previousPickerId) {
    const previousPickerIndex = players.findIndex(player => player.id.toString() === previousPickerId);
    const nextPickerIndex = previousPickerIndex + 1 === players.length ? 0 : previousPickerIndex + 1;
    const nextPicker = players[nextPickerIndex];
    return {
      player_id: nextPicker.id.toString(),
      name: nextPicker.name,
    };
  }

  static getEndTime(roundStatus: RoundStatus, notFirstRound?: boolean): Date {
    let secondsToAdd = 0;
    switch (roundStatus) {
      case RoundStatus.PICKING:
        secondsToAdd = notFirstRound ? 36 : 20;
        break;
      case RoundStatus.GUESSING:
        secondsToAdd = 15;
        break;
      case RoundStatus.SCORES:
        secondsToAdd = 15;
        break;
    }

    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + secondsToAdd * 1000);
    return endTime;
  }

  static getBaseScores(players: PlayerDocument[]) {
    logger.debug('players', players);
    return players.map(player => ({
      player_id: player.id.toString(),
      name: player.name,
      score: 0,
    }));
  };

  static pointsEarned(guessScore: number, targetScore: number) {
    // find difference between guess and target
    const proximityPoints = Math.abs(guessScore - targetScore);
    return 100 - proximityPoints;
  };

  static async calculateRoundPoints(pick: Pick, guesses: Guess[], roundType: RoundType) {
    const targetScore = roundType === RoundType.GUESS_SCORE
      ? await MovieRepository.getMovieScoreById(pick.movie_id)
      : pick.rt_score;

    const guessesWithPoints = await Promise.all(guesses.map(async (guessObject) => {
      if (!guessObject.guess && guessObject.timed_out) {
        // Timed out player
        return { ...guessObject, points: 0 };
      }
      const score = roundType === RoundType.GUESS_MOVIE
        ? await MovieRepository.getMovieScoreById(guessObject.guess)
        : parseInt(guessObject.guess);

      const points = this.pointsEarned(score, targetScore);
      return { ...guessObject, points };
    }));

    return guessesWithPoints;
  }


  /**
   * 
   * @param {PlayerScore[]} playerScores - array of player scores
   * @param {Guess[]} guessesWithPoints - array of guesses with points to be added to player scores
   * @param {string} pickerPlayerId - id of player who "picked" this round
   * 
   * Method to update player scores, adding the "points" value from each Guess object to their corresponding
   * player score object in the playerScores array (using player_id to match). The only acception being the
   * points the pickerPlayerId has in the guess array is not added to playerScores. 
   */
  static updateGamePoints(playerScores: PlayerScore[], guessesWithPoints: Guess[], pickerPlayerId: string) {
    const updatedPlayerScores = playerScores.map(playerScore => {
      const guessObject = guessesWithPoints.find(guess => guess.player_id === playerScore.player_id);
      if (guessObject && guessObject.player_id !== pickerPlayerId) {
        return {
          ...playerScore,
          score: playerScore.score + guessObject.points,
        };
      }
      return playerScore;
    });

    return updatedPlayerScores;
  }

  static async getTimedOutPick() {
    const randomMovie = await MovieRepository.getRandomMovie();
    return {
      movie_id: randomMovie.id,
      timed_out: true,
    };
  }
};

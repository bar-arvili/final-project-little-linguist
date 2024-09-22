import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { GameResult } from '../../../shared/model/game-result';

export const gameResultConverter: FirestoreDataConverter<GameResult> = {
  toFirestore: (gameResultToSave: GameResult) => {
    return {
      categoryId: gameResultToSave.categoryId,
      gameId: gameResultToSave.gameId,
      date: gameResultToSave.date,
      points: gameResultToSave.points,
    };
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): GameResult => {
    const data = snapshot.data(options);

    const gameResult = new GameResult(
      data['categoryId'],
      data['gameId'],
      data['date'].toDate(),
      data['points']
    );

    return gameResult;
  },
};

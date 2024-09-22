import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { gameResultConverter } from './converters/game-result-converter';
import { GameResult } from '../../shared/model/game-result';

@Injectable({
  providedIn: 'root',
})
export class GameResultService {
  private collectionName = 'GameResult';

  constructor(private firestore: Firestore) {}

  async addGameResult(gameResult: GameResult): Promise<void> {
    await addDoc(
      collection(this.firestore, this.collectionName).withConverter(
        gameResultConverter
      ),
      gameResult
    );
  }

  async list(): Promise<GameResult[]> {
    const gameResultsCollection = collection(
      this.firestore,
      this.collectionName
    ).withConverter(gameResultConverter);

    const querySnapshot = await getDocs(gameResultsCollection);
    const gameResults: GameResult[] = [];
    querySnapshot.docs.forEach((docSnap: DocumentSnapshot<GameResult>) => {
      const data = docSnap.data();
      if (data) {
        gameResults.push(data);
      }
    });
    return gameResults;
  }
}

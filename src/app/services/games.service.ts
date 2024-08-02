import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/gameProfile';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private games: GameProfile[] = [

    new GameProfile(1, 'Mixed Letters', 'A game where players rearrange jumbled letters to form a correct word.','/mixed-letters'), 
    new GameProfile(2, 'Word Sorter', 'A game where you sort words according to certain categories.','/word-sorter')
  ];


  constructor() { }

  getGames(): GameProfile[] {
    return this.games;
  }
}


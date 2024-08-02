export class GameProfile {
  GameId: number;
  GameName: string;
  GameDescription: string;
  GameUrl: string;
  
  constructor (GameId: number, GameName: string, GameDescription: string, GameUrl: string,) {
      this.GameId= GameId;
      this.GameName= GameName;
      this.GameDescription=GameDescription;
      this.GameUrl= GameUrl;
     }

}



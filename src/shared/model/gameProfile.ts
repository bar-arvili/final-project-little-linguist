export class GameProfile {
  GameId: number;
  Name: string;
  Description: string;
  GameUrl: string;

  constructor(gameId: number, name: string, description: string, gameUrl: string) {
    this.GameId = gameId;
    this.Name = name;
    this.Description = description;
    this.GameUrl = gameUrl;
  }
}

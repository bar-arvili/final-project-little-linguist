import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameResultService } from '../services/game-result.service';
import { CategoriesService } from '../services/categories.service';
import { GameResult } from '../../shared/model/game-result';
import { Category } from '../../shared/model/category';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule,MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalPoints: number = 0;
  gamesPlayed: number = 0;
  highestAverageScoreGame: string = '';
  lowestAverageScoreGame: string = '';
  categoriesStudied: number = 0;
  categoriesNotStudied: number = 0;
  percentageOfGamesWith100Score: number = 0;
  percentageOfCategoriesStudied: number = 0;
  mostPlayedCategory: string = '';
  monthlyGamesPlayed: number = 0;
  gamesToCompleteChallenge: number = 0;
  daysStrike: number = 0;

  constructor(
    private gameResultService: GameResultService,
    private categoriesService: CategoriesService
  ) {}

  async ngOnInit() {
    const gameResults: GameResult[] = await this.gameResultService.list();
    const categories: Category[] = await this.categoriesService.list();

    this.totalPoints = gameResults.reduce((acc, game) => acc + game.points, 0);
    this.gamesPlayed = gameResults.length;

    const gameScoresMap: { [gameId: string]: number[] } = {};
    gameResults.forEach((game) => {
      if (!gameScoresMap[game.gameId]) {
        gameScoresMap[game.gameId] = [];
      }
      gameScoresMap[game.gameId].push(game.points);
    });

    let highestAvg = -Infinity,
      lowestAvg = Infinity,
      highestGameName = '',
      lowestGameName = '';

    for (const [gameId, scores] of Object.entries(gameScoresMap)) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > highestAvg) {
        highestAvg = avg;
        highestGameName = gameId;
      }
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestGameName = gameId;
      }
    }

    this.highestAverageScoreGame = highestGameName;
    this.lowestAverageScoreGame = lowestGameName;

    const uniqueCategories = new Set(
      gameResults
        .map((game) => game.categoryId)
        .filter((categoryId) =>
          categories.some((category) => category.id === categoryId)
        )
    );
    this.categoriesStudied = uniqueCategories.size;
    this.categoriesNotStudied = categories.length - this.categoriesStudied;
    this.percentageOfCategoriesStudied =
      (this.categoriesStudied / categories.length) * 100;

    const gamesWith100Points = gameResults.filter(
      (game) => game.points === 100
    ).length;
    this.percentageOfGamesWith100Score =
      (gamesWith100Points / gameResults.length) * 100;

    this.calculateMostPlayedCategory(gameResults, categories);
    this.calculateMonthlyGames(gameResults);
    this.calculateDaysStrike(gameResults);
  }

  calculateMostPlayedCategory(
    gameResults: GameResult[],
    categories: Category[]
  ) {
    const categoryMap: { [categoryId: string]: number } = {};

    gameResults.forEach((game) => {
      if (!categoryMap[game.categoryId]) {
        categoryMap[game.categoryId] = 0;
      }
      categoryMap[game.categoryId]++;
    });

    const mostPlayedCategoryId = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b
    );

    const mostPlayedCategory = categories.find(
      (category) => category.id === mostPlayedCategoryId
    );

    this.mostPlayedCategory = mostPlayedCategory
      ? mostPlayedCategory.name
      : 'Unknown';
  }

  calculateMonthlyGames(gameResults: GameResult[]) {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthlyGames = gameResults.filter(
      (game) => new Date(game.date) >= firstDayOfMonth
    );
    this.monthlyGamesPlayed = monthlyGames.length;

    this.gamesToCompleteChallenge = Math.max(20 - this.monthlyGamesPlayed, 0);
  }

  calculateDaysStrike(gameResults: GameResult[]) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let strikeCount = 0;
    let hasGamesOnCurrentDate = true;

    const sortedGameResults = gameResults.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    while (hasGamesOnCurrentDate) {
      const gamesOnDate = sortedGameResults.filter(
        (game) =>
          new Date(game.date).toDateString() === currentDate.toDateString()
      );

      if (gamesOnDate.length > 0) {
        strikeCount++;
      } else {
        hasGamesOnCurrentDate = false;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    this.daysStrike = strikeCount;
  }
}

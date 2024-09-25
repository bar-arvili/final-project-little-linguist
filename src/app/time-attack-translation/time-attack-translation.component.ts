import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExitButtonComponent } from '../exit-button/exit-button.component';
import { ViewPointsComponent } from '../view-points/view-points.component';
import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../shared/model/category';
import { TranslatedWord } from '../../shared/model/translated-word';
import { CategoriesService } from '../services/categories.service';
import { GameResultService } from '../services/game-result.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { GameResult } from '../../shared/model/game-result';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-time-attack-translation',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    ExitButtonComponent,
    ViewPointsComponent,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './time-attack-translation.component.html',
  styleUrl: './time-attack-translation.component.css',
})
export class TimeAttackTranslationComponent implements OnInit {
  @Input() id = '';

  currentCategory?: Category;
  words: TranslatedWord[] = [];
  wordOrder: number[] = [];
  currentWordIndex: number = 0;
  userInput = '';
  points = 0;
  wordPoints: number = 0;
  totalWords: number = 0;
  gameEnded = false;
  successCount = 0;
  timeRemaining = 60;
  intervalId?: number;
  isFullyLoaded = false;
  summaryData: {
    hebrewWord: string;
    correctEnglishWord: string;
    isCorrect: boolean;
  }[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private gameResultService: GameResultService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentCategory = await this.categoriesService.get(this.id);
    if (this.currentCategory?.words) {
      this.setupGame();
      this.isFullyLoaded = true;
      this.startTimer();
    }
  }

  setupGame(): void {
    this.words = this.shuffleArray(this.currentCategory?.words || []);
    this.totalWords = this.words.length;
    this.wordPoints = Math.floor(100 / this.totalWords);
    this.points = 0;
    this.wordOrder = Array.from({ length: this.totalWords }, (_, i) => i);
    this.presentWord();
    this.gameEnded = false;
    this.timeRemaining = 60;
  }

  presentWord(): void {
    const currentIndex = this.wordOrder[this.currentWordIndex];
    const currentWord = this.words?.[currentIndex];
    if (currentWord) {
      console.log('Presenting word:', currentWord);
    }
  }

  submit(userInput: string): void {
    this.userInput = userInput;
    const currentIndex = this.wordOrder[this.currentWordIndex];
    const currentWord = this.words?.[currentIndex];

    const isCorrect =
      !!currentWord &&
      this.userInput
        .trim()
        .localeCompare(currentWord.origin.trim(), undefined, {
          sensitivity: 'base',
        }) === 0;

    const isLastWord = this.currentWordIndex + 1 === this.wordOrder.length;

    if (currentWord) {
      currentWord.guess = this.userInput;
    }

    if (isCorrect) {
      this.successCount++;
      this.points += this.wordPoints;
    }

    const dialogRef = this.dialog.open(
      isCorrect ? SuccessDialogComponent : FailureDialogComponent,
      {
        data: isCorrect,
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      if (!isLastWord) {
        this.currentWordIndex++;
        this.presentWord();
      } else {
        this.endGame();
      }
    });

    this.userInput = '';
  }

  endGame(): void {
    clearInterval(this.intervalId);
    this.gameEnded = true;
    this.showSummary();
  }

  showSummary(): void {
    this.summaryData = this.words.map((word) => ({
      hebrewWord: word.target,
      correctEnglishWord: word.origin,
      isCorrect: word.guess?.toLowerCase() === word.origin.toLowerCase(),
    }));

    const gameResult = new GameResult(
      this.currentCategory?.id || 'unknown-category',
      'Time Attack Translation',
      new Date(),
      this.points
    );
    this.gameResultService.addGameResult(gameResult);
  }

  reset(): void {
    this.userInput = '';
  }

  exit(): void {
    this.dialog.open(ExitDialogComponent);
  }

  startTimer(): void {
    this.intervalId = window.setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  shuffleArray(array: TranslatedWord[]): TranslatedWord[] {
    return array.sort(() => Math.random() - 0.5);
  }

  get progressValue(): number {
    return (this.currentWordIndex / this.totalWords) * 100;
  }
}

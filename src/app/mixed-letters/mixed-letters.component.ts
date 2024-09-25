import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Category } from '../../shared/model/category';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExitButtonComponent } from '../exit-button/exit-button.component';
import { TranslatedWord } from '../../shared/model/translated-word';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { ViewPointsComponent } from '../view-points/view-points.component';
import { GameResultService } from '../services/game-result.service';
import { GameResult } from '../../shared/model/game-result';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mixed-letters',
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
    MatTableModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './mixed-letters.component.html',
  styleUrl: './mixed-letters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedLettersComponent implements OnInit {
  @Input() id = '';

  currentCategory?: Category;
  words?: TranslatedWord[];
  wordOrder: number[] = [];
  currentWordIndex: number = 0;
  shuffledWord: string = '';
  gameEnded: boolean = false;
  successCount: number = 0;
  userInput = '';
  points = 0;
  wordPoints: number = 0;
  totalWords: number = 0;
  isFullyLoaded = false;
  summaryData: {
    hebrewWord: string;
    correctEnglishWord: string;
    isCorrect: boolean;
  }[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private gameResultService: GameResultService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentCategory = await this.categoriesService.get(this.id);

    if (this.currentCategory?.words) {
      this.setupGame();
      this.isFullyLoaded = true;
      this.cdr.markForCheck();
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
  }

  presentWord(): void {
    const currentIndex = this.wordOrder[this.currentWordIndex];
    const currentWord = this.words?.[currentIndex];
    this.shuffledWord = this.shuffleString(currentWord?.origin || '');
  }

  submit(userInput: string): void {
    this.userInput = userInput.trim();
    const currentIndex = this.wordOrder[this.currentWordIndex];
    const currentWord = this.words?.[currentIndex];
    const isCorrect =
      this.userInput.toLowerCase() === currentWord?.origin.toLowerCase();
    const isLastWord = this.currentWordIndex + 1 === this.wordOrder.length;

    if (currentWord) {
      currentWord.guess = this.userInput;
    }

    if (isCorrect) {
      this.successCount++;
      this.points += this.wordPoints;
    }

    if (!isLastWord) {
      this.dialog
        .open(isCorrect ? SuccessDialogComponent : FailureDialogComponent, {
          data: isCorrect,
        })
        .afterClosed();

      this.currentWordIndex++;
      this.presentWord();
    } else {
      this.gameEnded = true;
      this.showSummary();
      this.cdr.markForCheck();
    }
    this.userInput = '';
  }

  shuffleArray(array: TranslatedWord[]): TranslatedWord[] {
    return array.sort(() => Math.random() - 0.5);
  }

  shuffleString(string: string): string {
    const array = string.split('');
    const shuffledArray = array.slice();

    do {
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
          shuffledArray[j],
          shuffledArray[i],
        ];
      }
    } while (shuffledArray.join('') === string);

    return shuffledArray.join('');
  }

  showSummary(): void {
    this.summaryData =
      this.words?.map((word) => {
        const isCorrect =
          word.guess?.toLowerCase() === word.origin.toLowerCase();
        return {
          hebrewWord: word.target,
          correctEnglishWord: word.origin,
          isCorrect: isCorrect,
        };
      }) || [];

    const gameResult = new GameResult(
      this.currentCategory?.id || 'unknown-category',
      'Mixed Letters',
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

  get progressValue(): number {
    return (this.currentWordIndex / this.totalWords) * 100;
  }
}

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { TranslatedWord } from '../../shared/model/translated-word';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewPointsComponent } from '../view-points/view-points.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GameResultService } from '../services/game-result.service';
import { GameResult } from '../../shared/model/game-result';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-word-sorter',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatTableModule,
    ViewPointsComponent,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './word-sorter.component.html',
  styleUrl: './word-sorter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordSorterComponent implements OnInit {
  @Input() id = '';

  randomCategory?: Category;
  categories: Category[] = [];
  currentCategory?: Category;
  words: TranslatedWord[] = [];
  currentSortingWordIndex: number = 0;
  currentSortingWord?: TranslatedWord;
  sortingPoints: number = 0;
  pointsPerWord: number = 0;
  totalSortingWords: number = 6;
  progressValue: number = 0;
  summaryData: {
    englishWord: string;
    category: string;
    isCorrect: boolean;
  }[] = [];
  isGameFinished: boolean = false;
  isFullyLoaded = false;
  isGameOn: boolean = true;
  numCorrectAnswers: number = 0;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private gameResultService: GameResultService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentCategory = await this.categoriesService.get(this.id);

    this.categories = (await this.categoriesService.list()) || [];

    this.randomCategory = this.getRandomCategory();
    this.initializeWordsAndPoints();
    this.presentNextSortingWord();

    this.cdr.markForCheck();
    this.isFullyLoaded = true;
  }

  private getRandomCategory(): Category | undefined {
    const filteredCategories = this.categories.filter(
      (category) => category.id !== this.currentCategory?.id
    );
    return filteredCategories[
      Math.floor(Math.random() * filteredCategories.length)
    ];
  }

  private initializeWordsAndPoints(): void {
    if (!this.currentCategory || !this.randomCategory) {
      console.error('Category information is missing.');
      return;
    }
    const selectedCategoryWords = this.shuffleArray(
      this.currentCategory?.words ?? []
    ).slice(0, 3);
    const randomCategoryWords = this.shuffleArray(
      this.randomCategory?.words ?? []
    ).slice(0, 3);
    this.words = this.shuffleArray([
      ...selectedCategoryWords,
      ...randomCategoryWords,
    ]);
    this.pointsPerWord = Math.floor(100 / this.totalSortingWords);
  }

  shuffleArray(array: TranslatedWord[]): TranslatedWord[] {
    return array.sort(() => Math.random() - 0.5);
  }

  presentNextSortingWord(): void {
    if (this.currentSortingWordIndex < this.totalSortingWords) {
      this.currentSortingWord = this.words[this.currentSortingWordIndex];
    } else {
      this.endSortingGame();
    }
  }

  checkSortingAnswer(isCorrect: boolean): void {
    if (!this.currentSortingWord || !this.currentCategory) {
      console.error('Current word or category information is missing.');
      return;
    }

    const isAnswerCorrect =
      isCorrect ===
      this.currentCategory.words.includes(this.currentSortingWord);

    this.dialog.open(
      isAnswerCorrect ? SuccessDialogComponent : FailureDialogComponent
    );

    const correctCategory = this.currentCategory.words.includes(
      this.currentSortingWord
    )
      ? this.currentCategory.name
      : this.randomCategory?.name || 'Unknown';

    this.summaryData.push({
      englishWord: this.currentSortingWord.origin,
      category: correctCategory,
      isCorrect: isAnswerCorrect,
    });

    if (isAnswerCorrect) {
      this.sortingPoints += this.pointsPerWord;
      this.numCorrectAnswers++;
    }

    this.currentSortingWordIndex++;
    this.progressValue =
      (this.currentSortingWordIndex / this.totalSortingWords) * 100;

    this.presentNextSortingWord();
  }

  private endSortingGame(): void {
    this.isGameFinished = true;
    this.isGameOn = false;
    const allCorrect = this.summaryData.every((item) => item.isCorrect);
    if (allCorrect) {
      this.sortingPoints = 100;
    }

    if (this.currentCategory) {
      const gameResult = new GameResult(
        this.currentCategory.id,
        'Word Sorter',
        new Date(),
        this.sortingPoints
      );

      this.gameResultService.addGameResult(gameResult);
    }
  }

  exit(): void {
    this.dialog.open(ExitDialogComponent);
  }
}

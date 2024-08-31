import { CategoriesService } from './../services/categories.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Category } from '../../shared/model/category';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { TranslatedWord } from '../../shared/model/translated-word';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewPointsComponent } from "../view-points/view-points.component";


@Component({
  selector: 'app-word-sorter',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatProgressBarModule, MatIconModule,
    ViewPointsComponent
],
  templateUrl: './word sorter.component.html',
  styleUrl: './word sorter.component.css',
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

  constructor(
    private categoriesService: CategoriesService, 
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.categories = this.categoriesService.list(); 
    this.currentCategory = this.categoriesService.get(parseInt(this.id)); 
    this.generateRandomCategory();
    this.generateWordsArray();
    this.presentNextSortingWord(); 
  }

  generateRandomCategory(): void { 
    this.randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)];
  }

  generateWordsArray(): void {
 
    if (!this.currentCategory || !this.randomCategory) {
      console.error("Category information is missing.");
      return;
    }
    const selectedCategoryWords = this.shuffleArray(this.currentCategory.words).slice(0, 3);
    const randomCategoryWords = this.shuffleArray(this.randomCategory.words).slice(0, 3);
    this.words = this.shuffleArray([...selectedCategoryWords, ...randomCategoryWords]);
    this.pointsPerWord = Math.floor(100 / this.totalSortingWords);
  }

  shuffleArray(array: TranslatedWord[]): TranslatedWord[] {
    return array.sort(() => Math.random() - 0.5); 
}


presentNextSortingWord(): void {

  if (this.currentSortingWordIndex < this.words.length) { 
    this.currentSortingWord = this.words[this.currentSortingWordIndex]; 
    this.progressValue = (this.currentSortingWordIndex / this.totalSortingWords) * 100; 
  } else {
    this.endSortingGame();
  }
}

checkSortingAnswer(isCorrect: boolean): void {

  const isAnswerCorrect = isCorrect == this.currentCategory?.words.includes(this.currentSortingWord!);

  this.dialog.open(isAnswerCorrect ? SuccessDialogComponent : FailureDialogComponent).afterClosed().subscribe(() => {
    // פתיחת דיאלוג הצלחה או כישלון לפי התשובה.
    
    if (isAnswerCorrect) {
      this.sortingPoints += this.pointsPerWord; // הוספת הנקודות במידה והתשובה נכונה.
    }

    if (this.currentSortingWordIndex + 1 < this.words.length) {
      this.currentSortingWordIndex++;
      this.presentNextSortingWord(); // הצגת המילה הבאה.
    } else {
      this.endSortingGame(); // אם אין מילים נוספות, סיום המשחק.
    }
  });
}

endSortingGame(): void {
  this.showSortingSummary();
}

showSortingSummary(): void {
  const summaryData = this.words.map(word => {
    const isCorrect = this.currentCategory?.words.includes(word);
    return {
      hebrewWord: word.target, // המילה בעברית.
      correctEnglishWord: word.origin, // המילה באנגלית.
      isCorrect: isCorrect // האם השחקן שייך את המילה נכון.
    };
  });

  // MatTable להציג את הנתונים בסיכום בעמודות מסודרות.
}


exit(): void {
  this.dialog.open(ExitDialogComponent); 
}
}

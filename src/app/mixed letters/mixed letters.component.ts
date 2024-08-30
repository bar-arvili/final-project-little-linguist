import { CategoriesService } from './../services/categories.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Category } from '../../shared/model/category';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExitButtonComponent } from '../exit-button/exit-button.component';
import { TranslatedWord } from '../../shared/model/translated-word';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { ViewPointsComponent } from '../view-points/view-points.component';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';

@Component({
  selector: 'app-mixed-letters',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatProgressBarModule,
    ExitButtonComponent,ViewPointsComponent
],
  templateUrl: './mixed letters.component.html',
  styleUrl: './mixed letters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedLettersComponent implements OnInit {

  @Input() id = '';

  currentCategory?: Category;
  words?: TranslatedWord[]; 
  wordOrder: number[] = []; // מערך לשמירת סדר הצגת המילים
  currentWordIndex: number = 0;
  mixWord: string = '';
  endGame: boolean = false;
  sumSuccess: number = 0;
  userInput = '';
  points = 0;
  wordPoints: number = 0;
  totalWords: number = 0;

  constructor(
    private categoriesService: CategoriesService, 
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.startGame();
  }

  // פונקציה ראשית שמתחילה את התהליך
  startGame(): void {
    this.getCategoryInfo();
  }

  // קבלת פרטי קטגוריה
  getCategoryInfo(): void {
    this.currentCategory = this.categoriesService.get(parseInt(this.id));
    if (this.currentCategory && this.currentCategory.words) {
      this.createWordsArray();
    } 
  }

  // יצירת מערך עם מילים הקטגוריה בסדר אקראי
  createWordsArray(): void {
    this.words = this.shuffleArray(this.currentCategory?.words || []); // ערבוב המערך
    this.totalWords = this.words.length; // ספירת כמות המילים
    this.wordPoints = Math.floor(100 / this.totalWords); // חישוב מספר הנקודות 
    this.points = 0; // אתחול נקודות ל-0
    this.createWordOrder(); // יצירת סדר אקראי להצגת המילים
    this.presentWord(); // הצגת המילה הראשונה
  }

  // יצירת סדר אקראי של אינדקסים
  createWordOrder(): void {
    this.wordOrder = Array.from({ length: this.totalWords }, (_, i) => i); // יוצרים מערך של אינדקסים
  }

  presentWord(): void {
    const currentIndex = this.wordOrder[this.currentWordIndex]; // קבלת האינדקס הנוכחי במערך המוקטן
    const currentWord = this.words?.[currentIndex]; // גישה למילה לפי האינדקס האקראי
    this.mixWord = this.shuffleString(currentWord?.origin || ''); // ערבוב אותיות המילה
  }

 
  totalSuccessPoints(): void {
    this.sumSuccess = this.sumSuccess / this.totalWords;
    // this.showSummary();
  }

  // פונקציות עזר
  shuffleArray(array: TranslatedWord[]): TranslatedWord[] {
    return array.sort(() => Math.random() - 0.5); // ערבוב רנדומלי של מערך אובייקטים
  }


  shuffleString(string: string): string {
    return string.split('').sort(() => Math.random() - 0.5).join(''); // Shuffle letters within the word
  }

  reset() {
    this.userInput = '';
  }

  submit(userInput: string): void {
    this.userInput = userInput; // קליטת תשובות מהמשתמש
    const currentIndex = this.wordOrder[this.currentWordIndex]; // קבלת האינדקס הנוכחי במערך המוקטן
    const currentWord = this.words?.[currentIndex]; // גישה למילה לפי האינדקס האקראי
    const isSuccess = this.userInput.toLowerCase() == currentWord?.origin.toLowerCase(); // השוואה בין התשובה של המשתמש לנכונה
    const isEndOfGame = this.currentWordIndex + 1 == this.wordOrder.length; // בדיקה אם המשחק הסתיים
    
    if (!isEndOfGame) {
      this.dialog.open(isSuccess ? SuccessDialogComponent : FailureDialogComponent, {
        data: isSuccess,
      }).afterClosed();

        this.moveToNextWord(); // מעבר למילה הבאה לאחר סגירת הדיאלוג
      };
    
    if (isSuccess) {
      this.sumSuccess++;
      this.points += this.wordPoints;
    } 

    if (isEndOfGame) {
      this.endGame = true;
      this.totalSuccessPoints();
    }
  }

  moveToNextWord(): void {
    this.userInput = '';
    this.currentWordIndex++;
    if (this.currentWordIndex < this.totalWords) {
      this.presentWord();
    } else {
      this.showSummary();
      this.endGame = true;
    }
  }


  showSummary(): void {
    // הכנת הנתונים לסיכום
    const summaryData = this.words?.map((word, index) => {
      const isCorrect = word.guess?.toLowerCase() === word.origin.toLowerCase();
      return {
        hebrewWord: word.target, // מניחים שזו המילה בעברית
        correctEnglishWord: word.origin, // המילה באנגלית
        isCorrect: isCorrect // האם הניחוש היה נכון
      };
    }) || [];

    // פתיחת הדיאלוג עם הנתונים
    this.dialog.open(SummaryDialogComponent, {
      data: {
        points: this.points,
        totalWords: this.totalWords,
        sumSuccess: this.sumSuccess,
        summaryData: summaryData
      }
    });
  }

  exit(): void {
    this.dialog.open(ExitDialogComponent);
  }

  get progressValue(): number {
    return (this.currentWordIndex / this.totalWords) * 100;
  }
}
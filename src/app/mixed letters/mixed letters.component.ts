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

@Component({
  selector: 'app-mixed-letters',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatProgressBarModule,
    ExitButtonComponent
],
  templateUrl: './mixed letters.component.html',
  styleUrl: './mixed letters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedLettersComponent implements OnInit {
openExitDialog() {
throw new Error('Method not implemented.');
}
  @Input() id = '';

  currentCategory?: Category;
  words? : TranslatedWord[]; 
  currentWordIndex : number = 0 ;
  mixWord: string = '';
  endGame: boolean = false;
  sumSuccess: number = 0;
  userInput = '';
  points = 0;
  wordPoints: number = 0 ;
  totalWords: number = 0 ;
  
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
    } else {
      console.error('Selected category or words are undefined');
    }
  }

  // יצירת מערך עם מילים הקטגוריה בסדר אקראי
  createWordsArray(): void {
    this.words = this.shuffleArray(this.currentCategory?.words || []);
    this.totalWords = this.words.length;
    this.wordPoints = Math.floor(100 / this.totalWords);
    this.currentWordIndex = 0;
    this.points = 0;
    this.shuffleCurrentWord();
  }

  // סידור אקראי של אותיות המילה הראשונה
  shuffleCurrentWord(): void {
    this.mixWord = this.shuffleString(this.words?.[this.currentWordIndex]?.origin || '');
  }

  // אתחול משתנה כמות נקודות להיחשב מוצלח לפי כמות המילים סה"כ
  calculateSuccessPoints(): void {
    this.sumSuccess = Math.floor((this.points / this.totalWords) * 100);
   // this.showSummary();
  }

  // פונקציות עזר
  shuffleArray(array: TranslatedWord[]): TranslatedWord[] {
    return array.sort(() => Math.random() - 0.5); // ערבוב רנדומלי של מערך אובייקטים
  }

  shuffleString(str: string): string {
    return str.split('').sort(() => Math.random() - 0.5).join(''); // Shuffle letters within the word
  }

  presentWord(): void {
    const currentWord = this.words?.[this.currentWordIndex]; 
    this.mixWord = this.shuffleString(currentWord?.origin || ''); 
  }


  reset() {
    if (this.words) this.words[this.currentWordIndex].guess = '';
  }

  submit(userInput: string): void {
    this.userInput = userInput;
    const currentWord = this.words && this.words[this.currentWordIndex];
    const isSuccess = this.userInput.toLowerCase() === currentWord?.origin.toLowerCase();
    const isEndOfGame = this.currentWordIndex + 1 === this.words?.length;
    
    if (!isEndOfGame) {
      this.dialog.open(isSuccess ? SuccessDialogComponent : FailureDialogComponent, {
        data: isSuccess,
      }).afterClosed().subscribe(() => {
        this.moveToNextWord();
      });
    }

    if (isSuccess) {
      this.sumSuccess++;
      this.points += this.wordPoints;
    } else {
      this.points = this.wordPoints;
    }

    if (isEndOfGame) {
      this.endGame = true;
      this.calculateSuccessPoints();
    }
  }

  moveToNextWord(): void {
    this.userInput = '';
    this.currentWordIndex++;
    if (this.currentWordIndex < this.totalWords) {
      this.presentWord();
    } else {
      //this.showSummary();
    }
  }

  exit(): void {
    this.dialog.open(ExitDialogComponent);
  }

  //showSummary(): void {
    //this.dialog.open(SummaryDialogComponent, {
      //data: {
        //points: this.points,
        //totalWords: this.totalWords,
       // successes: this.sumSuccess
     // }
    //});
  //}
//}


  // חישוב ערך סרגל ההתקדמות
  get progressValue(): number {
    return (this.currentWordIndex / this.totalWords) * 100;
  }
}
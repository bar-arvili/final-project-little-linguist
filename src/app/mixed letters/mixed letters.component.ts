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
  words : string [] = []; 
  currentWordIndex = 0;
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
    this.loadCategory();

     this.currentCategory = this.categoriesService.get(parseInt(this.id));

  }

  loadCategory(): void {
    if (this.currentCategory!== undefined) {  
      this.currentCategory = this.categoriesService.get(this.currentCategory.id);
    
      if (this.currentCategory && this.currentCategory.words)  {
        this.words = this.shuffleArray(this.currentCategory.words.map(word => word.origin)); // או word.target
        this.totalWords = this.words.length;
        this.wordPoints = Math.floor(100 / this.totalWords);
        this.currentWordIndex = 0;
        this.points = 0;
        this.presentWord();
      } else {
        console.error('Selected category or words are undefined');
      }
    } else {
      console.error('selectedCategoryId is undefined');
      // ניתן להוסיף כאן טיפול במקרה של undefined, כמו ניווט חזרה לעמוד הבחירה או הצגת הודעה למשתמש
    }
  }

  shuffleArray(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5); // Randomly shuffle the array
  }

  presentWord(): void {
    const currentWord = this.words[this.currentWordIndex];
    this.mixWord  = this.shuffleString(currentWord);
  }

  shuffleString(str: string): string {
    return str.split('').sort(() => Math.random() - 0.5).join(''); // Shuffle letters within the word
  }

  onSubmit(): void {
    if (this.userInput.toLowerCase() === this.words[this.currentWordIndex].toLowerCase()) {
      this.points += this.wordPoints;
      this.dialog.open(SuccessDialogComponent).afterClosed().subscribe(() => {
        this.moveToNextWord();
      });
    } else {
      this.dialog.open(FailureDialogComponent).afterClosed().subscribe(() => {
        this.moveToNextWord();
      });
    }
  }

  moveToNextWord(): void {
    this.userInput = '';
    this.currentWordIndex++;
    if (this.currentWordIndex < this.totalWords) {
      this.presentWord();
    } else {
      this.showSummary();
    }
  }

  showSummary(): void {
    // Navigate to the summary screen or show summary dialog
  }

  onReset(): void {
    this.userInput = '';
  }

  onExit(): void {
    // Implement exit logic, navigate back to the category selection or home screen
  }
}



import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-summary-dialog',
  standalone: true,
  imports: [MatIconModule,MatTableModule,MatButtonModule,MatDialogModule],
  templateUrl: './summary-dialog.component.html',
  styleUrl: './summary-dialog.component.css'
})
export class SummaryDialogComponent {
[x: string]: any; 
  displayedColumns: string[] = ['hebrewWord', 'correctEnglishWord', 'isCorrect'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}

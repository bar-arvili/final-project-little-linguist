import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';

@Component({
  selector: 'app-exit-button',
  standalone: true,
  imports: [MatDialogModule, RouterModule,  MatSelectModule,MatButtonModule, MatIconModule],
  templateUrl: './exit-button.component.html',
  styleUrl: './exit-button.component.css'
})
export class ExitButtonComponent {


  constructor(public dialog: MatDialog) {}

  openExitDialog(): void {
    this.dialog.open(ExitDialogComponent); // פותח את הדיאלוג
  }
}
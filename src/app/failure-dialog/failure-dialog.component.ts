import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-failure-dialog',
  standalone: true,
  imports: [MatIconModule,MatIconButton,MatDialogModule],
  templateUrl: './failure-dialog.component.html',
  styleUrl: './failure-dialog.component.css'
})
export class FailureDialogComponent {

}

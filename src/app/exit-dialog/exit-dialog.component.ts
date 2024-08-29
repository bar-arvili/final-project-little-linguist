import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exit-dialog',
  standalone: true,
  imports: [MatDialogModule, RouterModule,  MatSelectModule,MatButtonModule, MatIconModule],
  templateUrl: './exit-dialog.component.html',
  styleUrl: './exit-dialog.component.css'
})
export class ExitDialogComponent {
}

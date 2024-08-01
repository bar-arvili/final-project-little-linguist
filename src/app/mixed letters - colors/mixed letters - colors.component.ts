import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mixed-letters---colors',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mixed letters - colors.component.html',
  styleUrl: './mixed letters - colors.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedLettersColorsComponent { }

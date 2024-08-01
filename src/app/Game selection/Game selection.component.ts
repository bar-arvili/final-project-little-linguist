import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './Game selection.component.html',
  styleUrl: './Game selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSelectionComponent { }

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-word-sorter---colors',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './word sorter - colors.component.html',
  styleUrl: './word sorter - colors.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordSorterColorsComponent { }

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-word-sorter',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './word sorter.component.html',
  styleUrl: './word sorter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordSorterComponent {
  @Input() id= ''
 }

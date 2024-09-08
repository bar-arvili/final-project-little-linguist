import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-points',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './view-points.component.html',
  styleUrl: './view-points.component.css',
})
export class ViewPointsComponent {
  @Input() points: number = 0;
}

import { MatCardModule } from '@angular/material/card';
import { GamesService } from './../services/games.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { GameProfile } from '../../shared/model/gameProfile';



@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    MatCardModule,
  ],
  templateUrl: './Game selection.component.html',
  styleUrl: './Game selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSelectionComponent implements OnInit { 
  @Input()
  allGames: GameProfile[] = [];

  constructor(private gamesService: GamesService, private router: Router) {}

  ngOnInit(): void {
    this.allGames = this.gamesService.getGames();
  }

  navigateToGame(gameUrl: string): void {
    this.router.navigate([gameUrl]);
  }
}



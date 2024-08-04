import { GamesService } from './../services/games.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, } from '@angular/core';
import { GameProfile } from '../../shared/model/gameProfile';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CategorySelectionComponent } from '../Category selection/Category selection.component';

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './Game selection.component.html',
  styleUrl: './Game selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GameSelectionComponent implements OnInit {
  allGames: GameProfile[] = [];

  constructor(private gamesService: GamesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.allGames = this.gamesService.getGames();
    console.log(this.allGames); 
  }

  loadGames(): void {
    this.allGames = this.gamesService.getGames(); 
  }

  openDialog(game: GameProfile): void {
    this.dialog.open(CategorySelectionComponent, {
      data: { game }
    });
  }
}

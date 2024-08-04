
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../shared/model/category';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { GamesService } from '../services/games.service';
import { GameProfile } from '../../shared/model/gameProfile';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './Category selection.component.html',
  styleUrl: './Category selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySelectionComponent implements OnInit {

  categories: Category[] = [];
  allGames : GameProfile[] = [];
  selectedCategory?: Category;
  

  constructor(
    private categoriesService: CategoriesService,
    private gamesService: GamesService,
    private dialogRef: MatDialogRef<CategorySelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public game : GameProfile,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    // this.allGames = this.gamesService.getGames();
  }

  loadCategories(): void {
    this.categories = this.categoriesService.list();
  }

  onCategorySelected(categoryId: number): void {
    this.selectedCategory = this.categories.find(category => category.id === categoryId);
  }

  onPlayClick(): void {
    if (this.selectedCategory) {
      this.dialogRef.close(this.selectedCategory);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
  
 

import { Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameSelectionComponent } from './Game selection/Game selection.component';
import { HelpComponent } from './help/help.component';
import { MixedLettersComponent } from './mixed letters/mixed letters.component';
import { WordSorterComponent } from './word sorter/word sorter.component';
import { CategorySelectionComponent } from './Category selection/Category selection.component';

export const routes: Routes = [
    {path: "Admin", component: CategoriesListComponent},
    {path: "category/:id", component: CategoryFormComponent},
    {path: "newcategory", component: CategoryFormComponent},
    {path: "dashboard", component: DashboardComponent},
    {path: "Game-selection", component: GameSelectionComponent},
    {path: "help", component: HelpComponent},
    {path: "mixed-letters/:id", component: MixedLettersComponent},
    {path: "word-sorter /:id", component: WordSorterComponent},
    {path: "Category-selection", component: CategorySelectionComponent},
    
];

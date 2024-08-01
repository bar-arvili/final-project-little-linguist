import { Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameSelectionComponent } from './Game selection/Game selection.component';
import { HelpComponent } from './help/help.component';
import { MixedLettersColorsComponent } from './mixed letters - colors/mixed letters - colors.component';
import { WordSorterColorsComponent } from './word sorter - colors/word sorter - colors.component';

export const routes: Routes = [
    {path: "", component: CategoriesListComponent},
    {path: "category/:id", component: CategoryFormComponent},
    {path: "newcategory", component: CategoryFormComponent},
    {path: "dashboard", component: DashboardComponent},
    {path: "Game-selection", component: GameSelectionComponent},
    {path: "help", component: HelpComponent},
    {path: "mixed-letters-colors", component: MixedLettersColorsComponent},
    {path: "word-sorter-colors", component: WordSorterColorsComponent},
];

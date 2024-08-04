import { CategoriesService } from './../services/categories.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Category } from '../../shared/model/category';


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
export class WordSorterComponent implements OnInit {
  @Input() id = '';

  currentCategory?: Category;

  constructor(private CategoriesService: CategoriesService) { }
  
  ngOnInit(): void {
    this.currentCategory = this.CategoriesService.get(parseInt(this.id));
  }
}
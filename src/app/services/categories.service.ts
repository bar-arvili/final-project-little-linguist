import { Injectable } from '@angular/core';
import { Category } from '../../shared/model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  private readonly CATEGORIES_KEY = 'categories';
  private readonly NEXT_ID_KEY = 'nextId';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getCategories(): Map<number, Category> {
    // eslint-disable-next-line prefer-const
    let categoriesString = localStorage.getItem(this.CATEGORIES_KEY);

    if (!categoriesString) {
      return new Map<number, Category>();
    } else {
      return new Map<number, Category>(JSON.parse(categoriesString));
    }
  }

  private getNextId(): number {
    // eslint-disable-next-line prefer-const
    let nextIdString = localStorage.getItem(this.NEXT_ID_KEY);

    return nextIdString ? parseInt(nextIdString) : 0;
  }

  private setCategories(list: Map<number, Category>): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(Array.from(list)));
  }

  private setNextId(id: number): void {
    localStorage.setItem(this.NEXT_ID_KEY, id.toString());
  }

  list(): Category[] {
    return Array.from(this.getCategories().values());
  }

  get(id: number): Category | undefined {
    return this.getCategories().get(id);
  }

  delete(id: number): void {
    // eslint-disable-next-line prefer-const
    let categoriesMap = this.getCategories();
    categoriesMap.delete(id);
    this.setCategories(categoriesMap);
  }

  update(category: Category): void {
    // eslint-disable-next-line prefer-const
    let categoriesMap = this.getCategories();

    category.lastUpdateDate = new Date();
    categoriesMap.set(category.id, category);

    this.setCategories(categoriesMap);
  }

  add(category: Category): void {
    category.id = this.getNextId();
    category.lastUpdateDate = new Date();

    // eslint-disable-next-line prefer-const
    let categoriesMap = this.getCategories();
    categoriesMap.set(category.id, category);

    this.setCategories(categoriesMap);
    this.setNextId(++category.id);
  }
}

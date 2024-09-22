import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { Category } from '../../shared/model/category';
import { categoryConverter } from './converters/category-converter';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private collectionName = 'categories';

  constructor(private firestore: Firestore) {}

  private getCategoryCollection() {
    return collection(this.firestore, this.collectionName).withConverter(
      categoryConverter
    );
  }

  private getCategoryDoc(id: string): DocumentReference<Category> {
    return doc(this.firestore, this.collectionName, id).withConverter(
      categoryConverter
    );
  }

  async list(): Promise<Category[]> {
    const querySnapshot: QuerySnapshot<Category> = await getDocs(
      this.getCategoryCollection()
    );
    const result: Category[] = [];

    querySnapshot.docs.forEach((docSnap: DocumentSnapshot<Category>) => {
      const data = docSnap.data();
      if (data) {
        result.push(data);
      }
    });

    return result;
  }

  async get(id: string): Promise<Category | undefined> {
    const docRef = this.getCategoryDoc(id);
    const categorySnap = await getDoc(docRef);
    return categorySnap.exists() ? categorySnap.data() : undefined;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.getCategoryDoc(id);
    await deleteDoc(docRef);
  }

  async update(category: Category): Promise<void> {
    const docRef = this.getCategoryDoc(category.id);
    category.lastUpdateDate = new Date();
    await setDoc(docRef, category);
  }

  async add(category: Category): Promise<void> {
    await addDoc(this.getCategoryCollection(), category);
  }
}

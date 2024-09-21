import { Category } from '../../../shared/model/category';
import { Language } from '../../../shared/model/language';
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';

export const categoryConverter: FirestoreDataConverter<Category> = {
  toFirestore: (categoryToSave: Category) => {
    const wordsArray = [];
    for (let i = 0; i < categoryToSave.words.length; ++i) {
      wordsArray.push({
        origin: categoryToSave.words[i].origin,
        target: categoryToSave.words[i].target,
      });
    }

    return {
      name: categoryToSave.name,
      originLanguage: categoryToSave.origin,
      targetLanguage: categoryToSave.target,
      words: wordsArray,
      lastUpdate: categoryToSave.lastUpdateDate,
    };
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    const originLang: Language =
      data['originLanguage'] === 'Hebrew' ? Language.Hebrew : Language.English;
    const targetLang: Language =
      data['targetLanguage'] === 'Hebrew' ? Language.Hebrew : Language.English;

    const category = new Category(
      snapshot.id,
      data['name'],
      originLang,
      targetLang
    );

    category.lastUpdateDate = data['lastUpdate'].toDate();
    category.words = data['words'];

    return category;
  },
};

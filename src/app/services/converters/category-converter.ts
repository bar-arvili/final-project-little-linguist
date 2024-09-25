import { Category } from '../../../shared/model/category';
import { Language } from '../../../shared/model/language';
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { TranslatedWord } from '../../../shared/model/translated-word';

export const categoryConverter: FirestoreDataConverter<Category> = {
  toFirestore: (categoryToSave: Category) => {
    const wordsArray = categoryToSave.words.map((word) => ({
      origin: word.origin,
      target: word.target,
    }));

    return {
      name: categoryToSave.name,
      originLanguage: categoryToSave.origin,
      targetLanguage: categoryToSave.target,

      words: wordsArray.length > 0 ? wordsArray : undefined,

      lastUpdate: categoryToSave.lastUpdateDate || undefined,
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

    if (data['lastUpdate']) {
      category.lastUpdateDate = data['lastUpdate'].toDate();
    }

    if (data['words']) {
      category.words = data['words'].map(
        (word: { origin: string; target: string }) =>
          new TranslatedWord(word.origin, word.target)
      );
    }

    return category;
  },
};

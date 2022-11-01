import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { profileModels } from '../models/profile.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private profileCollection: AngularFirestoreCollection<profileModels>;
  profiles: Observable<profileModels[]>;

  constructor(private firestore: Firestore, private afs: AngularFirestore) {}

  getProfiles() {}
}

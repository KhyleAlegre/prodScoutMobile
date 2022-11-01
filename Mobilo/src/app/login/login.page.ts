import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { profileModels } from '../models/profile.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private router: Router,
    public alertController: AlertController,
    public afs: AngularFirestore,
    private dataService: DataService
  ) {}
  profileId: any;
  password: any;
  profileList: profileModels[];
  profiles: profileModels[];

  ngOnInit() {}

  login() {
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }
}

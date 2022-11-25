import { Component } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { profileModels } from './models/profiles.model';
import { Dialogs } from '@awesome-cordova-plugins/dialogs/ngx';
import { AlertController } from '@ionic/angular';
import { userModel } from './models/user.model';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  profileId: any;
  username: any;
  browser: any;
  profileList: profileModels[];
  loggedProfileId: any;
  loggedUsername: any;
  logprofileList: profileModels[];
  nudgeRequest: any;
  ssRequest: any;
  orientStatus: any;
  galleryLogDate: any;
  sessionTimeStamp: any;
  logDate: any;
  useremail: any;
  userContact: any;
  userList: userModel[];
  mobileEvent: any;

  private logprofileCollection!: AngularFirestoreCollection<profileModels>;
  logprofiles!: Observable<profileModels[]>;

  private userCollection: AngularFirestoreCollection<userModel>;
  users: Observable<userModel[]>;

  constructor(
    private background: BackgroundMode,
    private autostart: Autostart,
    private screenOrient: ScreenOrientation,
    private iab: InAppBrowser,
    public afs: AngularFirestore,
    public alertController: AlertController
  ) {
    setInterval(() => {
      this.background.enable();
      this.background.setEnabled(true);
      this.autostart.enable();
    }, 3000);

    this.screenOrient.onChange().subscribe(() => {
      console.log('Orientation Changed');
      console.log(this.screenOrient.type);
      this.orientStatus = this.screenOrient.type;
    });
  }
}

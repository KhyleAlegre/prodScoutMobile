import { Component } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { profileModels } from '../models/profiles.model';
import { AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { App } from '@capacitor/app';
import { Screenshot } from 'capacitor-screenshot';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { userModel } from '../models/user.model';
import { Dialogs } from '@awesome-cordova-plugins/dialogs/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profileId: any;
  username: any;
  ssUrl: any;
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

  private profileCollection: AngularFirestoreCollection<profileModels>;
  profiles: Observable<profileModels[]>;

  private logprofileCollection!: AngularFirestoreCollection<profileModels>;
  logprofiles!: Observable<profileModels[]>;

  private userCollection: AngularFirestoreCollection<userModel>;
  users: Observable<userModel[]>;

  constructor(
    private iab: InAppBrowser,
    public afs: AngularFirestore,
    public alertController: AlertController,
    private screenOrient: ScreenOrientation,
    private background: BackgroundMode,
    private autostart: Autostart,
    private dialogs: Dialogs,
    private localNotifications: LocalNotifications
  ) {
    this.profileCollection = this.afs.collection('profiles');
    this.profiles = this.profileCollection.valueChanges();
    this.profiles.subscribe(
      (data) => ((this.profileList = data), console.log(this.profileList))
    );

    setInterval(() => {
      this.getProfile();
      this.checkNudge();
      this.getUser();
      this.background.enable();
      this.autostart.enable();
    }, 3000);

    this.screenOrient.onChange().subscribe(() => {
      this.getScreenshot();
      this.logEvents();
    });
  }

  login() {
    if (!this.profileId || !this.username) {
      this.emptyAlert();
    } else {
      for (let i = 0; i < this.profileList.length; i++) {
        if (
          this.profileId == this.profileList[i].profileId &&
          this.username == this.profileList[i].username
        ) {
          this.scoutNotify();
          localStorage.setItem('logProfile', this.profileId);
          localStorage.setItem('logUser', this.username);
          this.username = '';
          this.profileId = '';
          return;
        }
      }

      this.invalidAlert();
    }
  }

  startScout() {
    this.background.enable();
    this.background.setEnabled(true);
    App.minimizeApp();
  }

  logEvents() {
    this.orientStatus = this.screenOrient.type;
    console.log(this.orientStatus);
    this.logDate = new Date();
    this.afs.collection('profileLogs').add({
      eventDetails: 'Screen orientation switched to ' + this.orientStatus,
      isIncognito: 'Mobile',
      logDate: this.logDate,
      profileName: this.loggedProfileId,
      userName: this.loggedUsername,
    });

    this.sessionTimeStamp = new Date();
    this.afs.collection('sessions').add({
      deviceType: 'Mobile',
      sessionMode: 'Screen orientation switched to ' + this.orientStatus,
      sessionStatus: true,
      photoUrl: this.ssUrl,
      sessiongLogDate: this.sessionTimeStamp,
      displaySessionDate: this.sessionTimeStamp.toLocaleDateString(),
      displaySessionTime: this.sessionTimeStamp.toLocaleTimeString('en-US'),
      profileId: this.loggedProfileId,
      profileType: 'Regular',
      violationLevel: 'None (Orientation Checking)',
      screenShotTrigger: '',
      profileStatus: 'Active',
      profilePassword: 'N/A',
      username: this.loggedUsername,
    });
    // Send Email

    this.afs.collection('mail').add({
      to: this.useremail,
      message: {
        subject: 'Scout Alert - Mobile Screen Orientation Detected',
        html:
          'Our scouts have noticed an screen orientation changed from ' +
          this.orientStatus +
          ' on ' +
          this.loggedProfileId +
          "'s" +
          ' device, We have logged this activity and saved a screenshot. Please login and check',
      },
    });

    // Send SMS

    this.afs.collection('messages').add({
      to: this.userContact,
      body:
        'Screen Orientation has been detected, on ' +
        this.loggedProfileId +
        ', you may log in to check what is going on',
    });
  }

  getProfile() {
    this.loggedProfileId = localStorage.getItem('logProfile');
    this.loggedUsername = localStorage.getItem('logUser');
    console.log(this.loggedProfileId, this.loggedUsername);

    this.logprofileCollection = this.afs.collection('profiles', (ref) =>
      ref
        .where('profileId', '==', this.loggedProfileId)
        .where('username', '==', this.loggedUsername)
    );

    this.logprofiles = this.logprofileCollection.valueChanges();
    this.logprofiles.subscribe(
      (data) => (
        (this.logprofileList = data),
        console.log(this.logprofileList),
        (this.nudgeRequest = this.logprofileList[0].nudge),
        (this.ssRequest = this.logprofileList[0].ssrequest)
      )
    );
  }

  getUser() {
    this.userCollection = this.afs.collection('users', (ref) =>
      ref.where('username', '==', this.loggedUsername)
    );

    this.users = this.userCollection.valueChanges();
    this.users.subscribe(
      (data) => (
        (this.userList = data),
        (this.useremail = this.userList[0].email),
        (this.userContact = this.userList[0].contactNo),
        console.log(this.useremail, this.userContact)
      )
    );
  }

  checkNudge() {
    if (this.nudgeRequest == true) {
      this.nudgeAlert();
      this.nudgeNotif();
    }
  }

  getScreenshot() {
    Screenshot.take().then((ret: { base64: string }) => {
      this.ssUrl = `data:image/png;base64,${ret.base64}`;

      this.galleryLogDate = new Date();
      this.afs.collection('gallery').add({
        ssUrl: this.ssUrl,
        profileId: this.loggedProfileId,
        userName: this.loggedUsername,
        logDate: this.galleryLogDate,
      });
    });
  }

  async emptyAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'System Alert',
      message: 'This profileId / username field is required',
      buttons: ['OK'],
    });

    await alert.present();
    return;
  }

  async invalidAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Log In',
      message: 'Invalid Credentials, Please try again',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async scoutNotify() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Scout Notif',
      message: 'We are now scouting this device',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async nudgeAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'We are watching you',
      message: 'Please focus on your studies or activities',
      buttons: ['OK'],
    });

    await alert.present();
    return;
  }

  nudgeNotif() {
    //this.browser = this.iab.create('https://prodscout.vercel.app/#/blocked');
    this.localNotifications.schedule({
      id: 1,
      text: 'We are watching you, Please focus on your studies and activities',
      foreground: true,
    });
    this.getScreenshot();
    this.logEvents();
  }
}

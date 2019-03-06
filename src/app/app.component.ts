import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {
      this.checkPermissionAndCallDownload();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
  }
  checkPermissionAndCallDownload(){
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
    if (status.hasPermission) {
    this.gologin();
    } 
    else {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
    if(status.hasPermission) {
    this.gologin();
    }
    });
    }
    });
    }

    gologin(){
      this.rootPage=MapPage
    }
 
}


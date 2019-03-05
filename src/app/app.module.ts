import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Downloader } from '@ionic-native/downloader';
// import { FileChooser } from '@ionic-native/file-chooser';
// import { File } from '@ionic-native/file';
import { MapPageModule } from '../pages/map/map.module';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps} from '@ionic-native/google-maps';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AndroidPermissions } from '@ionic-native/android-permissions';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB2X11DHiZ_28dlWdaeaJnIAFLO5kNf28M",
    authDomain: "myproject-6206f.firebaseapp.com",
    databaseURL: "https://myproject-6206f.firebaseio.com",
    projectId: "myproject-6206f",
    storageBucket: "myproject-6206f.appspot.com",
    messagingSenderId: "628832079892"
  };
  firebase.initializeApp(config);


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    MapPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    BarcodeScanner,
    Downloader,
    Geolocation,
    GoogleMaps,
    TextToSpeech,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

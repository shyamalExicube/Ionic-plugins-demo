import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {mapStyle} from './mapStyle'
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map_canvas') mapElement: ElementRef;
  public myLat:any;
  public myLong:any;
  map: GoogleMap;
  public location:any;
  public changemap:any;
  public mapBackground:boolean;
  


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    public zone:NgZone
    ) {
  this.currentLocation();
  this.mapBackground = true;
  this.changemap = mapStyle
  }

  mapbackgroundchange(){
    this.zone.run(()=>{
      this.map.setOptions({
        styles: this.mapBackground === true? this.changemap[0] : this.changemap[1],
      })
    })
  }

  ionViewDidLoad() {
    this.loadMap();
  }
  currentLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.myLat=resp.coords.latitude;
      this.myLong=resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
  }
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.myLat=resp.coords.latitude;
      this.myLong=resp.coords.longitude;
      console.log("My current position");
      console.log(resp);
      console.log("My current position");
      let mapOptions: GoogleMapOptions = {
        controls: {
          'compass': true,
          'myLocationButton': true,
          'myLocation': true,   // (blue dot)
          'indoorPicker': true,
          'zoom': true,          // android only
          'mapToolbar': true     // android only
        },
      
        gestures: {
          scroll: true,
          tilt: true,
          zoom: true,
          rotate: true
        },

        styles: this.changemap[0],
        
        camera: {
           target: {
             lat: this.myLat,
             lng: this.myLong
           },
           zoom: 18,
           tilt: 30
         }
      };
  
      this.map = GoogleMaps.create('map_canvas', mapOptions);
  
      let marker: Marker = this.map.addMarkerSync({
        title: 'Current Position',
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: this.myLat,
          lng: this.myLong
        }
      }); 
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        console.log('clicked');
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
}

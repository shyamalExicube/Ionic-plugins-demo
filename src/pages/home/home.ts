import { Component, ɵConsole, NgZone } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader';
// import { FileChooser } from '@ionic-native/file-chooser';
// import { File } from '@ionic-native/file';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AndroidPermissions } from '@ionic-native/android-permissions';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public base64Image: string;
  public storageRef:any;
  public localData:any=[];
  public myImage:any={};
  public url:any;
  window:any;
  public type:any;
  public myDocument:any;
  public image:any;
  public finalExtention:any;
  public text:string;
  public items:any;
  public profileImage:any;
  public imageName:any



  constructor(public navCtrl: NavController,
    private camera: Camera,
    public actionSheetCtrl:ActionSheetController,
    private barcodeScanner: BarcodeScanner,
    private downloader: Downloader,
    // private fileChooser: FileChooser,
    // public file:File,
    public zone:NgZone,
    private tts: TextToSpeech,
    public androidPermissions:AndroidPermissions
    ) {
    var value = [{name:"shyamal",location:"Kolkata"},{name:"Rajat",location:"Kolkata"}]
    localStorage.setItem('value',JSON.stringify(value));
    let newData=localStorage.getItem('value');
    console.log(newData);
    this.localData=JSON.parse(newData);
    console.log(this.localData);
    const images=firebase.database().ref(`Images`);
    images.on('value',snapShot=>{
      this.myImage=snapShot.val();
      console.log(this.myImage);
    })

   //It's an example of Promise in JavaScript
   let promiseToCleanTheRoom = new Promise(function(resolve,reject){
     let isClean =false;
     if(isClean){
       resolve('clean');
     }else{
       reject('not clean');
     }
   });
  promiseToCleanTheRoom.then(function(fromResolve){
    console.log(fromResolve);
  }).catch(function(fromReject){
    console.log(fromReject);
  })
  this.initializeItems();
  }

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      'Kolkata',
      'Delhi'
    ]
  }
  getItems(ev: any){
    this.initializeItems();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // console.log(this.base64Image);
     }, (err) => {
       console.log(err);
     });
  }
  galleryClick(){
    const galleryOptions: CameraOptions = {
      quality: 20,
      targetWidth: 1920,
      targetHeight: 1920,
      allowEdit : true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation:true,
    }
    this.camera.getPicture(galleryOptions).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // console.log(this.base64Image); 
     }, (err) => {
       console.log(err);
     });
    }

    mediaOption(){
        let actionSheet = this.actionSheetCtrl.create({
          title: "Make a choice",
          buttons: [
            {
              text: "Camera",
              role: 'camera',
              handler: () => {
                this.takePicture()
              }
            },
            {
              text: "Gallery",
              role: 'gallery',
              handler: () => {
              this.galleryClick();
              }
            }
          ]
        });
        actionSheet.present();
    }


    uploadPic(){
        if(this.base64Image != undefined){
          this.storageRef=firebase.storage().ref()
          const filename=Math.floor(Date.now()/1000);
          const imageRef=this.storageRef.child(`images/${filename}.jpg`);
          imageRef.putString(this.base64Image,firebase.storage.StringFormat.DATA_URL)
          .then((snapShot)=>{
            console.log("my snapShot");
          console.log(snapShot);
          console.log("my snapShot");
          let newimageUrl = snapShot.downloadURL;
          firebase.database().ref('/Images/').update({
            image:newimageUrl,
            name:`${filename}.jpg`
              })
            alert("Uploading");
          })
        }
        else if(this.myImage){
            alert("uploaded successfully");
        }else{
          alert("No image is availabe");
        }
      }
      scan(){
        this.barcodeScanner.scan().then(barcodeData => {
          console.log('Barcode data', barcodeData);
         }).catch(err => {
             console.log('Error', err);
         });
      }

      download(){
       const request: DownloadRequest = {
          uri: this.myImage.image,
          title: 'MyDownload',
          description: '',
          mimeType: '',
          visibleInDownloadsUi: true,
          notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
          // destinationInExternalFilesDir: {
          //     dirType: 'Downloads',
          //     subPath: this.myImage.name
          // }
          destinationInExternalPublicDir:{
              dirType: 'Download',
              subPath: this.myImage.name

          }
      };  
        this.downloader.download(request)
        .then((location: string) => {})
        .catch((error: any) => console.error(error));
      } 
        readPhoto(file){
          let reader = new FileReader();
          reader.onload = (e)=>{
            this.zone.run(()=>{
             var str = file.name;
             var tmp = str.length;
             var n = str.lastIndexOf(".");

             this.finalExtention = str.substr(n+1,tmp);
             console.log(this.finalExtention);

            //  this.finalExtention = str.substring(n+1,tmp+1);
            //  console.log(this.finalExtention);

             if(this.finalExtention == 'png'  || this.finalExtention == 'jpg' || this.finalExtention == 'jpeg'){
               let path:any = e.target;
               this.image = path.result;
             }else if(this.finalExtention == 'pdf'  || this.finalExtention == 'docx' || this.finalExtention == 'rtf' || this.finalExtention == 'txt' || this.finalExtention == 'wpd' || this.finalExtention == 'doc'){
              let path:any = e.target;
              this.image = path.result;
            }else if(this.finalExtention == 'mp3'  || this.finalExtention == 'mp4' || this.finalExtention == '3gp' || this.finalExtention == 'mkv' || this.finalExtention == 'flv'){
              let path:any = e.target;
              this.image = path.result;
            }
             else{
               let path:any = undefined;
               this.image = undefined;
             }
            })
          }
          reader.readAsDataURL(file);
        }
        uploadFile(data,extentionName){
          this.storageRef=firebase.storage().ref()
          const filename=Math.floor(Date.now()/1000);
          const imageRef=this.storageRef.child(`documents/${filename}.`+extentionName);
          imageRef.putString(data,firebase.storage.StringFormat.DATA_URL).then((snapShot)=>{ 
          console.log(snapShot);
          let newimageUrl = snapShot.downloadURL;
          });
       
        }

        currentUserSameDocChecking(imgdata,extentionName){
              let image = imgdata;
              let extname = extentionName;
              this.uploadFile(image,extname); 

        }
     
        docSubmit(){
            //document same doc number and type exsit checking
                this.currentUserSameDocChecking(this.image,this.finalExtention); // send for document type checking
                //this.uploadFile(this.image,this.finalExtention);

        }
        speak(){
          this.tts.speak(this.text)
              .then(() => console.log('Success'))
              .catch((reason: any) => console.log(reason));
        }

}

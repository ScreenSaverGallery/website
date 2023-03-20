import { Injectable } from '@angular/core';
// models
import { Flow } from '../../models/Flow';
// rxjs
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExplosionService {

  private _urls: string[]	= [
		"./assets/images/flame/flame00.png",
		"./assets/images/flame/flame01.png",
		"./assets/images/flame/flame02.png",
		"./assets/images/flame/flame03.png",
		"./assets/images/flame/flame04.png",
		"./assets/images/flame/flame05.png",
		"./assets/images/flame/flame06.png",
		"./assets/images/flame/flame07.png",
		"./assets/images/flame/flame08.png",
		"./assets/images/flame/flame09.png",
		"./assets/images/flame/flame10.png",
		"./assets/images/flame/flame11.png",
		"./assets/images/flame/flame12.png",
		"./assets/images/flame/flame13.png",
		"./assets/images/flame/flame14.png",
		"./assets/images/flame/flame15.png",
		"./assets/images/flame/flame16.png",
		"./assets/images/flame/flame17.png",
		"./assets/images/flame/flame18.png",
		"./assets/images/flame/flame19.png",
		"./assets/images/flame/flame20.png",
		"./assets/images/flame/flame21.png",
		"./assets/images/flame/flame22.png",
		"./assets/images/flame/flame23.png",
		"./assets/images/flame/flame24.png"
  ];

  images: BehaviorSubject<any[]> = new BehaviorSubject([]);
  


  constructor() {
    this._loadTremulousParticles(this._urls, (images: any[]) => {
      // console.log('images loaded', images);
      this.images.next(images);
    });
  }

  private _loadTremulousParticles(urls: string[], callback: any): void {
    const images = new Array(urls.length);
    const flow = new Flow();

    urls.forEach((url: string, index: number) => {
      // console.log('for each url', url);
      flow.par((next: any) => {
        const image = new Image();
        image.onload = (e: any) => {
          this._convertTremulousImage(image, (resultImage: any, originalImage: any) => {
            images[index] = resultImage;
            next();
          });
        }
        image.src = url;
      });

    });

    flow.seq(() => {
      callback(images, urls);
    });
  }

  private _convertTremulousImage(image: any, callback: any) {
    // create a canvas
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext('2d');
    // draw the image in it
    ctx.drawImage(image, 0, 0);

    // create an alpha channel based on color luminance
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var p = imgData.data;
    for (var i = 0, y = 0; y < canvas.height; y++) {
      for (var x = 0; x < canvas.width; x++ , i += 4) {
        var luminance = (0.2126 * p[i + 0]) + (0.7152 * p[i + 1]) + (0.0722 * p[i + 2]);

        luminance = luminance / 255;
        //luminance	= luminance * luminance * luminance* luminance;
        //luminance	= luminance * luminance;
        p[i + 3] = Math.floor(luminance * 16 * 255);
        //p[i+3]	= luminance * 4;
      }
    }
    // put the generated image in the canvas
    ctx.putImageData(imgData, 0, 0);
    // produce a Image object based on canvas.toDataURL
    var newImage = new Image;
    newImage.onload = function () {
      // notify the caller
      callback(newImage, image);
    };
    newImage.src = ctx.canvas.toDataURL();
  }
}

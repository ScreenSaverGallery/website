import {
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input
} from '@angular/core';
// servivces
import { ExplosionService } from '../../services/explosion/explosion.service';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements AfterViewInit, OnDestroy {

  @Input() set play(value: any) {
    // console.log('set play', value);
    if (value === true || value === false) {
      this._play = value;
    } 
  }

  @Input() text: string;
  @Input() color: string = 'random'; // or any correct color
  

  get width(): number {
    return this._elm.nativeElement.getBoundingClientRect().width;
  }

  get height(): number {
    return this._elm.nativeElement.getBoundingClientRect().height;
  }

  @ViewChild('canvas', {static: false}) canvasElm: ElementRef;

  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _play: boolean = false;
  private _stars: any[] = new Array(2048);
  private _MAX_DEPTH: number = 32;
  private _graph: any;
  private _mouseX: number = 0;
  private _mouseY: number = 0;
  private _words: string[];
  private _explosionImages: any[] = [];
  private _explosionOffset: number = 80;


  constructor(
    private _elm: ElementRef,
    private _explosionService: ExplosionService
  ) { }


  ngAfterViewInit(): void {
    this._explosionService.images.subscribe((imgs: any[]) => {
      if (imgs.length > 0) {
        this._explosionImages = imgs;
        // console.log('images', this._explosionImages);
      }
    });
    // setup canvas
    this._canvas = this.canvasElm.nativeElement;
    this._canvas.width = this.width;
    this._canvas.height = this.height;
    this._ctx = this._canvas.getContext('2d');
    // setup context
    // this._ctx.globalAlpha = 0.5;
	  this._ctx.globalCompositeOperation = 'lighter';
    // init stars
    this._stars = this._initStars(this._stars);
    this._graph = this._setRandomGraph(this._stars);
    // play
    this._play = true;
    // listen mouse
    window.addEventListener('mousemove', this.mouseMove.bind(this));
    // listen resize
    window.addEventListener('resize', this.onResize.bind(this));
    // request first frame
    window.requestAnimationFrame(this._draw.bind(this));
  }

  

  private _draw(): void {
    if (this._play) {
      // console.log('draw', this._play);
      this._ctx.clearRect(0, 0, this.width, this.height); // clear rect first
      // set center
      const halfWidth = this._canvas.width / 2;
      const halfHeight = this._canvas.height / 2;
      // fill background
      this._ctx.fillStyle = 'rgb(0, 0, 0, 0)'; // transparent background
      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
      // process graph
      this._graph.edges.forEach((edge: any) => {
        Object.keys(edge).forEach(key => {
            if (
                Math.floor(this._graph.nodes[key].z) > 20 &&
                Math.floor(this._graph.nodes[key].z) < 25
            ) {
                this._ctx.lineTo(this._graph.nodes[key].px, this._graph.nodes[key].py);
            }
            
        });
      });
      // request frame
      for (let star of this._stars) { // for each star
        // move z;
        star.z -= .1;
        // loop stars
        if ( star.z <= 0 ) {
            star.x = this._randomFromTo(-50, 50);
            star.y = this._randomFromTo(-50, 50);
            star.z = this._MAX_DEPTH;
            star.angle = 0;
            star.px = 0;
            star.py = 0;
            star.k = 0;
        }
        // speed
        star.k  = 256.0 / star.z; // 128.0 / star.z;
        star.px = (star.x * star.k + halfWidth) - ((2 * this._mouseX) / (star.z * 1.8));
        star.py = (star.y * star.k + halfHeight) - ((2 * this._mouseY) / (star.z * 1.8));

        // if star is in viewport
        if( star.px >= 0 && star.px <= window.innerWidth && star.py >= 0 && star.py <= window.innerHeight ) {
            const size = (1 - star.z / 32.0) * 5;

            this._ctx.fillStyle = star.color; // 'rgb(255, 255, 255)';
            this._ctx.beginPath();
            // EXPLOSIONS
            if (
              star.z < 8 &&
              star.px > (window.innerWidth / 2) - this._explosionOffset &&
              star.px < (window.innerWidth / 2) + this._explosionOffset &&
              star.py > (window.innerHeight / 2) - this._explosionOffset &&
              star.py < (window.innerHeight / 2) + this._explosionOffset
            ) {
              if (star.explosionIndex < this._explosionImages.length) {
                const img = this._explosionImages[star.explosionIndex];
                this._ctx.drawImage(this._explosionImages[star.explosionIndex], star.px - img.width / 2, star.py - img.height / 2);
                star.explosionIndex++;
              } else {
                star.explosionIndex = 0;
              }
            }
            
            // STAR (ARC)
            if (!star.text) {
              this._ctx.arc(
                star.px, // + (Math.sin(py) * k), // x
                star.py, // + (Math.sin(px)), // y
                (size / 2) /*  * (star.z / size) */, // radius
                0, // start angle
                2 * Math.PI // end angle
              );
            // TEXT
            } else {
              // TODO
              // console.log('draw text', star.text);
              this._ctx.font = '24px "Russo One"';
              star.text = star.text.replace(/\//g, '');
              // this._ctx.fillStyle = 'yellow';
              this._ctx.fillText(star.text, star.px, star.py);
            }
            
            this._ctx.closePath();
            this._ctx.fill();
        }
      } // end for each star
      window.requestAnimationFrame(this._draw.bind(this));
    }
  }

  ngOnDestroy(): void {
    console.log('stars destroy');
    this._stars = [];
    this._play = false;
    window.removeEventListener('mousemove', this.mouseMove.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
  }





  private _initStars(stars: any[]): any[] {
    let temp: any[] = stars;
    if (this.text) {
      this._words = this.text.split(' ');
    }
    for (let i = 0; i < this._stars.length; i++) {
      temp[i] = {
          index: i,
          x: this._randomFromTo(-50, 50),
          y: this._randomFromTo(-50, 50),
          z: this._randomFromTo(1, this._MAX_DEPTH),
          angle: 0,
          px: 0,
          py: 0,
          k: 0,
          color: (this.color === 'random' ? this._getRandomColor() : this.color),
          text: (Math.random() > .9974 && this._words ? this._words[this._randomFromTo(0, this._words.length + 1)] : undefined),
          explosionIndex: 0
      };
    }
    // console.log('stars', temp);
    stars = temp;
    return stars;
  }

  private _setRandomGraph(stars: any[]) {
    const graph = {
        nodes: {},
        edges: []
    };
    stars.map((s: any) => {
      graph.nodes[s.index] = s;
    });
    // count edges
    Object.keys(graph.nodes).forEach(n1 => {
        let distance = window.innerWidth + window.innerHeight; // default highest possible
        // console.log(n1);
        Object.keys(graph.nodes).forEach(n2 => {
            if (n1 !== n2) {
                // count distance
                const a = graph.nodes[n1].px - graph.nodes[n2].px;
                const b = graph.nodes[n1].py - graph.nodes[n2].py;
                const c = Math.sqrt( a * a + b * b);
                if (Math.abs(c) < distance) {
                    distance = c;
                    const link = {};
                    link[graph.nodes[n1].index] = graph.nodes[n2].index;
                    graph.edges.push(link);
                }
            }
        });
    });

    return graph;
  } 

  private mouseMove(e: any): void {
    // console.log('mouseMove', e);
    this._mouseX = (e.clientX - (window.innerWidth  / 2)); // / window.innerWidth;
    this._mouseY = (e.clientY - (window.innerHeight  / 2)); // / window.innerHeight;
  }

  private onResize(e: any): void {
    this._canvas.width = this.width;
      this._canvas.height = this.height;
  }

  private _randomFromTo(from: number, to: number) {
    return Math.floor(Math.random() * (to - from - 1)) + from;
  }

  private _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

}

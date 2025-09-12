import {
  Component,
  ViewChild,
  Input,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  inject,
  EnvironmentInjector
} from '@angular/core';

// pipes
// import { SafeHtmlPipe } from 'src/app/pipes/safe-html.pipe';
// components
import { ButtonComponent } from '../button/button.component';


@Component({
    selector: 'ssg-article',
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
    standalone: true,
    imports: []
})
export class ArticleComponent implements AfterViewInit {
  @Input({required: true}) rawHTMLContent!: string;
  @Input() selector: string = 'div.download-button';

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor!: ViewContainerRef;
  
  private env = inject(EnvironmentInjector);


  constructor() {}

  ngAfterViewInit() {
    const tmp = document.createElement('div');
    tmp.innerHTML = this.rawHTMLContent ?? '';
    this.renderNodes(this.root.nativeElement, Array.from(tmp.childNodes));
  }

  private renderNodes(parentEl: HTMLElement, nodes: ChildNode[]) {
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        parentEl.appendChild(document.createTextNode(node.textContent ?? ''));
        continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const el = node as HTMLElement;

      if (el.matches(this.selector)) {
        // preserve the element's children by projecting them into the new component
        const projectable: Node[][] = [Array.from(el.childNodes)]; // single-slot projection
        const cmpRef = this.anchor.createComponent(ButtonComponent, {
          environmentInjector: this.env,
          projectableNodes: projectable,
        });
        // copy attributes from the original element to the component host, if you want parity
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes.item(i);
          if (attr) cmpRef.location.nativeElement.setAttribute(attr.name, attr.value);
        }

        cmpRef.location.nativeElement.classList.add('stroked');
        console.log('cmpRef.location.nativeElement', cmpRef.location.nativeElement);
        parentEl.appendChild(cmpRef.location.nativeElement);
        
        cmpRef.changeDetectorRef.detectChanges();

        // note: children are moved into the component as projected nodes — don't recurse into them
      } else {
        const newEl = document.createElement(el.tagName.toLowerCase());
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes.item(i);
          if (attr) newEl.setAttribute(attr.name, attr.value);
        }
        parentEl.appendChild(newEl);
        this.renderNodes(newEl, Array.from(el.childNodes)); // recurse -> preserves nested text & elements
      }
    }
  }


}

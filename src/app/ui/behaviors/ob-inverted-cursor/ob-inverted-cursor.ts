import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'ob-inverted-cursor',
  standalone: true,
  templateUrl: './ob-inverted-cursor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObInvertedCursor implements OnInit, OnDestroy {
  @ViewChild('cursorRef', { static: true })
  cursorRef!: ElementRef<HTMLDivElement>;

  protected isVisible = false;
  protected isHover = false;

  private unlistenList: Array<() => void> = [];
  private rafId: number | null = null;
  private currentX = -100;
  private currentY = -100;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Only enable if pointer: fine (desktop with mouse/trackpad)
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const cursor = this.cursorRef.nativeElement;

      const onPointerMove = (e: PointerEvent) => {
        this.currentX = e.clientX;
        this.currentY = e.clientY;

        if (!this.isVisible) {
          this.isVisible = true;
          cursor.setAttribute('data-visible', 'true');
        }

        if (this.rafId === null) {
          this.rafId = requestAnimationFrame(() => {
            cursor.style.setProperty('--x', `${this.currentX}px`);
            cursor.style.setProperty('--y', `${this.currentY}px`);
            this.rafId = null;
          });
        }
      };

      const onPointerOver = (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const interactive = target.closest(
          'button, a, input, select, textarea, [role=button], [data-interactive], [tabindex="0"], label'
        );
        const shouldHover = !!interactive;
        if (this.isHover !== shouldHover) {
          this.isHover = shouldHover;
          cursor.setAttribute('data-hover', shouldHover ? 'true' : 'false');
        }
      };

      const onMouseLeave = () => {
        this.isVisible = false;
        this.isHover = false;
        cursor.setAttribute('data-visible', 'false');
        cursor.setAttribute('data-hover', 'false');
      };

      document.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerover', onPointerOver, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave, { passive: true });

      this.unlistenList.push(
        () => document.removeEventListener('pointermove', onPointerMove),
        () => document.removeEventListener('pointerover', onPointerOver),
        () => document.removeEventListener('mouseleave', onMouseLeave)
      );
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.unlistenList.forEach((unlisten) => unlisten());
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-marquee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-marquee.component.html',
  styleUrls: ['./hero-marquee.component.scss']
})
export class HeroMarqueeComponent {
  @Input() tagline = '';
  @Input() title = '';
  @Input() description = '';
  @Input() ctaText = '';
  @Input() whatsappText = '';
  @Input() images: string[] = [];
  @Input() bannerText = '';
  @Output() onVerCarta = new EventEmitter<void>();
  @Output() onPedirAhora = new EventEmitter<void>();
  @Output() onBannerClick = new EventEmitter<void>();

  get titleWords(): string[] {
    return this.title.split(' ');
  }

  get duplicatedImages(): string[] {
    return [...this.images, ...this.images, ...this.images];
  }
}

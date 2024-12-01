import { Component } from '@angular/core';
import { ThemeService } from '../../services/misc/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeView {
  mobile = false;
  showBar = false;

  constructor(private themeService: ThemeService) {
    this.themeService.mobileMode$.subscribe((mode) => {
      this.mobile = mode;
    });
  }
}

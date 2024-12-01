import { Component, HostListener, OnInit } from '@angular/core';
import { ThemeService } from './services/misc/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';
  mobile = false;
  showHeader = false;
  showSideBar = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.checkWindowWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    this.mobile = window.innerWidth <= 768;
    this.themeService.setMobileMode(this.mobile);
  }
}

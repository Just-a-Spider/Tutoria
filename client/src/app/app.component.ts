import { Component, HostListener, OnInit } from '@angular/core';
import { ThemeService } from './services/misc/theme.service';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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
  isOnAuth = false;

  constructor(private themeService: ThemeService, private router: Router) {}

  ngOnInit() {
    this.checkWindowWidth(); // Check if the user is on the auth page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isOnAuth =
          url.includes('/auth') || url.includes('/reset-password');
      });
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

import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/misc/theme.service';

@Component({
  selector: 'ui-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  mode = 'student';
  isDarkMode = true;
  displayNotis = false;
  isOnAuth = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    // Check if the user is on the auth page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isOnAuth =
          url.includes('/auth') || url.includes('/reset-password');
      });

    this.isDarkMode = localStorage.getItem('theme') === 'true';
    if (!this.isDarkMode) {
      this.themeService.changeTheme();
    }
    this.themeService.profileMode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  changeProfile() {
    this.mode = this.mode === 'student' ? 'tutor' : 'student';
    this.themeService.setProfileMode(this.mode);
  }

  toggleLightDark() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.changeTheme();
  }

  goToProfile() {
    this.router.navigate(['/me']);
  }

  logout() {
    this.authService.logout();
  }
}

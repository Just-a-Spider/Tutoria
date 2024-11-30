import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ButtonInterface, BUTTONS } from '../../interfaces/ui.interface';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  #document = inject(DOCUMENT);
  buttonStyle: ButtonInterface;

  private profileMode: BehaviorSubject<string> = new BehaviorSubject('student');
  profileMode$ = this.profileMode.asObservable();

  setProfileMode(mode: string) {
    localStorage.setItem('profileMode', mode);
    this.profileMode.next(mode);
    this.buttonStyle = BUTTONS.find(
      (button) => button.mode === mode
    ) as ButtonInterface;
  }

  constructor() {
    const savedMode = localStorage.getItem('profileMode');
    if ((savedMode && savedMode === 'student') || savedMode === 'tutor') {
      this.profileMode.next(savedMode);
      this.buttonStyle = BUTTONS.find(
        (button) => button.mode === savedMode
      ) as ButtonInterface;
    } else {
      localStorage.setItem('profileMode', 'student');
      this.buttonStyle = BUTTONS.find(
        (button) => button.mode === 'student'
      ) as ButtonInterface;
    }
  }

  changeTheme() {
    const linkElement = this.#document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (linkElement.href.includes('light')) {
      linkElement.href = 'theme-dark.css';
      localStorage.setItem('theme', 'true');
    } else {
      linkElement.href = 'theme-light.css';
      localStorage.setItem('theme', 'false');
    }
  }
}

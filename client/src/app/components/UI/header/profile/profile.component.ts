import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../../services/misc/theme.service';

@Component({
  selector: 'header-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileChangeButton {
  @Input() mobile = false;
  mode = 'student';

  constructor(public themeService: ThemeService) {}

  changeProfile() {
    this.mode = this.mode === 'student' ? 'tutor' : 'student';
    this.themeService.setProfileMode(this.mode);
  }
}

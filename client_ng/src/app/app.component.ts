import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from './components/UI/header/notifications/notifications.component';
import { LoginComponent } from './components/forms/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationsComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client_ng';
}

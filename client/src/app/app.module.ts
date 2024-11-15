import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptors
import { apiKeyInterceptor } from './interceptors/api-key.interceptor';

// PrimeNG stuff
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';

// Local Components
import { ChatBoxComponent } from './components/UI/chat-box/chat-box.component';
import { SideBarComponent } from './components/UI/side-bar/side-bar.component';
import { AuthComponent } from './components/forms/auth/auth.component';
import { HomeView } from './views/home/home.component';
import { LandingView } from './views/landing/landing.component';
import { HeaderComponent } from './components/UI/header/header.component';
import { NotificationsComponent } from './components/UI/header/notifications/notifications.component';
import { ProfileView } from './views/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LandingView,
    SideBarComponent,
    ChatBoxComponent,
    HomeView,
    HeaderComponent,
    NotificationsComponent,
    ProfileView,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessagesModule,
    PasswordModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

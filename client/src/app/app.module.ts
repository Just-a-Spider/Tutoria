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

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';

// PrimeNG
import { PrimeNGModule } from './prime-ng.module';

// Local Components
import { CourseDetailComponent } from './components/courses/detail/detail.component';
import { PostDetailComponent } from './components/courses/detail/posts/post-detail/post-detail.component';
import { PostsComponent } from './components/courses/detail/posts/posts.component';
import { RankingComponent } from './components/courses/detail/ranking/ranking.component';
import { CreatePostForm } from './components/forms/posts/create/create.component';
import { ChatBoxComponent } from './components/UI/chat-box/chat-box.component';
import { HeaderComponent } from './components/UI/header/header.component';
import { NotificationsComponent } from './components/UI/header/notifications/notifications.component';
import { SideBarComponent } from './components/UI/side-bar/side-bar.component';
import { AuthView } from './views/auth/auth.component';
import { HomeView } from './views/home/home.component';
import { LandingView } from './views/landing/landing.component';
import { ProfileView } from './views/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    //Pipes
    CapitalizePipe,

    // Views
    AuthView,
    LandingView,
    ProfileView,
    HomeView,

    // Components
    SideBarComponent,
    ChatBoxComponent,
    HeaderComponent,
    NotificationsComponent,
    CourseDetailComponent,
    PostsComponent,
    RankingComponent,
    PostDetailComponent,

    // Forms
    CreatePostForm,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/forms/auth/auth.component';
import { HomeView } from './views/home/home.component';
import { LandingView } from './views/landing/landing.component';
import { ProfileView } from './views/profile/profile.component';
import { CourseDetailComponent } from './components/courses/detail/detail.component';

const routes: Routes = [
  { path: 'landing', component: LandingView },
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    component: HomeView,
    children: [
      { path: 'my-courses', component: HomeView },
      { path: 'all-courses', component: HomeView },
      { path: 'course', component: CourseDetailComponent },
    ],
  },
  { path: 'me', component: ProfileView },
  { path: '**', redirectTo: 'landing' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

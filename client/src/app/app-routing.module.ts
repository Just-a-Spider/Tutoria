import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailComponent } from './components/courses/detail/detail.component';
import { authGuard } from './guards/auth.guard';
import { AuthView } from './views/auth/auth.component';
import { HomeView } from './views/home/home.component';
import { LandingView } from './views/landing/landing.component';
import { ProfileView } from './views/profile/profile.component';

const routes: Routes = [
  { path: 'landing', component: LandingView },
  { path: 'auth', component: AuthView },
  {
    path: '',
    component: HomeView,
    canActivate: [authGuard],
    children: [
      { path: 'my-courses', component: HomeView },
      { path: 'all-courses', component: HomeView },
      { path: 'course', component: CourseDetailComponent },
    ],
  },
  { path: 'me', component: ProfileView, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

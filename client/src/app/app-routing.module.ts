import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/forms/auth/auth.component';
import { HomeView } from './views/home/home.component';
import { LandingView } from './views/landing/landing.component';
import { ProfileView } from './views/profile/profile.component';

const routes: Routes = [
  { path: 'landing', component: LandingView },
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeView },
  { path: 'me', component: ProfileView },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

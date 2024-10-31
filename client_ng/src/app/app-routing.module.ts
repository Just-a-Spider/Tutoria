import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/forms/auth/auth.component'; // Import the AuthComponent
import { LandingComponent } from './views/landing/landing.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent }, // Define the route for AuthComponent
  { path: 'home', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

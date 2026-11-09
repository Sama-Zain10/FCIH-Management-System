import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink
} from '@angular/router';
import { filter } from 'rxjs';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private authService = inject(AuthService);

  showNavbar = true;

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const url = event.urlAfterRedirects;

        this.showNavbar =
          url !== '/login' &&
          url !== '/register' &&
          url !== '/forgot-password' &&
          url !== '/not-found' &&
          this.router.url !== '/**';

        // أخفِ النافبار لأي Route غير معروف
        if (
          ![
            '/',
            '/login',
            '/register',
            '/forgot-password',
            '/home',
            '/profile',
            '/courses',
            '/schedule',
            '/grades',
            '/admin/dashboard',
            '/admin/users',
            '/admin/courses',
            '/admin/grades'
          ].includes(url)
        ) {
          this.showNavbar = false;
        }

      });

  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

}
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    private authService = inject(AuthService);

    readonly studentLinks = [
        { label: 'Dashboard', path: '/home', icon: '📊' },
        { label: 'Profile', path: '/profile', icon: '👤' },
        { label: 'Course Registration', path: '/courses', icon: '📚' },
        { label: 'Schedule', path: '/schedule', icon: '📅' },
        { label: 'Grades', path: '/grades', icon: '⭐' }
    ];

    readonly adminLinks = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Users', path: '/admin/users', icon: '👥' },
        { label: 'Courses', path: '/admin/courses', icon: '📚' },
        { label: 'Grades', path: '/admin/grades', icon: '⭐' }
    ];

    constructor(
        private router: Router,
        private toastr: ToastrService
    ) { }
    get isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    get currentUser() {
        return this.authService.getCurrentUser();
    }

    get links() {
        return this.isAdmin ? this.adminLinks : this.studentLinks;
    }
isSidebarOpen = false;

toggleSidebar(): void {
  this.isSidebarOpen = !this.isSidebarOpen;
}

closeSidebar(): void {
  if (window.innerWidth <= 768) {
    this.isSidebarOpen = false;
  }
}
    logout(): void {

        this.authService.logout();

        this.toastr.success(
            'Logout Successful'
        );

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 500);

    }
}
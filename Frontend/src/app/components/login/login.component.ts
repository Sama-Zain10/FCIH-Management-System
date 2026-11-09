import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { LoginForm } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    @Output() loginSubmitted = new EventEmitter<LoginForm>();

    model: LoginForm = {
        email: '',
        password: '',
        rememberMe: false
    };

    submitted = false;
    errorMessage = '';
    constructor(private router: Router, private authService: AuthService,
        private toastr: ToastrService
    ) { }
    onSubmit(form?: NgForm): void {
        this.submitted = true;
        this.errorMessage = '';
        if (form?.invalid) {
            this.toastr.error('Please fill all required fields');
            return;
        }
        this.loginSubmitted.emit({ ...this.model });
        this.authService.login({
            email: this.model.email,
            password: this.model.password
        }).subscribe({
            next: () => {
                this.toastr.success('Login successful');
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.toastr.error(
                    err?.error?.message || 'Invalid email or password',
                    'Login failed'
                );
            }
        });
    }
}

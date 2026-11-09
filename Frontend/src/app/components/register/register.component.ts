import { CommonModule } from '@angular/common'; 
import { Component, EventEmitter, Output } from '@angular/core'; 
import { FormsModule, NgForm } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth-service'; 
import { RegisterForm } from '../../models/auth.model'; 
import { ToastrService } from 'ngx-toastr'; 

@Component({ 
    selector: 'app-register', 
    standalone: true, 
    imports: [CommonModule, FormsModule, RouterLink], 
    templateUrl: './register.component.html', 
    styleUrl: './register.component.css' 
}) 
export class RegisterComponent { 

    @Output() registerSubmitted = new EventEmitter<RegisterForm>(); 

    model: RegisterForm = { 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        age: 18, 
        gender: 'male', 
        role: 'student', 
        studentId: '', 
        department: '' 
    }; 

    submitted = false; 
    errorMessage = ''; 

    constructor(
        private router: Router, 
        private authService: AuthService,
        private toastr: ToastrService 
    ) { } 


    get passwordDoesNotMatch(): boolean { 
        return this.model.password !== this.model.confirmPassword 
        && this.model.confirmPassword.length > 0; 
    } 


    get needsStudentFields(): boolean { 
        return this.model.role === 'student'; 
    } 


    onSubmit(form?: NgForm): void { 
        this.submitted = true; 
        this.errorMessage = ''; 


        if (form?.invalid) {
            this.toastr.error(
                'Please fill all required fields',
                'Invalid Data'
            );
            return;
        }


        if (this.passwordDoesNotMatch) {
            this.toastr.error(
                'Passwords do not match',
                'Registration failed'
            );
            return;
        }


        this.registerSubmitted.emit({ ...this.model }); 


        const payload = { 
            name: this.model.name, 
            email: this.model.email, 
            password: this.model.password, 
            age: this.model.age, 
            gender: this.model.gender, 
            role: this.model.role, 
            studentId: this.needsStudentFields ? this.model.studentId : undefined, 
            department: this.needsStudentFields ? this.model.department : undefined 
        }; 


        this.authService.signup(payload).subscribe({ 

            next: () => { 

                this.toastr.success(
                    'Account created successfully',
                    'Registration successful'
                );

                this.router.navigate(['/login']); 
            }, 


            error: (err) => { 

                this.toastr.error(
                    err?.error?.message || 
                    'Registration failed. Please try again.',
                    'Registration failed'
                );

            } 
        }); 
    } 
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { LoginForm, RegisterForm } from '../../models/auth.model';

@Component({
    selector: 'app-auth-demo',
    standalone: true,
    imports: [CommonModule, LoginComponent, RegisterComponent],
    template: `
    <section class="demo-card">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>

      <app-login [title]="title" (loginSubmitted)="handleLogin($event)"></app-login>
      <app-register [title]="title" (registerSubmitted)="handleRegister($event)"></app-register>
    </section>
  `,
    styles: [
        `.demo-card { max-width: 900px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 24px; box-shadow: 0 20px 45px rgba(15,23,42,0.12); }`,
        `h2 { margin-bottom: 0.5rem; color: #0f172a; }`,
        `p { color: #475569; margin-bottom: 1rem; }`
    ]
})
export class AuthDemoComponent {
    title = 'Parent to Child / Child to Parent';
    description = 'This demo uses @Input to pass data down and @Output to send data back.';

    handleLogin(data: LoginForm): void {
        console.log('Parent received login event:', data);
    }

    handleRegister(data: RegisterForm): void {
        console.log('Parent received register event:', data);
    }
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: 'male' | 'female';
    role: 'admin' | 'student';
    studentId?: string;
    department?: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: UserPayload;
}

export interface UserPayload {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: 'male' | 'female';
    role: 'admin' | 'student';
    studentId?: string;
    department?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginForm extends LoginPayload {
    rememberMe: boolean;
}

export interface RegisterForm extends SignupPayload {
    confirmPassword: string;
}

import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth-service';
import { UserService, AppUser } from '../../../services/user';
import { SignupPayload } from '../../../models/auth.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    console.log("User Component Created");
  }
  users: AppUser[] = [];
  loading = true;
  errorMsg = '';
  showEditModal = false;
  selectedUser: AppUser | null = null;
  showDeleteConfirm = false;
  userToDelete: AppUser | null = null;
  showAddModal = false;
  newStudent: SignupPayload = {
    name: '',
    email: '',
    password: '',
    age: 0,
    gender: 'male',
    role: 'student',
    studentId: '',
    department: ''

  }
  ngOnInit(): void {

    console.log("User ngOnInit");

    this.loadUsers();

  }
  loadUsers(): void {


    this.loading = true;


    this.userService
      .getAllUsers()
      .subscribe({


        next: (data) => {


          console.log(
            "Users From API:",
            data
          );


          this.users = data;


          this.loading = false;


          this.cdr.detectChanges();


        },


        error: (err) => {


          console.log(err);


          this.toastr.error(
            'Failed to load users'
          );


          this.loading = false;


          this.cdr.detectChanges();


        }



      });



  }
  openAddStudent(): void {


    this.showAddModal = true;


  }
  closeAddStudent(): void {


    this.showAddModal = false;


    this.newStudent = {


      name: '',
      email: '',
      password: '',
      age: 0,
      gender: 'male',
      role: 'student',
      studentId: '',
      department: ''


    };


    this.cdr.detectChanges();


  }
addStudent(): void {

  this.authService
    .signup(this.newStudent)
    .subscribe({

      next: () => {

        this.toastr.success(
          'Student added successfully'
        );

        setTimeout(() => {
          this.loadUsers();
          this.closeAddStudent();
        });

      },

      error: (err) => {
        console.log(err);
        this.toastr.error(
          'Failed to add student'
        );
      }

    });

}
 openEdit(user: AppUser): void {

  this.selectedUser = {
    ...user
  };

  this.showEditModal = true;

}


closeEdit(): void {

  this.showEditModal = false;

  this.selectedUser = null;

  this.cdr.detectChanges();

}
saveEdit(): void {

  if (!this.selectedUser)
    return;

  const payload = { ...this.selectedUser };

  this.userService
    .updateUser(this.selectedUser._id, payload)
    .subscribe({

      next: (response) => {

        console.log("Updated Successfully:", response);

        this.toastr.success(
          'User updated successfully',
          'Success'
        );

        setTimeout(() => {
          this.loadUsers();
          this.closeEdit();
        });

      },

      error: (err) => {
        console.log(err);
        this.toastr.error(
          err.error?.message ||
          err?.message ||
          'Failed to update user'
        );
      }

    });

}
  confirmDelete(user: AppUser): void {


    this.userToDelete = user;


    this.showDeleteConfirm = true;


  }
  cancelDelete(): void {


    this.userToDelete = null;


    this.showDeleteConfirm = false;
    this.cdr.detectChanges();
  }
deleteUser(): void {

  if (!this.userToDelete)
    return;

  this.userService
    .deleteUser(
      this.userToDelete._id
    )
    .subscribe({

      next: () => {

        this.users =
          this.users.filter(
            u =>
              u._id !== this.userToDelete!._id
          );

        this.toastr.success(
          'User deleted successfully'
        );

        this.cdr.detectChanges();

        setTimeout(() => {
          this.cancelDelete();
        });

      },

      error: (err) => {

        console.log(err);

        this.toastr.error(
          'Failed to delete user'
        );

      }

    });

}

}

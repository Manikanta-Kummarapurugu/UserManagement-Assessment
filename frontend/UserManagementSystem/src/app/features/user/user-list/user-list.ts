import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Password } from 'primeng/password';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users: any[] = [];
  displayDialog: boolean = false;
  selectedUser: any = { name: '', email: '', password: '' };
  isNewUser: boolean = false;
  isViewMode: boolean = false;
  dialogHeader: string = '';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.fetchUsers();
  }

  // Method to fetch users from the API
  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        // setTimeout(() => {
          this.users = [...data];
        // }, 0);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users.' });
      }
    });
  }

  openDialog(user: any, mode: 'add' | 'edit' | 'view' = 'edit') {
    if (user) {
      this.selectedUser = { ...user };
      this.isNewUser = mode === 'add';
      this.isViewMode = mode === 'view';
    } else {
      this.selectedUser = { name: '', email: '', password: '' };
      this.isNewUser = true;
      this.isViewMode = false;
    }
    //set dynamc dialog header based on mode
    if (mode === 'add') {
      this.dialogHeader = 'Add User';
    } else if (mode === 'edit') {
      this.dialogHeader = 'Edit User';
    } else if (mode === 'view') {
      this.dialogHeader = 'View User';
    }
    this.displayDialog = true;
  }

  saveUser() {
    if (this.selectedUser.id) {
      // Update existing user
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully.', life: 3000 });

          setTimeout(() => {
            this.fetchUsers(); // Refresh the user list
          }, 500);
          this.displayDialog = false;
        },
        error: (error: any) => {
          console.error('Error updating user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user.', life: 3000 });
        }
      });
    } else {
      // Create new user
      this.userService.createUser(this.selectedUser).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully.' });
          setTimeout(() => {
            this.fetchUsers(); // Refresh the user list
          }, 500);
          this.displayDialog = false;
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user.' });
        }
      });
    }
  }

  // Method to delete a user
  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully.' });
          this.fetchUsers(); // Refresh the user list
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.' });
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }
}
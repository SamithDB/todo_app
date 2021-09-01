import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoListComponent } from './components/todo-list/todo-list.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NavbarComponent } from './components/navbar/navbar.component';


@NgModule({
  declarations: [
    TodoListComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    DragDropModule,
    MatToolbarModule,
    MatButtonToggleModule
  ]
})
export class TodoModule { }

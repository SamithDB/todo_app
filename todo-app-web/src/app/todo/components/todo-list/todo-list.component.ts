import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TodoItem, TodoItemStatusString } from '../../models/todo-item.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  todoStatus = {
    Todo : TodoItemStatusString.Todo,
    Inprogress : TodoItemStatusString.Inprogress,
    Done : TodoItemStatusString.Done
  }

  todoForm: FormGroup = new FormGroup({
    todo_item_name: new FormControl('', Validators.required),
    todo_item_description: new FormControl('', Validators.required),
  });
  todoFormEdit: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    todo_item_name: new FormControl('', Validators.required),
    todo_item_description: new FormControl('', Validators.required),
  });
  index: number = 0;


  constructor(
    public dialog: MatDialog, private todoService: TodoService, private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.formsBuilder();
    this.getTodos();
  }

  formsBuilder() {
    this.todoForm = new FormGroup({
      todo_item_name: new FormControl('', Validators.required),
      todo_item_description: new FormControl('', Validators.required),
    });
    this.todoFormEdit = new FormGroup({
      _id: new FormControl('', Validators.required),
      todo_item_name: new FormControl('', Validators.required),
      todo_item_description: new FormControl('', Validators.required)
    });
  }

  getTodos() {
    this.todoService.userTodos().subscribe( (res: TodoItem[]) => {
      this.todos = res;
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
    let data: {_id: string, todo_item_index: number}[] = [];
    let item_index = 1;
    this.todos.map( todo => {
      data.push({_id: todo._id, todo_item_index: item_index});
      item_index = item_index + 1;
    });
    this.todoService.updateIndexes(data).subscribe( res => {
      this.closeModal();
      this.getTodos();
      this.openSnackBar("Successfull", "Close");
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  openDialog(content: any) {
    this.formsBuilder();
    this.dialog.open(content);
  }

  closeModal() {
    this.dialog.closeAll();
  }

  add() {
    let todos : any[] = [];
    todos.push(this.todoForm.value);
    this.todoService.createTodos(todos).subscribe( res => {
      this.openSnackBar("Successfull", "Close");
      this.closeModal();
      this.getTodos();
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  edit(content: any, i: any) {
    this.index = i;
    this.todoFormEdit.controls._id.setValue(this.todos[i]._id);
    this.todoFormEdit.controls.todo_item_name.setValue(this.todos[i].todo_item_name);
    this.todoFormEdit.controls.todo_item_description.setValue(this.todos[i].todo_item_description);
    this.dialog.open(content);
  }

  updateEdit() {
    let todos : any[] = [];
    todos.push(this.todoFormEdit.value);
    this.todoService.updateTodos(todos).subscribe( res => {
      this.closeModal();
      this.getTodos();
      this.openSnackBar("Successfull", "Close");
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  delete(id: string) {
    let todoIds : string[] = [];
    todoIds.push(id);
    this.todoService.deleteTodos(todoIds).subscribe( res => {
      this.getTodos();
      this.openSnackBar("Successfull", "Close");
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  changeStatus(id: string, status: TodoItemStatusString) {
    let todoIds : string[] = [];
    todoIds.push(id);
    let data : {todo_item_status: boolean, todo_item_status_string: TodoItemStatusString, todo_item_ids: string[]}
      = {todo_item_status: true, todo_item_status_string: status, todo_item_ids: todoIds}
    this.todoService.updateStatus(data).subscribe( res => {
      this.getTodos();
      this.openSnackBar("Successfull", "Close");
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TodoItem, TodoItemStatusString } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient, public router: Router) { }

  userTodos() {
    return this.http.get<TodoItem[]>(environment.apiUrl + 'todo/getAll');
  }

  createTodos(todo: TodoItem[]) {
    return this.http.post<TodoItem>(environment.apiUrl + 'todo/addTodos', todo);
  }

  updateTodos(todo: TodoItem[]) {
    return this.http.put<TodoItem[]>(environment.apiUrl + 'todo/updateTodos', todo);
  }

  updateStatus(data: {todo_item_status: boolean, todo_item_status_string: TodoItemStatusString,todo_item_ids: string[]}) {
    return this.http.put(environment.apiUrl + 'todo/changeStatus', data);
  }

  updateIndexes(data: {_id: string, todo_item_index: number}[]) {
    return this.http.put(environment.apiUrl + 'todo/changeIndexes', data);
  }

  deleteTodos(ids: string[]) {
    return this.http.post(environment.apiUrl + 'todo/deleteTodos', ids);
  }
}

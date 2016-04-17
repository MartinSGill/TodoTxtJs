import {Component, OnInit} from 'angular2/core';
import {TodoEntry} from './todo-entry/todo-entry.component';
import {TodoList} from './todo-list/todo-list.component';
import {TodoService} from './services/todo.service';
import {Sidebar} from './sidebar/sidebar.component';
import {OptionsService} from "./services/options.service";

@Component({
  selector: 'todotxt-app',
  providers: [TodoService, OptionsService],
  templateUrl: 'app/app.view.html',
  directives: [TodoEntry, TodoList, Sidebar]
})
export class TodoTxtApp {
  public title = "TodoTxtJS";
}

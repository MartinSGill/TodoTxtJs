import {Component, View, OnInit} from 'angular2/core';
import {TodoEntry} from './todo-entry/todo-entry.component';
import {TodoList} from './todo-list/todo-list.component';
import {TodoService} from './services/todo.service';

@Component({
    selector: 'todotxt-app',
    providers: [TodoService]
})
@View({
    templateUrl: 'app/app.view.html',
    directives: [TodoEntry, TodoList]
})
export class TodoTxtApp {
    public title = "TodoTxtJS";
}

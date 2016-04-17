import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoFormatted} from './../todo-formatted/todo-formatted.component';
import {Item} from './../models/item';
import {TodoService} from './../services/todo.service';
import {TodoListEntry} from "../todo-list-entry/todo-list-entry";

@Component({
    selector: 'todo-list',
    template: `<table class="todo-list"><todo-list-entry *ngFor="#item of todos" [todo]="item"></todo-list-entry></table>`,
    directives: [CORE_DIRECTIVES, TodoListEntry]
})
export class TodoList {
    public todos:Item[] = [];

    constructor(private _todoService:TodoService) {
        this.getTodos();
    };

    getTodos() {
        this.todos = this._todoService.all();
    }
}
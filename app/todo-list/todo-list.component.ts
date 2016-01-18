import {Component, View, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoFormatted} from './../todo-formatted/todo-formatted.component';
import {Item} from './../models/item';
import {TodoService} from './../services/todo.service';

@Component({
    selector: 'todo-list',
})
@View({
    template: `<table class="todo-list"><todo-formatted *ngFor="#item of todos" todo="{{item}}"></todo-formatted></table>`,
    directives: [CORE_DIRECTIVES, TodoFormatted]
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
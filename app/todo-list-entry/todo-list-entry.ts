import {Component, View, OnInit, Input} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoFormatted} from './../todo-formatted/todo-formatted.component';
import {TodoService} from './../services/todo.service';
import {Item} from "../models/item";

@Component({
    selector: 'todo-list-entry'
})
@View({
    templateUrl: 'app/todo-list-entry/todo-list-entry.html',
    directives: [CORE_DIRECTIVES, TodoFormatted]
})
export class TodoListEntry {
    @Input() public todo:Item;

    constructor(private _todoService:TodoService) { };
}
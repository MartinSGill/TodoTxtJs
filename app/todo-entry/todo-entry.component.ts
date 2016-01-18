import {Component, View} from 'angular2/core';
import {TodoFormatted} from './../todo-formatted/todo-formatted.component';
import {TodoService} from "../services/todo.service";
import {Item} from "../models/item";

@Component({
    selector: 'todo-entry'
})
@View({
    templateUrl: 'app/todo-entry/todo-entry.view.html',
    directives: [TodoFormatted]
})
export class TodoEntry
{
    public value = '';

    constructor(private _todoService:TodoService) { }

    add() {
        this._todoService.add(Item.parseString(this.value));
    }
}
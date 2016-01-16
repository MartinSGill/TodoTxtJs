import {Component, View} from 'angular2/core';
import {TodoFormatted} from './../todo-formatted/todo-formatted.component';

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
}
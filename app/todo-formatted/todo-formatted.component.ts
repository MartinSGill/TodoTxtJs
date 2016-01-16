import {Component, View, Input, OnChanges, SimpleChange} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Item} from './../models/item';

@Component({
    selector: 'todo-formatted'
})
@View({
    templateUrl: 'app/todo-formatted/todo-formatted.view.html',
    directives: [CORE_DIRECTIVES]
})
export class TodoFormatted implements OnChanges {
    @Input() todo:string = "";
    public item:Item;

    public ngOnChanges(changes:{
        [key: string]: SimpleChange;
    }) {
        if (changes && changes.hasOwnProperty('todo')) {
            let currentValue = changes['todo'].currentValue;
            if (changes['todo'].previousValue !== currentValue) {
                if (currentValue instanceof Item) {
                    this.item = currentValue;
                }
                else {
                    this.item = Item.parseString(currentValue);
                }
            }
        }
    }
}
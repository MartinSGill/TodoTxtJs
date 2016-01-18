import {Injectable} from 'angular2/core';
import {TODOS} from './mock-todos';
import {Item} from "../models/item";

@Injectable()
export class TodoService {

    private items:Item[];

    constructor() {
        this.items = TODOS.slice(0,3);
    }

    all() {
        return this.items;
    }

    add(item:Item) {
        if (item.tokens().length > 0) {
            this.items.push(item);
        }
    }
}
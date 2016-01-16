import {Injectable} from 'angular2/core';
import {TODOS} from './mock-todos';

@Injectable()
export class TodoService {
    getTodos() {
        return TODOS;
    }
}
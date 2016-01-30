import {Injectable} from 'angular2/core';
import {TODOS} from './mock-todos';
import {Item} from "../models/item";

@Injectable()
export class TodoService {

  private items:Item[] = [];

  constructor() {
    TODOS.forEach(this.add);//.slice(0,3);
  }

  public all():Item[] {
    return this.items;
  }

  public add = (item:Item):void => {
    if ((item instanceof Item) && item.tokens().length > 0) {
      item.index = this.nextIndex();
      this.items.push(item);
    }
    else {
      throw 'invalid item. Expecting Item object';
    }
  };

  public projects():string[] {
    return this.items.reduce(function (previousValue, currentValue) {
        return previousValue.concat(currentValue.projects());
      }, [])
      .sort()
      .filter(function (item, index, items) {
        if (index == 0) {
          return true;
        }
        return items[index - 1] != item;
      });
  }

  public contexts():string[] {
    return this.items.reduce(function (previousValue, currentValue) {
        return previousValue.concat(currentValue.contexts());
      }, [])
      .sort()
      .filter(function (item, index, items) {
        if (index == 0) {
          return true;
        }
        return items[index - 1] != item;
      });
  }

  private nextIndex = ():number => {
    return this.items.length;
  };

}
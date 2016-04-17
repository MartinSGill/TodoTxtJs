import {Component, View, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {TodoService} from '../services/todo.service';
import {OptionsService} from '../services/options.service';

@Component({
  selector: 'sidebar',
})
@View({
  templateUrl: 'app/sidebar/sidebar.view.html',
  directives: [CORE_DIRECTIVES]
})
export class Sidebar {

  public contexts:Array<string>;
  public projects:Array<string>;

  constructor(private _todoService: TodoService, _optionsService: OptionsService)
  {
    this.getItems();
  }

  private getItems()
  {
    this.contexts = this._todoService.contexts();
    this.projects = this._todoService.projects();
  }
}

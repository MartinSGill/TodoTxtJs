import {Injectable} from 'angular2/core';

enum ESideBarPos {
  left,
  right
}

interface IDisplayOptions {
  showStartDate: boolean,
  showCompleteDate: boolean
  sidebar: ESideBarPos
}

interface IOptions {
  display: IDisplayOptions;
}

@Injectable()
export class OptionsService implements IOptions {

  public display = {
    showStartDate: true,
    showCompleteDate: true,
    sidebar: ESideBarPos.left,
  };

  constructor() {

  }
}
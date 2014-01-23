/*******************************************************************************
 * Copyright (C) 2013 Martin Gill
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

/// <reference path="../lib/knockout.d.ts" />
/// <reference path="../lib/jquery.d.ts" />
/// <reference path="../utils/datetime.ts" />
/// <reference path="../model/todo.ts" />
/// <reference path="../model/todomanager.ts" />

module TodoTxtJs.View
{
    export class Importing
    {
        public appendImport: KnockoutObservable<boolean>;

        private _dropTarget:any;
        private _entered : number;
        private _todoManager: TodoManager;

        constructor(todoManager:TodoManager)
        {
            this.appendImport = ko.observable<boolean>(false);

            this._dropTarget = null;
            this._entered = 0;
            this._todoManager = todoManager;

            $(document).ready(()=> {
                // Get jQuery events to support dataTransfer props
                (<any>jQuery).event.props.push('dataTransfer');
                this._dropTarget = $("#fileUpload");
                this._dropTarget.on('dragenter', this.dragEnter);
                this._dropTarget.on('dragover', this.dragOver);
                this._dropTarget.on('dragleave', this.dragLeave);
                this._dropTarget.on('drop', this.drop);

                var $dropTargetChild = this._dropTarget.find("span");
                $dropTargetChild.on('dragenter', this.dragEnter);
                $dropTargetChild.on('dragover', this.dragOver);
                $dropTargetChild.on('dragleave', this.dragLeave);
                $dropTargetChild.on('drop', this.drop);
            });
        }

        private dragEnter = (event) : void =>
        {
            this._entered++;
            event.preventDefault();
            this._dropTarget.addClass("dragOver");
        };

        private dragLeave = (event) : void =>
        {
            this._entered--;
            event.stopPropagation();
            if (this._entered === 0)
            {
                this._dropTarget.removeClass("dragOver");
            }
        };

        private dragOver = (event) : void =>
        {
            event.dataTransfer.dropEffect = "copy";
            event.preventDefault();
        };

        private drop = (event) : void =>
        {
            event.preventDefault();
            this._dropTarget.removeClass("dragOver");

            var files = event.dataTransfer.files;

            if (files.length > 0)
            {
                var file = files[0];
                var reader = new FileReader();

                reader.onloadend = (event): void =>
                {
                    if (!this.appendImport())
                    {
                        this._todoManager.removeAll();
                    }

                    var todos = (<any>event.target).result.match(/^(.+)$/mg);
                    this._todoManager.addFromStringArray(todos);
                };

                reader.readAsText(file, 'UTF-8');
            }
        };
    } // class Importing
}

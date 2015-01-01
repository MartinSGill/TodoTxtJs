/*******************************************************************************
 * Copyright (C) 2013-2015 Martin Gill
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
        public importDetails: KnockoutObservable<string>;

        private _dropTarget:any;
        private _entered : number;
        private _todoManager: TodoManager;
        private _importData: Array<string>;
        private _dialog: JQuery;

        constructor(todoManager:TodoManager)
        {
            this.appendImport = ko.observable<boolean>(false);
            this.importDetails = ko.observable<string>("");

            this._dropTarget = null;
            this._entered = 0;
            this._todoManager = todoManager;
            this._importData = [];

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

        public onClick_ShowDialog()
        {
            var height = Math.round(window.innerHeight * 0.8);
            this._dialog = $("#importDialog").dialog({
                dialogClass: "importDialog",
                modal: true,
                buttons: {
                    Close: function () { $(this).dialog("close"); }
                },
                minHeight: 400,
                maxHeight: height,
                height: "auto",
                minWidth: 450,
                maxWidth: 450,
                auto: "auto",
                closeOnEscape: true,
                draggable: false,
                resizable: false
            });

            this._resetImportData();
        }

        public onClick_PickFile()
        {

        }

        public onClick_Import()
        {
            if (!this.appendImport())
            {
                this._todoManager.removeAll();
            }

            this._todoManager.addFromStringArray(this._importData);
            this._resetImportData();
            this._dialog.dialog("close");
        }

        private _resetImportData()
        {
            this._enableImportButton(false);
            this._importData = [];
            this.importDetails("");
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
            this._resetImportData();

            var files = event.dataTransfer.files;

            if (files.length > 0)
            {
                var file = files[0];
                var reader = new FileReader();

                reader.onloadend = (event): void =>
                {
                    this._importData = (<any>event.target).result.split(/\r?\n/);
                    this.importDetails("Ready to import " + this._importData.length + " entries.");
                    this._enableImportButton();
                };

                reader.readAsText(file, 'UTF-8');
            }
        };

        private _enableImportButton(enable:boolean = true)
        {
            if (this._dialog)
            {
                var buttons = this._dialog.dialog("option", "buttons");
                if (enable)
                {
                    buttons.Import = () => { this.onClick_Import(); };
                }
                else
                {
                    delete buttons.Import;
                }
                this._dialog.dialog("option", "buttons", buttons);
            }
        }
    } // class Importing
}

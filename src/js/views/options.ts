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

/// <reference path="../defs/knockout.d.ts" />
/// <reference path="../storage/storage_browser.ts" />
/// <reference path="../storage/storage_dropbox.ts" />

module TodoTxtJs.View
{

    export class Options
    {

        public storageOptions : KnockoutObservableArray<StorageProviders.IStorageProvider>;
        public storageInfo : KnockoutObservable<StorageProviders.IStorageProvider>;
        public storage : KnockoutComputed<string>;
        public addCreatedDate : KnockoutObservable<boolean>;
        public addCreatedDateDescription : KnockoutObservable<string>;

        public showStorageControls: KnockoutComputed<boolean>;
        public showImport: KnockoutComputed<boolean>;
        public showExport: KnockoutComputed<boolean>;

        constructor()
        {
            this.storageOptions = ko.observableArray([
                                                         new TodoTxtJs.StorageProviders.BrowserStorage(),
                                                         new TodoTxtJs.StorageProviders.DropboxStorage()
                                                     ]
            );
            this.storageInfo = ko.observable(this.storageOptions()[0]);
            this.storage = ko.computed({
                       owner: this,
                       read: () =>
                       {
                           return this.storageInfo().name;
                       }
                   });

            this.addCreatedDate = ko.observable<boolean>(false);
            this.addCreatedDateDescription = ko.observable<string>("Automatically add a start date to new TODOs.");

            this.showStorageControls = ko.computed({
                       owner: this,
                       read: ()=>
                       {
                           return this.storageInfo().controls.storage;
                       }
                   });

            this.showImport = ko.computed({
                      owner: this,
                      read: ()=>
                      {
                          return this.storageInfo().controls.imports;
                      }
                   });

            this.showExport = ko.computed({
                      owner: this,
                      read: ()=>
                      {
                          return this.storageInfo().controls.exports;
                      }
                   });
        }

        public save() : void
        {
            var oldOptions : any = {};
            if (window.localStorage["TodoTxtJsOptions"])
            {
                oldOptions = JSON.parse(window.localStorage["TodoTxtJsOptions"]);
            }

            window.localStorage["TodoTxtJsOptions"] = ko.toJSON(this);
            if (oldOptions.storage !== this.storage())
            {
                todoTxtView.load();
            }
        }

        public load() : void
        {
            if (window.localStorage["TodoTxtJsOptions"])
            {
                var options = JSON.parse(window.localStorage["TodoTxtJsOptions"]);
                if (options.hasOwnProperty("storage"))
                {
                    for (var i = 0; i < this.storageOptions().length; i++)
                    {
                        if (this.storageOptions()[i].name === options.storage)
                        {
                            this.storageInfo(this.storageOptions()[i]);
                            break;
                        }
                    }
                }

                if (options.hasOwnProperty(("addCreatedDate")))
                {
                    this.addCreatedDate(options.addCreatedDate);
                }
            }
        }
    }
}


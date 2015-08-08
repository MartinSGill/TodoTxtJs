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

/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../storage/IStorageProvider.d.ts" />
/// <reference path="../storage/storage_browser.ts" />
/// <reference path="../storage/storage_dropbox.ts" />
/// <reference path="../utils/events.ts" />

namespace TodoTxtJs
{
    export interface IThemeDefinition
    {
        name: string;
        file: string;
    }

    export class Options
    {
        public storageOptions:KnockoutObservableArray<StorageProviders.IStorageProvider>;
        public storageInfo:KnockoutObservable<StorageProviders.IStorageProvider>;
        public storage:KnockoutComputed<string>;
        public storagePath:KnockoutComputed<string>;
        public storagePathDescription:KnockoutComputed<string>;
        public addCreatedDate:KnockoutObservable<boolean>;
        public addCreatedDateDescription:KnockoutObservable<string>;

        public removeCompletePriority:KnockoutObservable<boolean>;
        public removeCompletePriorityDescription:KnockoutObservable<string>;

        public showStorageControls:KnockoutComputed<boolean>;
        public showImport:KnockoutComputed<boolean>;
        public showExport:KnockoutComputed<boolean>;

        public saveOnChange:KnockoutObservable<boolean>;
        public saveOnChangeDescription:KnockoutObservable<string>;

        public caseSensitive:KnockoutObservable<boolean>;
        public caseSensitiveDescription:KnockoutObservable<string>;

        public swapSidebarPosition:KnockoutObservable<boolean>;
        public swapSidebarPositionDescription:KnockoutObservable<string>;

        public theme:KnockoutComputed<IThemeDefinition>;
        public themeDescription:KnockoutObservable<string>;
        public themes:IThemeDefinition[];
        public themeUrl:KnockoutComputed<string>;

        public themeName:KnockoutObservable<string>;

        constructor()
        {
            this.storageOptions = ko.observableArray([
                new TodoTxtJs.StorageProviders.BrowserStorage()
            ]);

            // Ensure Dropbox key exists before attempting to load dropbox support
            if (typeof (dropbox_key) !== 'undefined' && dropbox_key)
            {
                this.storageOptions.push(new TodoTxtJs.StorageProviders.DropboxStorage());
            }
            else
            {
                console.warn("Dropbox support disabled. No dropbox key found.");
            }

            this.storageInfo = ko.observable(this.storageOptions()[0]);
            this.storage = ko.computed<string>({
                owner: this,
                read : () =>
                {
                    return this.storageInfo().name;
                }
            });

            this.storagePath = ko.computed({
                owner: this,
                read : () =>
                {
                    var result = this.storageInfo().path;
                    return result ? result() : null;
                },
                write: (value:string) =>
                {
                    this.storageInfo().path(value);
                }
            });

            this.storagePathDescription = ko.computed<string>({
                owner: this,
                read : () =>
                {
                    return this.storageInfo().pathDescription;
                }
            });

            this.addCreatedDate = ko.observable<boolean>(false);
            this.addCreatedDateDescription = ko.observable<string>("Automatically add a start date to new TODOs.");

            this.removeCompletePriority = ko.observable<boolean>(false);
            this.removeCompletePriorityDescription = ko.observable<string>("Compatibility with official apps. Removes the priority from a Todo when it's marked as completed.");

            this.showStorageControls = ko.computed({
                owner: this,
                read : ()=>
                {
                    return this.storageInfo().controls.storage;
                }
            });

            this.showImport = ko.computed({
                owner: this,
                read : ()=>
                {
                    return this.storageInfo().controls.imports;
                }
            });

            this.showExport = ko.computed({
                owner: this,
                read : ()=>
                {
                    return this.storageInfo().controls.exports;
                }
            });

            this.saveOnChange = ko.observable<boolean>(true);
            this.saveOnChangeDescription = ko.observable<string>("Save changes immediately after you add/remove/edit a Todo.");

            this.caseSensitive = ko.observable<boolean>(false);
            this.caseSensitiveDescription = ko.observable<string>("Projects and Contexts are case-sensitive. This is how official apps behave.");

            this.swapSidebarPosition = ko.observable<boolean>(false);
            this.swapSidebarPositionDescription = ko.observable<string>("Place the sidebar on the left of the Todo list.");

            this.themes = [
                {name: "Original", file: "simple_default.css"},
                // { name: "Modern", file: "modern.css" },
                {name: "Solarized Dark", file: "simple_solarized_dark.css"},
                {name: "Solarized Light", file: "simple_solarized_light.css"}
            ];

            this.themeName = ko.observable<string>(this.themes[0].name);
            this.themeDescription = ko.observable<string>("The theme to use for this page.");
            this.theme = ko.computed({
                owner: this,
                read : ()=>
                {
                    for (var i = 0; i < this.themes.length; i++)
                    {
                        if (this.themes[i].name === this.themeName())
                        {
                            return this.themes[i];
                        }
                    }

                    return undefined;
                }
            });
            this.themeUrl = ko.computed({
                owner: this,
                read : ()=>
                {
                    return "css/" + this.theme().file;
                }
            });
        }

        public save():void
        {
            var oldOptions:any = {};
            if (window.localStorage["TodoTxtJsOptions"])
            {
                oldOptions = JSON.parse(window.localStorage["TodoTxtJsOptions"]);
            }

            // Just write out everything, it's during loading we're selective
            window.localStorage["TodoTxtJsOptions"] = ko.toJSON(this);
        }

        public load():void
        {
            if (window.localStorage["TodoTxtJsOptions"])
            {
                var options:any = JSON.parse(window.localStorage["TodoTxtJsOptions"]);

                // Only load actual options, so we don't break the view model
                // Storage
                var i:number;
                if (options.hasOwnProperty("storage"))
                {
                    for (i = 0; i < this.storageOptions().length; i++)
                    {
                        if (this.storageOptions()[i].name === options.storage)
                        {
                            this.storageInfo(this.storageOptions()[i]);
                            if (options.storageInfo.path)
                            {
                                this.storageInfo().path(options.storageInfo.path);
                            }
                            break;
                        }
                    }
                }

                // Create Date
                if (options.hasOwnProperty("addCreatedDate"))
                {
                    this.addCreatedDate(<boolean>options.addCreatedDate);
                }

                // Remove Completed Priority
                if (options.hasOwnProperty("removeCompletePriority"))
                {
                    this.removeCompletePriority(<boolean>options.removeCompletePriority);
                }

                // Auto-save
                if (options.hasOwnProperty("saveOnChange"))
                {
                    this.saveOnChange(<boolean>options.saveOnChange);
                }

                // Case Sensitive
                if (options.hasOwnProperty("caseSensitive"))
                {
                    this.caseSensitive(<boolean>options.caseSensitive);
                }

                // Theme
                if (options.hasOwnProperty("themeName"))
                {
                    // Make sure always have a theme, even if the
                    // saved option is nonsense.
                    for (i = 0; i < this.themes.length; i++)
                    {
                        if (this.themes[i].name === <string>options.themeName)
                        {
                            this.themeName(<string>options.themeName);
                            break;
                        }
                    }
                }

                // swap Sidebar
                if (options.hasOwnProperty("swapSidebarPosition"))
                {
                    this.swapSidebarPosition(<boolean>options.swapSidebarPosition);
                }
            }
        }
    }
}


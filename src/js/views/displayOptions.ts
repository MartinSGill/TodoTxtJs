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
/// <reference path="../model/todomanager.ts" />
module TodoTxtJs.View
{
    interface IDisplayStorage
    {
        showCompleted: boolean;
        showShortUrls: boolean;
        showCreatedDate: boolean;
        primarySort: string;
        secondarySort: string;
    }

    export class DisplayOptions
    {
        public showCompleted: KnockoutObservable<boolean>;
        public showShortUrls: KnockoutObservable<boolean>;
        public showCreatedDate: KnockoutObservable<boolean>;

        public primarySort: KnockoutComputed<string>;
        public secondarySort: KnockoutComputed<string>;
        public sortTypes: string[];

        private _todoManager: TodoManager;

        constructor(todoManager: TodoManager)
        {
            this._todoManager = todoManager;

            this.showCompleted = ko.observable<boolean>(false);
            this.showShortUrls = ko.observable<boolean>(true);
            this.showCreatedDate = ko.observable<boolean>(true);

            this.primarySort = ko.computed<string>(
                {
                    owner: this,
                    read: ():string =>
                    {
                        return this._todoManager.primarySort();
                    },
                    write: (newValue: string)=>
                    {
                        this._todoManager.primarySort(newValue);
                    }
                });

            this.secondarySort = ko.computed<string>(
                {
                    owner: this,
                    read: ():string =>
                    {
                        return this._todoManager.secondarySort();
                    },
                    write: (newValue: string)=>
                    {
                        this._todoManager.secondarySort(newValue);
                    }
                });

            this.sortTypes = this._todoManager.sortTypes;
        }

        public save() : void
        {
            window.localStorage["TodoTxtJsDisplayOptions"] = JSON.stringify(
                {
                    showCompleted: this.showCompleted(),
                    showShortUrls: this.showShortUrls(),
                    showCreatedDate: this.showCreatedDate(),
                    primarySort: this.primarySort(),
                    secondarySort: this.secondarySort()
                });
        }

        public load(): void
        {
            try
            {
                var options = <IDisplayStorage>JSON.parse(window.localStorage["TodoTxtJsDisplayOptions"]);
                if (options)
                {
                    this.showCompleted(options.showCompleted);
                    this.showShortUrls(options.showShortUrls);
                    this.showCreatedDate(options.showCreatedDate);
                    this.primarySort(options.primarySort);
                    this.secondarySort(options.secondarySort);
                }
            }
            catch (e)
            {
                console.warn("Display options exist, but data seems corrupted.")
            }

        }
    }
}

var TodoTxtJs;
(function (TodoTxtJs) {
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
    /// <reference path="IStorageProvider.ts" />
    (function (StorageProviders) {
        var BrowserStorage = (function () {
            function BrowserStorage() {
                this.name = "Browser";
                this.description = "Stores your Todos in local browser storage on this computer.";
                this.controls = {
                    storage: false,
                    exports: true,
                    imports: true
                };
            }
            BrowserStorage.prototype.load = function (onSuccess, onError) {
                if(window.localStorage["todos"]) {
                    var todos = window.localStorage["todos"].match(/^(.+)$/mg);
                    onSuccess(todos);
                }
            };
            BrowserStorage.prototype.save = function (data, onSuccess, onError) {
                window.localStorage["todos"] = data;
            };
            return BrowserStorage;
        })();
        StorageProviders.BrowserStorage = BrowserStorage;        
    })(TodoTxtJs.StorageProviders || (TodoTxtJs.StorageProviders = {}));
    var StorageProviders = TodoTxtJs.StorageProviders;
})(TodoTxtJs || (TodoTxtJs = {}));
//@ sourceMappingURL=storage_browser.js.map

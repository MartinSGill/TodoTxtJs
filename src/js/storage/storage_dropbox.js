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
    /// <reference path="../defs/dropbox.d.ts" />
    (function (StorageProviders) {
        var DropboxStorage = (function () {
            function DropboxStorage() {
                this.name = "Dropbox";
                this.description = "Stores your Todos in '/Todo/todo.txt' in your dropbox account.";
                this.controls = {
                    storage: true,
                    exports: false,
                    imports: false
                };
                this._authenticating = false;
            }
            DropboxStorage.prototype.load = function (onSuccess, onError) {
                this.authenticate(function (client) {
                    client.readFile('Todo/todo.txt', function (error, data) {
                        if (error) {
                            var errorMsg = JSON.parse(error.responseText).error;
                            if (onError) {
                                onError(errorMsg);
                            }
                            return;
                        }

                        var todos = data.match(/^(.+)$/mg);
                        onSuccess(todos);
                    });
                }, onError);
            };

            DropboxStorage.prototype.save = function (data, onSuccess, onError) {
                this.authenticate(function (client) {
                    client.writeFile('Todo/todo.txt', data, function (error, data) {
                        if (error) {
                            var errorMsg = JSON.parse(error.responseText).error;
                            if (onError) {
                                onError(errorMsg);
                            }
                            return;
                        }

                        if (onSuccess) {
                            onSuccess();
                        }
                    });
                }, onError);
            };

            DropboxStorage.prototype.authenticate = function (onSuccess, onError) {
                if (this._authenticating) {
                    return;
                }
                this._authenticating = true;
                var client = new TodoTxtJs.Dropbox.Client({
                    // Read the getting started document
                    // or just read sample_dropbox_key.js
                    key: TodoTxtJs.dropbox_key,
                    sandbox: false
                });

                client.authDriver(new TodoTxtJs.Dropbox.Drivers.Redirect({ rememberUser: true }));
                client.authenticate(function (error, client) {
                    if (error) {
                        onError(error);
                        return;
                    }

                    this._authenticating = false;
                    onSuccess(client);
                });
            };
            return DropboxStorage;
        })();
        StorageProviders.DropboxStorage = DropboxStorage;
    })(TodoTxtJs.StorageProviders || (TodoTxtJs.StorageProviders = {}));
    var StorageProviders = TodoTxtJs.StorageProviders;
})(TodoTxtJs || (TodoTxtJs = {}));
//# sourceMappingURL=storage_dropbox.js.map

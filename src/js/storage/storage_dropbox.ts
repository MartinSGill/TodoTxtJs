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

module TodoTxtJs.StorageProviders
{
    export class DropboxStorage implements IStorageProvider
    {
        public name: string = "Dropbox";
        public description: string = "Stores your Todos in '/Todo/todo.txt' in your Dropbox account.";
        public controls = {
            storage: true,
            exports: true,
            imports: true
        };

        private _versionTag: string;
        private _client: Dropbox.Client;

        constructor()
        {
            this._client = new Dropbox.Client({
                // Read the getting started document
                // or just read sample_dropbox_key.js
                key: dropbox_key,
                sandbox: false
            });

            this._client.authDriver(new Dropbox.Drivers.Redirect({ rememberUser: true }));
        }

        public load = (onSuccess?: (Object) => void, onError?: (string) => void): void =>
        {
            var self = this;
            this.authenticate(()=>
            {
                this._client.readFile('Todo/todo.txt', null, (error: Dropbox.ApiError, data: any, stat: Dropbox.File.Stat) =>
                {
                    this._onFileRead(error, data, stat, onSuccess, onError)
                });
            }, onError);
        };

        public save = (data: Object, onSuccess?: () => void, onError?: (string) => void): void =>
        {
            this.authenticate(() =>
            {
                this._client.writeFile('Todo/todo.txt', data, { lastVersionTag: this._versionTag, noOverwrite: false }, function (error, data)
                {
                    if (error)
                    {
                        var errorMsg = JSON.parse(error.responseText).error;
                        if (onError)
                        {
                            onError(errorMsg);
                        }
                        return;
                    }

                    if (onSuccess)
                    {
                        onSuccess();
                    }
                });
            }, onError);
        };

        private _onFileRead = (error: Dropbox.ApiError,
            data: any,
            stat: Dropbox.File.Stat,
            onSuccess: (todos: string[]) => void,
            onError: (error: string) => void)
            : void =>
        {
            if (error)
            {
                var errorMsg = JSON.parse(error.responseText).error;
                if (onError)
                {
                    onError(errorMsg);
                }
                return;
            }

            this._versionTag = stat.versionTag;
            var todos = data.match(/^(.+)$/mg);
            onSuccess(todos);
        }

        private _authenticating: boolean = false;

        private authenticate = (onSuccess, onError) =>
        {
            // Prevent other requests while authenticating
            // e.g. the save triggered on page close (i.e. when redirecting to authenticate!)
            if (this._authenticating) { return; }
            this._authenticating = true;

            if (this._client.isAuthenticated())
            {
                onSuccess();
                return;
            }
            else
            {
                this._client.authenticate((error) =>
                {
                    if (error)
                    {
                        onError(error);
                        return;
                    }

                    this._authenticating = false;
                    onSuccess();
                });
            }
        };
    }
}


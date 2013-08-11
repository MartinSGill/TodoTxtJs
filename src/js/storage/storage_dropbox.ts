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
        public name:string = "Dropbox";
        public description:string = "Stores your Todos in '/Todo/todo.txt' in your Dropbox account.";
        public controls = {
            storage: true,
            exports: true,
            imports: true
        };

        constructor()
        {

        }

        public load = (onSuccess? : (Object) => void, onError?: (string) => void) : void =>
        {
            this.authenticate(function(client)
                              {
                                  client.readFile('Todo/todo.txt', function(error, data){
                                      if (error)
                                      {
                                          var errorMsg = JSON.parse(error.responseText).error;
                                          if (onError)
                                          {
                                              onError(errorMsg);
                                          }
                                          return;
                                      }

                                      var todos = data.match(/^(.+)$/mg);
                                      onSuccess(todos);
                                  });
                              }, onError);
        };

        public save = (data : Object, onSuccess? : () => void, onError?: (string) => void) : void =>
        {
            this.authenticate((client) =>
                              {
                                  client.writeFile('Todo/todo.txt', data, function(error, data){
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

        private _authenticating:boolean = false;

        private authenticate = (onSuccess, onError) =>
        {
            // Prevent other requests while authenticating
            // e.g. the save triggered on page close (i.e. when redirecting to authenticate!)
            if (this._authenticating) { return; }
            this._authenticating = true;
            var client = new Dropbox.Client({
                                                // Read the getting started document
                                                // or just read sample_dropbox_key.js
                                                key: dropbox_key,
                                                sandbox: false
                                            });

            client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));
            client.authenticate((error, client) => {
                                    if (error)
                                    {
                                        onError(error);
                                        return;
                                    }

                                    this._authenticating = false;
                                    onSuccess(client);
                                }
            );
        };
    }
}


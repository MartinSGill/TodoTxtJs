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

function DropboxStorageProvider()
{
    var self = this;

    self.name = "Dropbox";
    self.description = "Stores your Todos in '/Todo/todo.txt' in your dropbox account.";
    self.controls = {
        storage: true,
        exports: false,
        imports: false
    };

    var authenticating = false;

    function authenticate(onSuccess, onError)
    {
        // Prevent other requests while authenticating
        // e.g. the save triggered on page close (i.e. when redirecting to authenticate!)
        if (authenticating) { return; }
        authenticating = true;
        var client = new Dropbox.Client({
            // Read the getting started document
            // or just read sample_dropbox_key.js
            key: dropbox_key,
            sandbox: false
        });

        client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));
        client.authenticate(function(error, client) {
            if (error)
            {
                onError(error);
                return;
            }

            authenticating = false;
            onSuccess(client);
        }
        );
    }

    self.load = function(onSuccess, onError)
    {
        authenticate(function(client)
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

    self.save = function(data, onSuccess, onError)
    {
        authenticate(function(client)
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
}

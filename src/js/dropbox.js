/*
 * Copyright (c) 2013. Martin Gill. All Rights Reserved.
 */

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

    function authenticate(onSuccess, onError)
    {
        var client = new Dropbox.Client({
            key: 'dNWCSmlUBHA=|KyMAUxf3OQ40u5GX4V4iqP/zJc4eQKsRk7GPjSf5VQ==',
            sandbox: false
        });

        client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));
        client.authenticate(function(error, client) {
            if (error)
            {
                onError(error);
                return;
            }

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
                                 onError(error);
                                 return;
                             }

                             var todos = data.match(/^(.+)$/mg);
                             onSuccess(todos);
                         });
                     }, onError);
    };

    self.save = function(onSuccess, onError)
    {

    };
}

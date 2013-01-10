
function BrowserStorageProvider()
{
    var self = this;

    self.name = "Browser";
    self.description = "Stores your Todos in local browser storage on this computer.";
    self.controls = {
        storage: false,
        exports: true,
        imports: true
    };

    self.load = function(onSuccess, onError)
    {
        if (window.localStorage.todos)
        {
            var todos = window.localStorage.todos.match(/^(.+)$/mg);
            onSuccess(todos);
        }
    };

    self.save = function(data, onSuccess, onError)
    {
        window.localStorage.todos = data;
    };
}

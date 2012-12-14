
function TodoManager()
{
    "use strict";
    var self = this;

    var nextId = 0;
    var data = [];

    self.removeAll = function()
    {
        data = [];
    };

    self.loadFromStringArray = function(data)
    {
        if (typeof(data) !== 'array')
        {
            throw "Argument isn't an array.";
        }

        for (var i = 0; i < data.length; i++)
        {
            var obj = data[i];
            var todo = Todo(obj);
            todo.index = nextId++;
            data[todo.index] = todo;
        }
    };
}

////////////////////////////////////////////////////////////////////////////
// Todo Helpers
////////////////////////////////////////////////////////////////////////////

var TodoHelpers =
{
    extractFlagged:function(text, flag)
    {
        var regex = new RegExp("(?:\\s|^)" + flag + "(\\w+)(?=\\s|$)", 'g');
        var result = [];
        var match = regex.exec(text);
        while (match !== null)
        {
            result.push(match[1].toLowerCase());
            match = regex.exec(text);
        }

        return result;
    },

    extractPriority:function(text)
    {
        var regex = new RegExp("\\(([A-Z])\\)", "g");
        var result = [];
        var match = regex.exec(text);

        while (match !== null)
        {
            result.push(match[1]);
            match = regex.exec(text);
        }

        return result;
    }
};

////////////////////////////////////////////////////////////////////////////
// Main View Model
////////////////////////////////////////////////////////////////////////////

function TodoTxtViewModel()
{
    var self = this;

    /************************************************
     * Inner Constructors
     ***********************************************/

    self.title = ko.observable("TodoTxtJS");
    self.version = ko.observable("0.3");

    self.allTodos = ko.observableArray([]);

    self.priorities = ko.observableArray([]);
    self.projects = ko.observableArray([]);
    self.contexts = ko.observableArray([]);

    self.showCompleted = ko.observable(false);

    self.newPriorityFilter = ko.observable();

    ////////////////////////////////////////////////////////////////////////////
    // Options
    ////////////////////////////////////////////////////////////////////////////
    self.options = new Options(self);

    function Options(parent)
    {
        var self = this;

        ///////////////////////////
        // Options
        ///////////////////////////
        self.useDropbox = ko.observable(false);

        ///////////////////////////
        // Control
        ///////////////////////////
        self.showingOptions = ko.observable(false);

        self.showOptionsBox = function()
        {
            parent.exporting.hide();
            parent.importing.hide();
            self.showingOptions(!self.showingOptions());
            if (!self.showingOptions())
            {
                self.save();
                if (self.useDropbox())
                {
                    parent.load();
                }
            }
        };

        self.hide = function()
        {
            self.showingOptions(false);
        };

        self.save = function()
        {
            localStorage.TodoTxtJsOptions = ko.toJSON(self);
        };

        self.load = function()
        {
            if (localStorage.TodoTxtJsOptions)
            {
                var options = JSON.parse(localStorage.TodoTxtJsOptions);
                if (options.hasOwnProperty("useDropbox"))
                {
                    self.useDropbox(options.useDropbox);
                }
            }
        };

        self.load();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Import / Export
    ////////////////////////////////////////////////////////////////////////////

    self.importing = new Importing(self);
    self.exporting = new Exporting(self);

    function Importing(parent)
    {
        var self = this;
        self.importingTodos = ko.observable(false);
        self.importText = ko.observable("");

        self.showImportBox = function()
        {
            parent.exporting.hide();
            parent.options.hide();
            self.importingTodos(!self.importingTodos());
        };

        self.importTodos = function()
        {
            parent.allTodos.removeAll();
            var todos = self.importText().match(/^(.+)$/mg);
            for (var i = 0; i < todos.length; i++)
            {
                parent.addTodo(new Todo(todos[i]));
            }
            self.importingTodos(false);
        };

        self.hide = function()
        {
            self.importingTodos(false);
        };
    }

    function Exporting(parent)
    {
        var self = this;
        self.exportingTodos = ko.observable(false);
        self.exportText = ko.observable("");

        self.buildExportText = function()
        {
            var result = "";
            for (var i = 0; i < parent.allTodos().length; i++)
            {
                if (i > 0)
                {
                    result += "\n";
                }
                result += parent.allTodos()[i].toString();
            }

            return result;
        };

        self.showExportBox = function()
        {
            parent.importing.hide();
            parent.options.hide();
            self.exportingTodos(!self.exportingTodos());
            if (self.exportingTodos())
            {
                self.exportText(self.buildExportText());
            }
        };

        self.hide = function()
        {
            self.exportingTodos(false);
        };
    }

    ////////////////////////////////////////////////////////////////////////////
    // Build Helper Arrays
    ////////////////////////////////////////////////////////////////////////////

    function addPriority(name)
    {
        if (!_.find(self.priorities(), function(val)
        {
            return val === name;
        }))
        {
            self.priorities.push(name);
            self.priorities.sort();
        }
    }

    function addProjects(projects)
    {
        var notSeen = _.difference(projects, self.projects());
        self.projects.push(notSeen);
        self.projects.sort();
    }

    function addContexts(contexts)
    {
        var notSeen = _.difference(contexts, self.contexts());
        self.projects.push(notSeen);
        self.projects.sort();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Filters
    ////////////////////////////////////////////////////////////////////////////

    self.filters = ko.observable();

    self.filtersProject = ko.computed(function()
                                      {
                                          return TodoHelpers.extractFlagged(self.filters(), "\\+");
                                      });

    self.filtersContext = ko.computed(function()
                                      {
                                          return TodoHelpers.extractFlagged(self.filters(), "@");
                                      });

    self.filtersPriority = ko.computed(function()
                                       {
                                           return TodoHelpers.extractPriority(self.filters());
                                       });

    self.filtered = ko.computed(function()
                                {
                                    return self.filtersProject().length > 0 ||
                                           self.filtersContext().length > 0 ||
                                           self.filtersPriority().length > 0;
                                });

    self.toggleCompleted = function(todo)
    {
        todo.completed(!todo.completed());
        if (todo.completed())
        {
            todo.completedDate($.datepicker.formatDate('yy-mm-dd', new Date()));
        }
        else
        {
            todo.completedDate("");
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Display
    ////////////////////////////////////////////////////////////////////////////

    self.isDisplayed = function(todo)
    {
        if (!self.showCompleted() && todo.completed())
        {
            return false;
        }

        var result = true;
        if (self.filtered())
        {
            result = true;
            if (self.filtersProject().length > 0)
            {
                if (_.intersection(todo.projects, self.filtersProject()).length === self.filtersProject().length)
                {
                    result = result && true;
                }
                else
                {
                    result = false;
                }
            }

            if (self.filtersContext().length > 0)
            {
                if (_.intersection(todo.contexts, self.filtersContext()).length === self.filtersContext().length)
                {
                    result = result && true;
                }
                else
                {
                    result = false;
                }
            }

            if (self.filtersPriority().length > 0)
            {
                if (_.indexOf(self.filtersPriority(), todo.priority) >= 0)
                {
                    result = result && true;
                }
                else
                {
                    result = false;
                }
            }
        }

        return result;
    };

    var sortTodos = function(todo)
    {
        var result = 0;
        if (todo.priority === null)
        {
            result += 1000;
        }
        else
        {
            result += todo.priority.charCodeAt(0);
        }

        if (todo.completed())
        {
            result += 5000;
        }

        return result;
    };

    self.displayedTodos = ko.computed(function()
                                      {
                                          var todos = [];
                                          for (var i = 0; i < self.allTodos().length; i++)
                                          {
                                              if (self.isDisplayed(self.allTodos()[i]))
                                              {
                                                  todos.push(self.allTodos()[i]);
                                              }
                                          }

                                          return _.sortBy(todos, sortTodos);
                                      });

    ////////////////////////////////////////////////////////////////////////////
    // TODO Management
    ////////////////////////////////////////////////////////////////////////////

    self.newTodoText = ko.observable("");

    self.addNewTodo = function()
    {
        self.addTodo(new Todo(self.newTodoText()));
        self.newTodoText("");
    };

    self.addTodo = function(todo)
    {
        self.allTodos.push(todo);

        if (todo.priority !== null)
        {
            addPriority(todo.priority);
        }

        addProjects(todo.projects);
        addContexts(todo.contexts);
    };

    self.save = function()
    {
        if (typeof(Storage) !== "undefined")
        {
            localStorage.todos = self.exporting.buildExportText();
        }
    };

    self.load = function()
    {
        if (typeof(Storage) !== "undefined")
        {
            if (self.options.useDropbox())
            {
                self.lastUpdated("updating...");
                $.getJSON("/todo/api/getTodoFile.php", null, function(data)
                {
                    self.lastUpdated(new Date());
                    self.importing.importText(data.data);
                    self.importing.importTodos();
                });
            }
            else
            {
                if (localStorage.todos)
                {
                    self.importing.importText(localStorage.todos);
                    self.importing.importTodos();
                }
            }
        }
    };

    self.lastUpdated = ko.observable();
    self.refresh = function()
    {
        self.load();
    };

    self.load();
}

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);


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
    var apiPath = document.location.pathname.replace('todotxt.html', '');

    /************************************************
     * Inner Constructors
     ***********************************************/

    self.title = ko.observable("TodoTxtJS");
    self.version = ko.observable("0.4");

    self.allTodos = ko.observableArray([]);

    self.priorities = ko.observableArray([]);
    self.projects = ko.observableArray([]);
    self.contexts = ko.observableArray([]);

    self.showCompleted = ko.observable(false);

    self.newPriorityFilter = ko.observable();

    ////////////////////////////////////////////////////////////////////////////
    // Options
    ////////////////////////////////////////////////////////////////////////////

    function Options(parent)
    {
        var self = this;

        var storageConstants = {
            browser: "browser",
            server: "server",
            dropbox: "dropbox"
        };

        ///////////////////////////
        // Options
        ///////////////////////////

        self.storageOptions = ko.observableArray([
                { name: storageConstants.browser, tip: "Store in Local Browser storage." },
                { name: storageConstants.server, tip: "Store data on the server."}
            ]
          );
        self.storageInfo = ko.observable(self.storageOptions()[0]);
        self.storage = ko.computed(function() { return self.storageInfo().name; } );

        ///////////////////////////
        // Control
        ///////////////////////////
        self.showStorageControls = ko.computed( function() { return self.storage() === storageConstants.server; } );
        self.showImport = ko.computed( function() { return self.storage() === storageConstants.browser; } );
        self.showExport = ko.computed( function() { return self.storage() === storageConstants.browser; } );

        self.showOptionsBox = function()
        {
            parent.exporting.hide();
            parent.importing.hide();
            self.showingOptions(!self.showingOptions());
            if (!self.showingOptions())
            {
                self.save();
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
                if (options.hasOwnProperty("storage"))
                {
                    for (var i = 0; i < self.storageOptions().length; i++)
                    {
                        if (self.storageOptions()[i].name === options.storage)
                        {
                            self.storageInfo(self.storageOptions()[i]);
                            break;
                        }
                    }
                }
            }
        };

        self.load();


    }
    self.options = new Options(self);

    self.toggleToolbox = function(element)
    {
        var selected = false;
        var menuItem = $(element).parent();
        self.options.save();
        if (menuItem.hasClass("selected"))
        {

            if (menuItem[0].id === 'options')
            {
                self.options.save();
            }
            selected = true;
        }
        else
        {
            if (menuItem[0].id === 'export')
            {
               self.exporting.fillExportBox();
            }
        }

        $(".menuItem").removeClass("selected");
        $(".menuItem .toolbox").hide();

        if (!selected)
        {
            menuItem.addClass("selected");
            $(".toolbox", menuItem).show();
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Import / Export
    ////////////////////////////////////////////////////////////////////////////

    function Importing(parent)
    {
        var self = this;
        self.importText = ko.observable("");

        self.importTodos = function()
        {
            parent.allTodos.removeAll();
            var todos = self.importText().match(/^(.+)$/mg);
            for (var i = 0; i < todos.length; i++)
            {
                parent.addTodo(new Todo(todos[i]));
            }
        };
    }

    function Exporting(parent)
    {
        var self = this;
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

        self.fillExportBox = function()
        {
            self.exportText(self.buildExportText());
        };

        self.hide = function()
        {
            self.exportingTodos(false);
        };
    }

    self.importing = new Importing(self);
    self.exporting = new Exporting(self);

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
        switch (self.options.storage())
        {
            case 'dropbox':
                self.lastUpdated("saving...");
                $.ajax({
                        url: apiPath + 'api/putTodoFile.php',
                        type: 'post',
                        data: JSON.stringify({ text: self.exporting.buildExportText() }),
                        success: function(data) {
                            self.lastUpdated(new Date());
                        }
                    });
                break;

            case 'browser':
                localStorage.todos = self.exporting.buildExportText();
                break;

            case 'server':
                self.lastUpdated("saving...");
                $.ajax({
                    url: apiPath + "api/setTodos",
                    data: null,
                    success: function(data)
                    {
                        self.lastUpdated(new Date());
                    },
                    error: function(xhr, ajax, thrownError)
                    {
                    }});
                break;
        }
    };

    self.load = function()
    {
        if (typeof(Storage) !== "undefined")
        {
            switch (self.options.storage())
            {
                case 'dropbox':
                    self.lastUpdated("updating...");
                    $.ajax({
                        url: apiPath + "api/getTodoFile.php",
                        data: null,
                        success: function(data)
                        {
                            self.lastUpdated(new Date());
                            self.importing.importText(data.data);
                            self.importing.importTodos();
                        },
                        error: function(a,b,c)
                        {
                            console.write(a,b,c);
                        }});
                    break;

                case 'browser':
                    if (localStorage.todos)
                    {
                        self.importing.importText(localStorage.todos);
                        self.importing.importTodos();
                    }
                    break;

                case 'server':
                    self.lastUpdated("updating...");
                    $.ajax({
                        url: apiPath + "api/getTodos",
                        type: 'post',
                        data: null,
                        success: function(data)
                        {
                            self.lastUpdated(new Date());
                            self.importing.importText(JSON.parse(data).data);
                            self.importing.importTodos();
                        },
                        error: function(xhr, ajax, thrownError)
                        {
                        }});
                    break;
            }
        }
    };

    $(window).unload( self.save );

    self.lastUpdated = ko.observable();
    self.refresh = function()
    {
        self.load();
    };

    self.load();

    self.pageReady = ko.observable(false);
    $(document).ready( function() { self.pageReady(true); });
}

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);


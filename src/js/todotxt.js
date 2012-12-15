////////////////////////////////////////////////////////////////////////////
// Todo Helpers
////////////////////////////////////////////////////////////////////////////

var TodoHelpers =
{
    extractFlagged:function (text, flag)
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

    extractPriority:function (text)
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

    var todoManager = new TodoManager();

    /************************************************
     * Inner Constructors
     ***********************************************/

    self.title = ko.observable("TodoTxtJS");
    self.version = ko.observable("0.5");

    self.allTodos = ko.computed(function() { return todoManager.all(); } );

    self.priorities = ko.observableArray([]);
    self.projects = ko.computed(function() { return todoManager.allProjects(); } );
    self.contexts = ko.computed(function() { return todoManager.allContexts(); } );

    self.showCompleted = ko.observable(false);

    self.newPriorityFilter = ko.observable(undefined);

    ////////////////////////////////////////////////////////////////////////////
    // Options
    ////////////////////////////////////////////////////////////////////////////

    function Options()
    {
        var self = this;

        var storageConstants = {
            browser:"browser",
            server:"server",
            dropbox:"dropbox"
        };

        ///////////////////////////
        // Options
        ///////////////////////////

        self.storageOptions = ko.observableArray([
            { name:storageConstants.browser, tip:"Store in Local Browser storage." },
            { name:storageConstants.server, tip:"Store data on the server."}
        ]
        );
        self.storageInfo = ko.observable(self.storageOptions()[0]);
        self.storage = ko.computed(function ()
        {
            return self.storageInfo().name;
        });

        ///////////////////////////
        // Control
        ///////////////////////////
        self.showStorageControls = ko.computed(function ()
        {
            return self.storage() === storageConstants.server;
        });
        self.showImport = ko.computed(function ()
        {
            return self.storage() === storageConstants.browser;
        });
        self.showExport = ko.computed(function ()
        {
            return self.storage() === storageConstants.browser;
        });

        self.save = function ()
        {
            localStorage.TodoTxtJsOptions = ko.toJSON(self);
        };

        self.load = function ()
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

    self.options = new Options();

    self.toggleToolbox = function (element)
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

    function Importing()
    {
        var self = this;
        self.importText = ko.observable("");

        self.importTodos = function ()
        {
            todoManager.removeAll();
            var todos = self.importText().match(/^(.+)$/mg);
            todoManager.loadFromStringArray(todos);
        };
    }

    function Exporting()
    {
        var self = this;
        self.exportText = ko.observable("");

        self.buildExportText = function ()
        {
            var todos = todoManager.exportToStringArray();
            return todos.join("\n");
        };

        self.fillExportBox = function ()
        {
            self.exportText(self.buildExportText());
        };
    }

    self.importing = new Importing(self);
    self.exporting = new Exporting(self);

    ////////////////////////////////////////////////////////////////////////////
    // Filters
    ////////////////////////////////////////////////////////////////////////////

    self.filters = ko.observable("");

    self.filtersProject = ko.computed(function ()
    {
        return TodoHelpers.extractFlagged(self.filters(), "\\+");
    });

    self.filtersContext = ko.computed(function ()
    {
        return TodoHelpers.extractFlagged(self.filters(), "@");
    });

    self.filtersPriority = ko.computed(function ()
    {
        return TodoHelpers.extractPriority(self.filters());
    });

    self.filtered = ko.computed(function ()
    {
        return self.filtersProject().length > 0 ||
            self.filtersContext().length > 0 ||
            self.filtersPriority().length > 0;
    });

    self.addFilterPriority = function (priority)
    {
        self.filters(self.filters() + " (" + priority + ")");
    };

    self.addFilterProject = function (project)
    {
        self.filters(self.filters() + " +" + project);
    };

    self.addFilterContext = function (context)
    {
        self.filters(self.filters() + " @" + context);
    };

    self.clearFilters = function ()
    {
        self.filters("");
    };

    ////////////////////////////////////////////////////////////////////////////
    // Display
    ////////////////////////////////////////////////////////////////////////////

    self.isDisplayed = function (todo)
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

    ////////////////////////////////////////////////////////////////////////////
    // TODO Management
    ////////////////////////////////////////////////////////////////////////////

    self.newTodoText = ko.observable("");

    self.addNewTodo = function ()
    {
        todoManager.add(new Todo(self.newTodoText()));
        self.newTodoText("");
    };

    self.save = function ()
    {
        switch (self.options.storage())
        {
            case 'dropbox':
                self.lastUpdated("saving...");
                $.ajax({
                    url:apiPath + 'api/putTodoFile.php',
                    type:'post',
                    data:JSON.stringify({ text:self.exporting.buildExportText() }),
                    success:function()
                    {
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
                    url:apiPath + "api/setTodos",
                    data:null,
                    success:function()
                    {
                        self.lastUpdated(new Date());
                    },
                    error:function (/*xhr, ajax, thrownError*/)
                    {
                    }});
                break;
        }
    };

    self.load = function ()
    {
        if (typeof(Storage) !== "undefined")
        {
            switch (self.options.storage())
            {
                case 'dropbox':
                    self.lastUpdated("updating...");
                    $.ajax({
                        url:apiPath + "api/getTodoFile.php",
                        data:null,
                        success:function (data)
                        {
                            self.lastUpdated(new Date());
                            self.importing.importText(data.data);
                            self.importing.importTodos();
                        },
                        error:function (a, b, c)
                        {
                            console.write(a, b, c);
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
                        url:apiPath + "api/getTodos",
                        type:'post',
                        data:null,
                        success:function (data)
                        {
                            self.lastUpdated(new Date());
                            self.importing.importText(JSON.parse(data).data);
                            self.importing.importTodos();
                        },
                        error:function (/*xhr, ajax, thrownError*/)
                        {
                        }});
                    break;
            }
        }
    };

    $(window).unload(self.save);

    self.lastUpdated = ko.observable(undefined);
    self.refresh = function ()
    {
        self.load();
    };

    self.load();

    self.pageReady = ko.observable(false);
    $(document).ready(function ()
    {
        self.pageReady(true);
    });
}

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);


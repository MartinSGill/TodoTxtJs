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

    self.title = ko.observable("TodoTxt WebApp");
    self.version = ko.observable("0.6");

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
            browser:"browser"//,
            //server:"server",
            //dropbox:"dropbox"
        };

        ///////////////////////////
        // Options
        ///////////////////////////

        self.storageOptions = ko.observableArray([
            { name:storageConstants.browser, tip:"Store in browser LocalStorage. (This means your Todos are saved on your own computer.)" }//,
            //{ name:storageConstants.server, tip:"Store data on the server."}
        ]
        );
        self.storageInfo = ko.observable(self.storageOptions()[0]);
        self.storage = ko.computed(function ()
        {
            return self.storageInfo().name;
        });

        self.stylesheets = ko.observableArray([
                                                  { name: "Simple", source: "css/simple.css", info:"light and rounded/simple theme." },
                                                  { name: "Blocky", source: "css/blocky.css", info: "darker blockier theme." }
                                              ]);
        self.stylesheet = ko.observable(self.stylesheets()[0]);

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

                if (options.hasOwnProperty("stylesheet"))
                {
                    self.stylesheet(options.stylesheet);
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
        $(".menuItem .toolBox").hide();

        if (!selected)
        {
            menuItem.addClass("selected");
            $(".toolBox", menuItem).show();
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

    self.filtered = ko.computed(function ()
    {
        return self.filters() && self.filters().length > 0;
    });

    self.clearFilters = function ()
    {
        self.filters("");
    };

    self.addFilter = function(newFilter)
    {
        var result = self.filters().trim();
        if (self.filters().length > 0)
        {
            result += " ";
        }
        result += newFilter;
        self.filters(result);
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

        var testText = todo.text().toLowerCase();
        var filters = self.filters().split(/\s/);
        var result = true;
        if (self.filtered())
        {
            for (var i = 0; i < filters.length && result; i++)
            {
                result = testText.indexOf(filters[i].toLowerCase()) >= 0;
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

ko.bindingHandlers.todo = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var template = $(element);
        var viewer = template.find(".display");
        var trigger = template.find(".message");
        var editor = template.find(".edit");
        var input = template.find(".edit input");

        ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
        {
            // not currently required
        });

        var toggle = function(edit)
        {
            if (edit)
            {
                viewer.hide();
                editor.show();
            }
            else
            {
                viewer.show();
                editor.hide();
            }
        };

        // Clicking on the text
        trigger.click(function(event) {
            toggle(true);
            input.val(ko.utils.unwrapObservable(valueAccessor()).text());
            input.focus();
        });

        // Keys
        input.keyup(function (event)
        {
            // ENTER
            if (event.keyCode === 13)
            {
                toggle(false);
                ko.utils.unwrapObservable(valueAccessor()).text(input.val());
            }

            // ESC
            if (event.keyCode === 27)
            {
                toggle(false);
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, bindingContext)
    {
    }
};

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);

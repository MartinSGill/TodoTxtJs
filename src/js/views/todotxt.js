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

////////////////////////////////////////////////////////////////////////////
// Main View Model
////////////////////////////////////////////////////////////////////////////

function TodoTxtViewModel()
{
    var self = this;
    var todoManager = new TodoManager();

    /************************************************
     * Inner Constructors
     ***********************************************/
    self.version = ko.observable("0.9.6");
    self.title = ko.observable("TodoTxtJs");

    self.allTodos = ko.computed(function() { return todoManager.all(); } );

    self.priorities = ko.observableArray([]);
    self.projects = ko.computed(function()
    {
        var hash = {};
        for (var i = 0; i < self.allTodos().length; i++)
        {
            if (self.isDisplayed(self.allTodos()[i]))
            {
                var projects = self.allTodos()[i].projects();
                for (var j = 0; j < projects.length; j++)
                {
                    hash[projects[j]] = true;
                }
            }
        }

        var result = [];
        for(var name in hash)
        {
            if (hash.hasOwnProperty(name))
            {
                result.push(name);
            }
        }

        return result.sort();
    });

    self.contexts = ko.computed(function()
    {
        var hash = {};
        for (var i = 0; i < self.allTodos().length; i++)
        {
            if (self.isDisplayed(self.allTodos()[i]))
            {
                var contexts = self.allTodos()[i].contexts();
                for (var j = 0; j < contexts.length; j++)
                {
                    hash[contexts[j]] = true;
                }
            }
        }

        var result = [];
        for(var name in hash)
        {
            if (hash.hasOwnProperty(name))
            {
                result.push(name);
            }
        }

        return result.sort();
    });

    self.newPriorityFilter = ko.observable(undefined);

    self.showHelp = ko.observable(false);

    ////////////////////////////////////////////////////////////////////////////
    // Options
    ////////////////////////////////////////////////////////////////////////////

    function Options()
    {
        var self = this;

        ///////////////////////////
        // Options
        ///////////////////////////

        self.storageOptions = ko.observableArray([
            new BrowserStorageProvider(),
            new DropboxStorageProvider()
        ]
        );
        self.storageInfo = ko.observable(self.storageOptions()[0]);
        self.storage = ko.computed(function ()
        {
            return self.storageInfo().name;
        });

        self.addCreatedDate = ko.observable(false);
        self.addCreatedDateDescription = ko.observable("Automatically add a start date to new TODOs.");

        ///////////////////////////
        // Control
        ///////////////////////////
        self.showStorageControls = ko.computed(function ()
        {
            return self.storageInfo().controls.storage;
        });

        self.showImport = ko.computed(function ()
        {
            return self.storageInfo().controls.imports;
        });

        self.showExport = ko.computed(function ()
        {
            return self.storageInfo().controls.exports;
        });

        self.save = function ()
        {
            var oldOptions = {};
            if (window.localStorage.TodoTxtJsOptions)
            {
                oldOptions = JSON.parse(window.localStorage.TodoTxtJsOptions);
            }

            window.localStorage.TodoTxtJsOptions = ko.toJSON(self);
            if (oldOptions.storage !== self.storage())
            {
                todoTxtView.load();
            }
        };

        self.load = function ()
        {
            if (window.localStorage.TodoTxtJsOptions)
            {
                var options = JSON.parse(window.localStorage.TodoTxtJsOptions);
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

                if (options.hasOwnProperty(("addCreatedDate")))
                {
                    self.addCreatedDate(options.addCreatedDate);
                }
            }
        };
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
        self.$dropTarget = null;
        var entered = 0;

        function dragEnter(event)
        {
            entered++;
            event.preventDefault();
            self.$dropTarget.addClass("dragOver");
        }

        function dragLeave(event)
        {
            entered--;
            event.stopPropagation();
            if (entered === 0)
            {
                self.$dropTarget.removeClass("dragOver");
            }
        }

        function dragOver(event)
        {
            event.dataTransfer.dropEffect = "link";
            event.preventDefault();
        }

        function drop(event)
        {
            event.preventDefault();
            self.$dropTarget.removeClass("dropOver");

            var files = event.dataTransfer.files;

            if (files.length > 0)
            {
                var file = files[0];
                var reader = new FileReader();

                reader.onloadend = function (event)
                {
                    todoManager.removeAll();
                    var todos = event.target.result.match(/^(.+)$/mg);
                    todoManager.loadFromStringArray(todos);
                };

                reader.readAsText(file, 'UTF-8');
            }
        }

        $(document).ready(function() {
            // Get jQuery events to support dataTransfer props
            jQuery.event.props.push('dataTransfer');
            self.$dropTarget = $("#fileUpload");

            self.$dropTarget.on('dragenter', dragEnter);
            self.$dropTarget.on('dragover', dragOver);
            self.$dropTarget.on('dragleave', dragLeave);
            self.$dropTarget.on('drop', drop);

            var $dropTargetChild = self.$dropTarget.find("span");
            $dropTargetChild.on('dragenter', dragEnter);
            $dropTargetChild.on('dragover', dragOver);
            $dropTargetChild.on('dragleave', dragLeave);
            $dropTargetChild.on('drop', drop);
        });
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

        self.download = function()
        {
            var data = "data:text;charset=utf-8,";
            data += encodeURI(self.exportText());

            window.location.href = data;
        };
    }

    self.importing = new Importing(self);
    self.exporting = new Exporting(self);

    ////////////////////////////////////////////////////////////////////////////
    // Help
    ////////////////////////////////////////////////////////////////////////////

    self.onClick_ShowHelp = function (data, event)
    {
        self.showHelp(!self.showHelp());
    };

    ////////////////////////////////////////////////////////////////////////////
    // Filters
    ////////////////////////////////////////////////////////////////////////////

    self.filters = ko.observable("");
    self.showCompleted = ko.observable(false);
    self.showShortUrls = ko.observable(true);
    self.showCreatedDate = ko.observable(true);

    self.filtered = ko.computed(function ()
    {
        return self.filters() && self.filters().length > 0;
    });

    self.clearFilters = function ()
    {
        self.filters("");
    };

    self.addFilterFromElement = function(newFilter)
    {
        var filterText = $(newFilter).text();
        if (self.filters().indexOf(filterText.toLowerCase()) > -1)
        {
            return;
        }

        var result = self.filters().trim();
        if (self.filters().length > 0)
        {
            result += " ";
        }
        result += filterText;
        self.filters(result);
    };

    self.addFilter = function(newFilter)
    {
        if (self.filters().indexOf(newFilter.toLowerCase()) > -1)
        {
            return;
        }

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
        var todo = new Todo(self.newTodoText());
        if (self.options.addCreatedDate())
        {
            if (!todo.createdDate())
            {
                var date = new Date();
                todo.createdDate(toISO8601Date(date));
            }
        }

        TodoTxtJs.Events.onNew();
        todoManager.add(todo);
        self.newTodoText("");
    };

    self.spinner = ko.observable(false);

    self.save = function ()
    {
        highlightNotice();
        self.notice("Saving Todos to " + self.options.storage());
        self.spinner(true);

        function onSuccess()
        {
            self.lastUpdated("Last Saved: " + toISO8601DateTime(new Date()));
            self.notice("Last Saved: " + toISO8601DateTime(new Date()));
            self.spinner(false);
            setTimeout(normalNotice, 1000);
            TodoTxtJs.Events.onSaveComplete(self.options.storage());
        }

        function onError(error)
        {
            self.notice("Error: [" + error  +  "]");
            self.lastUpdated("Error: [" + error  +  "]");
            highlightNotice(true);
            setTimeout(normalNotice, 2000);
            self.spinner(false);
            TodoTxtJs.Events.onError("Error Saving (" + self.options.storage() + ") : [" + error + "]");
        }

        self.options.storageInfo().save(self.exporting.buildExportText(), onSuccess, onError);
    };

    self.load = function ()
    {
        highlightNotice();
        self.options.load();

        function onSuccess(data)
        {
            todoManager.loadFromStringArray(data);
            self.notice("Loaded " + toISO8601DateTime(new Date()));
            self.spinner(false);
            setTimeout(normalNotice, 1000);
            TodoTxtJs.Events.onLoadComplete(self.options.storage());
        }

        function onError(error)
        {
            self.notice("Loaded " + toISO8601DateTime(new Date()));
            highlightNotice(true);
            self.spinner(false);
            setTimeout(normalNotice, 2000);
            TodoTxtJs.Events.onError("Error Loading (" + self.options.storage() + ") : [" + error + "]");
        }
        if (typeof(Storage) !== "undefined")
        {
            todoManager.removeAll();
            self.spinner(true);
            self.notice("Loading Todos from " + self.options.storage());
            self.options.storageInfo().load(onSuccess, onError);
        }
    };

    $(window).unload(self.save);

    self.lastUpdated = ko.observable(undefined);
    self.notice = ko.observable(undefined);
    self.refresh = function ()
    {
        self.load();
    };

    self.pageReady = ko.observable(false);
    $(document).ready(function ()
    {
        self.pageReady(true);
    });

    self.removeTodo = function(element)
    {
        var index = parseInt($(element).parents(".todo").find(".todo-view-index").text(), 10);
        TodoTxtJs.Events.onRemove();
        todoManager.remove(index);
    };

    //////////////////////////////////////////////////////////
    // Effects
    //////////////////////////////////////////////////////////
    function highlightNotice(isError)
    {
        var notice = $("#notice");
        notice.addClass("notice-highlight");

        if (isError)
        {
            notice.addClass("notice-error");
        }
        else
        {
            notice.removeClass("notice-error");
        }
    }

    function normalNotice()
    {
        var notice = $("#notice");
        notice.find("#notice-text").effect("transfer", { to: $("#target") }, 1000);
        notice.removeClass("notice-highlight");
        self.lastUpdated(self.notice());
        self.notice("");
    }

    //////////////////////////////////////////////////////////
    // Keyboard shortcuts
    //////////////////////////////////////////////////////////

    $(document).bind('keydown', 'n', function(event)
    {
        event.preventDefault();
        $(".addTodo Input").focus();
    });

    $(document).bind('keydown', '?', function(event)
    {
        event.preventDefault();
        self.onClick_ShowHelp();
    });

    function newTodoAutoCompleteValues()
    {
        var result = [];
        var contexts = todoManager.allContexts();
        var projects = todoManager.allProjects();

        for (var i = 0; i < contexts.length; i++)
        {
            result.push("@" + contexts[i]);
        }

        for (var j = 0; j < projects.length; j++)
        {
            result.push("+" + projects[j]);
        }

        return result;
    }

    self.load();

    function split( val ) {
      return val.split( /\s+/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }

    $( "#newTodoInput" )
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).data( "ui-autocomplete" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 1,
        source: function( request, response ) {
          // delegate back to autocomplete, but extract the last term
          response( $.ui.autocomplete.filter(
            newTodoAutoCompleteValues(), extractLast( request.term ) ) );
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          self.newTodoText(terms.join( " " ));
          return false;
        }
      });

    $( "#filters" )
        // don't navigate away from the field on tab when selecting an item
        .bind( "keydown", function( event ) {
                   if ( event.keyCode === $.ui.keyCode.TAB &&
                       $( this ).data( "ui-autocomplete" ).menu.active ) {
                       event.preventDefault();
                   }
               })
        .autocomplete({
                          minLength: 1,
                          source: function( request, response ) {
                              // delegate back to autocomplete, but extract the last term
                              response( $.ui.autocomplete.filter(
                                  newTodoAutoCompleteValues(), extractLast( request.term ) ) );
                          },
                          focus: function() {
                              // prevent value inserted on focus
                              return false;
                          },
                          select: function( event, ui ) {
                              var terms = split( this.value );
                              // remove the current input
                              terms.pop();
                              // add the selected item
                              terms.push( ui.item.value );
                              // add placeholder to get the comma-and-space at the end
                              terms.push( "" );
                              self.filters(terms.join( " " ));
                              return false;
                          }
                      });
}

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);

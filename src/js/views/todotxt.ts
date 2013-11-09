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

/// <reference path="../defs/knockout.d.ts" />
/// <reference path="../defs/jquery.d.ts" />
/// <reference path="../defs/jqueryui.d.ts" />
/// <reference path="../defs/jquery.jgrowl.d.ts" />
/// <reference path="../utils/datetime.ts" />
/// <reference path="../utils/events.ts" />
/// <reference path="../model/todo.ts" />
/// <reference path="../model/todoHtmlRender.ts" />
/// <reference path="../model/todomanager.ts" />
/// <reference path="../views/options.ts" />
/// <reference path="../views/displayOptions.ts" />
/// <reference path="../views/importing.ts" />
/// <reference path="../views/exporting.ts" />

module TodoTxtJs.View
{
    export class Main
    {
        public version : KnockoutObservable<string>;
        public title : KnockoutComputed<string>;
        public allTodos: KnockoutComputed<Todo[]>;
        public priorities: KnockoutComputed<string[]>;
        public projects: KnockoutComputed<string[]>;
        public contexts: KnockoutComputed<string[]>;

        public newPriorityFilter: KnockoutObservable<string>;

        public displayOptions: DisplayOptions;
        public options: Options;
        public importing: Importing;
        public exporting: Exporting;

        public filters: KnockoutObservable<string>;
        public filtered: KnockoutComputed<boolean>;

        public renderOptions: KnockoutComputed<any>;

        public newTodoText: KnockoutObservable<string>;
        public spinner: KnockoutObservable<boolean>;
        public lastUpdated: KnockoutObservable<string>;
        public pageReady: KnockoutObservable<boolean>;

        private _title: KnockoutObservable<string>;
        private _todoManager: TodoManager;
        private static _queryStringParams: any;

        constructor()
        {
            this._todoManager = new TodoTxtJs.TodoManager();

            this._title = ko.observable<string>("TodoTxtJs");
            this.version = ko.observable<string>("1.4.4");
            this.allTodos = ko.computed({owner: this, read: this._getAllTodos});
            this.priorities = ko.computed({owner: this, read: this._getAllPriorities});
            this.projects = ko.computed({owner: this, read: this._getAllProjects});
            this.contexts = ko.computed({owner: this, read: this._getAllContexts});

            this.newPriorityFilter = ko.observable(undefined);

            this.displayOptions = new DisplayOptions(this._todoManager);
            this.options = new Options();
            this.renderOptions = ko.computed({ owner: this, read: this._getRenderOptions });

            this.importing = new Importing(this._todoManager);
            this.exporting = new Exporting(this._todoManager);

            this.filters = ko.observable<string>("");
            this.filters.subscribe((newValue: string) => { Main.setQueryString("filter", newValue); });
            this.filtered = ko.computed({ owner: this, read: this._getIsFiltered });
            this.title = ko.computed(
                {
                    owner: this,
                    read: ()=>
                    {
                        if (!this.filtered()) return this._title();
                        else return this._title() + " (filtered)";
                    }
                });

            this.newTodoText = ko.observable<string>("");

            this.lastUpdated = ko.observable<string>(undefined);
            this.pageReady = ko.observable<boolean>(false);
            $(document).ready(() => { this.pageReady(true); });

            this._initializeAutoComplete();
            this._initializeKeyboardShortCuts();
            this._initializeNotifications();

            $(window).unload(this.save);
            this.load();

            this._applyQueryString();
        }

        public removeTodo(element:HTMLElement) : void
        {
            var index = parseInt($(element).parents(".todo").find(".todo-view-index").text(), 10);
            TodoTxtJs.Events.onRemove();
            this._todoManager.remove(index);
            this.saveOnChange();
        }

        public formatDate(date:string):string
        {
            if (date)
            {
                var _date = new Date(date);
                return DateTime.dateToInformalString(_date);
            }
            else
            {
                return null;
            }
        }

        /**
         * Alias for load.
         */
        public refresh() : void
        {
            this.load();
        }

        public save = () : void =>
        {
            $.jGrowl("Saving to " + this.options.storage() + "...");

            var onSuccess = () =>
            {
                this.lastUpdated("Last Saved: " + DateTime.toISO8601DateTime(new Date()));
                $.jGrowl("Saved");
                TodoTxtJs.Events.onSaveComplete(this.options.storage());
            };

            var onError = (error) =>
            {
                $.jGrowl(error, { header: "Error Saving", sticky: true });
                this.lastUpdated("Error: [" + error  +  "]");
                TodoTxtJs.Events.onError("Error Saving (" + this.options.storage() + ") : [" + error + "]");
            };

            this.options.storageInfo().save(this.exporting.buildExportText(), onSuccess, onError);
            this.displayOptions.save();
        };

        public load() : void
        {
            if (Main.getQueryString("defaults"))
            {
                this.options.save();
                this.displayOptions.save();
            }
            else
            {
                this.options.load();
                this.displayOptions.load();
            }

            var onSuccess = (data): void =>
            {
                this._todoManager.removeAll();
                this._todoManager.loadFromStringArray(data);
                this.lastUpdated("Last Loaded: " + DateTime.toISO8601DateTime(new Date()));
                $.jGrowl("Loaded Sucessfully");
                TodoTxtJs.Events.onLoadComplete(this.options.storage());
            };

            var onError = (error): void =>
            {
                $.jGrowl(error, { header: "Error loading", sticky: true });
                TodoTxtJs.Events.onError("Error Loading (" + this.options.storage() + ") : [" + error + "]");
            };

            if (typeof(Storage) !== "undefined")
            {
                $.jGrowl("Loading from " + this.options.storage() + "...");
                this.options.storageInfo().load(onSuccess, onError);
            }
        }

        public addNewTodo(): void
        {
            var source = this.newTodoText();
            if (source == null || source.trim().length == 0)
            {
                return;
            }

            var todo = new TodoTxtJs.Todo(source);
            if (this.options.addCreatedDate())
            {
                if (!todo.createdDate())
                {
                    var date = new Date();
                    todo.createdDate(DateTime.toISO8601Date(date));
                }
            }

            TodoTxtJs.Events.onNew();
            this._todoManager.add(todo);
            this.newTodoText("");
            this.saveOnChange();
        }

        /**
         * Uses the save on change option to determine if
         * the current contents should be saved.
         */
        public saveOnChange() : void
        {
            console.log("saveOnChange");
            if (this.options.saveOnChange())
            {
                console.log("saveOnChange_saving");
                this.save();
            }
        }

        public onCompleteClick = (data, event) : boolean =>
        {
            this.saveOnChange();
            // Ensure event is processed by other handlers as well
            return true;
        };

        public clearFilters(): void
        {
            this.filters("");
        }

        /**
         * Adds a new filter term to the filters list, using the
         * text of the specified HTMLElement.
         * @param newFilter The HTMLElement that contains the new filter value.
         */
        public addFilterFromElement(newFilter: HTMLElement) : void
        {
            var filterText = $(newFilter).text();
            if (filterText.length == 1)
            {
                filterText = '(' + filterText + ')';
            }
            this.addFilter(filterText);
        }

        /**
         * Adds a new filter term to the filters list.
         * @param newFilter The text of the new filter.
         */
        public addFilter(newFilter : string) : void
        {
            if (this.filters().indexOf(newFilter.toLowerCase()) > -1)
            {
                return;
            }

            var result = this.filters().trim();
            if (this.filters().length > 0)
            {
                result += " ";
            }
            result += newFilter;
            this.filters(result);
        }

        /**
         * Method to manage the showing/hiding of menu item toolboxs.
         * @param element The item that was toggled by the user.
         */
        public toggleToolbox(element : HTMLElement) : void
        {
            var selected = false;
            var menuItem = $(element).parent();
            this.options.save();
            if (menuItem.hasClass("selected"))
            {

                if (menuItem[0].id === 'options')
                {
                    this.options.save();
                }
                selected = true;
            }
            else
            {
                if (menuItem[0].id === 'export')
                {
                    this.exporting.fillExportBox();
                }
            }

            $(".menuItem").removeClass("selected");
            $(".menuItem .toolbox").hide();

            if (!selected)
            {
                menuItem.addClass("selected");
                $(".toolbox", menuItem).show();
            }
        }

        /**
         * Determines if the given Todo object should be visible.
         * based on the current filter settings.
         * @param todo The todo object to inspect.
         * @returns true if the Todo should be visible.
         */
        public isDisplayed(todo: Todo): boolean
        {
            if (!this.displayOptions.showCompleted() && todo.completed())
            {
                return false;
            }

            var testText = todo.text();
            var testTextLower = todo.text().toLowerCase();
            var filters = this.filters().split(/\s/);
            var result = true;
            if (this.filtered())
            {
                for (var i = 0; i < filters.length && result; i++)
                {
                    // Special filters
                    var filter = filters[i];
                    switch (filter)
                    {
                        // No Context Defined
                        case "-@":
                            result = (todo.contexts().length == 0);
                            break;

                        // No Project Defined
                        case "-+":
                            result = (todo.projects().length == 0);
                            break;

                        // Normal Filtering
                        default:
                            // Deal with case-sensitive projects/contexts
                            if (filter.match(/[@+].+/))
                            {
                                if (this.options.caseSensitive())
                                {
                                    result = testText.indexOf(filter) >= 0;
                                }
                                else
                                {
                                    result = testTextLower.indexOf(filter.toLowerCase()) >= 0;
                                }
                            }
                            // Do all other filters as case insensitive
                            else
                            {
                                result = testTextLower.indexOf(filter.toLowerCase()) >= 0;
                            }
                    }
                }
            }

            return result;
        }

        public onClick_ShowHelp(data?: any, event?: Event): boolean
        {
            var width = Math.round(window.innerWidth * 0.8);
            var height = Math.round(window.innerHeight * 0.8);
            //this.showHelp(!this.showHelp());
            $("#help").dialog({
                modal: true,
                buttons: {
                    Ok: function () { $(this).dialog("close"); }
                },
                minHeight: 400,
                maxHeight: height,
                height: "auto",
                minWidth: 800,
                maxWidth: width,
                auto: "auto"
            });

            return false;
        }

        public onClick_ShowOptions(data?: any, event?: Event): boolean
        {
            var width = Math.round(window.innerWidth * 0.8);
            var height = Math.round(window.innerHeight * 0.8);
            var self = this;
            var oldStorage = this.options.storageInfo();
            $("#optionsDialog").dialog({
                modal: true,
                buttons: {
                    Done: function ()
                    {
                        self.options.save();
                        oldStorage = self.options.storageInfo();
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui)
                {
                    // Undo storage change
                    if (oldStorage.name != self.options.storageInfo().name)
                    {
                        self.options.storageInfo(oldStorage);
                    }
                },
                maxHeight: height,
                height: "auto",
                minWidth: 800,
                maxWidth: width,
                auto: "auto",
                closeOnEscape: true
            });

            return false;
        }

        /**
         * Splits a list of terms into individual terms.
         * @param val the list of terms.
         */
        private static _split(val:string ) : string[]
        {
            return val.split( /\s+/ );
        }

        /**
         * An array of all possible auto-complete values.
         */
        private _newTodoAutoCompleteValues() : string[]
        {
            var result = [];
            var contexts = this._todoManager.allContexts();
            var projects = this._todoManager.allProjects();

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

        private _getIsFiltered() : boolean
        {
            return (this.filters() && this.filters().length > 0);
        }

        private _getAllTodos(): Todo[]
        {
            return this._todoManager.all();
        }

        private _getAllPriorities(): string[]
        {
            var hash = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var priority = this.allTodos()[i].priority();
                    if (priority)
                    {
                        hash[priority] = true;
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
        }

        private _getAllProjects() : string[]
        {
            var hash = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var projects = this.allTodos()[i].projects();
                    var caseSensitive = this.options.caseSensitive();

                    for (var j = 0; j < projects.length; j++)
                    {
                        var project = projects[j];
                        if (!caseSensitive)
                        {
                            project = project.toLowerCase();
                        }
                        hash[project] = true;
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
        }

        private _getAllContexts() : string[]
        {
            var hash = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var contexts = this.allTodos()[i].contexts();
                    var caseSensitive = this.options.caseSensitive();

                    for (var j = 0; j < contexts.length; j++)
                    {
                        var context = contexts[j];
                        if (!caseSensitive)
                        {
                            context = context.toLowerCase();
                        }
                        hash[context] = true;
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
        }

        /**
         * Extracts the last term in a list of terms.
         * @param term the list of terms to process.
         * @returns the last term in the list.
         */
        private _extractLast(term:string) : string
        {
            return Main._split( term ).pop();
        }

        private _initializeKeyboardShortCuts()
        {
            var _this = this;
            $(document).bind('keydown', 'n', function(event)
            {
                event.preventDefault();
                $(".addTodo Input").focus();
            });

            function help(event)
            {
                event.preventDefault();
                if ($("#help").is(":visible"))
                {
                    $("#help").dialog("close");
                }
                else
                {
                    _this.onClick_ShowHelp();
                }
            }

            $(document).bind('keydown', 'shift+/', help);
        }

        /**
         * Get the options for rendering the HTML contents of the todo.
         * @returns an options object.
         */
        private _getRenderOptions(): any
        {
            var result = new ContentRenderOptions();
            result.shortUrls = this.displayOptions.showShortUrls();

            return result;
        }

        private static _parseQueryString()
        {
            if (!Main._queryStringParams)
            {
                var params = {},
                    e,
                    a = /\+/g,  // Regex for replacing addition symbol with a space
                    r = /([^&=]+)=?([^&]*)/g,
                    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                    q = window.location.search.substring(1);

                while (e = r.exec(q))
                {
                    var value: any = d(e[2]);
                    if (value === "")
                    {
                        value = true;
                    }
                    params[d(e[1])] = value;
                }

                Main._queryStringParams = params;
            }
        }

        private static _writeQueryString()
        {
            var queryString = "?";
            var location = window.location.href;
            location = location.replace(/([#?].*)/, "");
            for (name in Main._queryStringParams)
            {
                if (Main._queryStringParams.hasOwnProperty(name))
                {
                    var nameUri = encodeURIComponent(name);
                    var value = Main._queryStringParams[name]
                    if (value !== "")
                    {
                        var valueUri = encodeURIComponent(value);
                        queryString += nameUri + '=' + valueUri;
                    }
                }
            }

            var newLocation = location + queryString;

            if (history)
            {
                history.replaceState(null, null, newLocation);
            }
        }

        public static setQueryString(name: string, value:any)
        {
            Main._parseQueryString();
            Main._queryStringParams[name] = value;
            Main._writeQueryString();
        }

        public static getQueryString(name)
        {
            Main._parseQueryString();
            return Main._queryStringParams[name];
        }

        private _applyQueryString()
        {
            var filters = Main.getQueryString("filter");
            if (filters && filters !== "")
            {
                this.filters(filters);
            }
        }

        /**
         * Initializes the auto-complete functionality.
         */
        private _initializeAutoComplete() : void
        {
            var _self = this;
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
                                      response( (<any>$.ui.autocomplete).filter(
                                          _self._newTodoAutoCompleteValues(), _self._extractLast( request.term ) ) );
                                  },
                                  focus: function() {
                                      // prevent value inserted on focus
                                      return false;
                                  },
                                  select: function( event, ui ) {
                                      var terms = Main._split( this.value );
                                      // remove the current input
                                      terms.pop();
                                      // add the selected item
                                      terms.push( ui.item.value );
                                      // add placeholder to get the comma-and-space at the end
                                      terms.push( "" );
                                      _self.newTodoText(terms.join( " " ));
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
                                      response( (<any>$.ui.autocomplete).filter(
                                          _self._newTodoAutoCompleteValues(), _self._extractLast( request.term ) ) );
                                  },
                                  focus: function() {
                                      // prevent value inserted on focus
                                      return false;
                                  },
                                  select: function( event, ui ) {
                                      var terms = Main._split( this.value );
                                      // remove the current input
                                      terms.pop();
                                      // add the selected item
                                      terms.push( ui.item.value );
                                      // add placeholder to get the comma-and-space at the end
                                      terms.push( "" );
                                      _self.filters(terms.join( " " ));
                                      return false;
                                  }
                              });
        }

        private _initializeNotifications(): void
        {
            $.jGrowl.defaults.position = 'bottom-right';
        }
    }

}

var todoTxtView : TodoTxtJs.View.Main = new TodoTxtJs.View.Main();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);

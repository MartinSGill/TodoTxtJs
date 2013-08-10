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
/// <reference path="../utils/datetime.ts" />
/// <reference path="../utils/events.ts" />
/// <reference path="../model/todo.ts" />
/// <reference path="../model/todomanager.ts" />
/// <reference path="../views/options.ts" />
/// <reference path="../views/importing.ts" />
/// <reference path="../views/exporting.ts" />

module TodoTxtJs.View
{
    export class Main
    {
        public version : KnockoutObservable<string>;
        public title : KnockoutObservable<string>;
        public allTodos: KnockoutComputed<Todo[]>;
        public priorities: KnockoutObservableArray<string>;
        public projects: KnockoutComputed<string[]>;
        public contexts: KnockoutComputed<string[]>;

        public newPriorityFilter : KnockoutObservable<string>;
        public showHelp: KnockoutObservable<boolean>;

        public options: Options;
        public importing: Importing;
        public exporting: Exporting;

        public filters: KnockoutObservable<string>;
        public showCompleted: KnockoutObservable<boolean>;
        public showShortUrls: KnockoutObservable<boolean>;
        public showCreatedDate: KnockoutObservable<boolean>;
        public filtered: KnockoutComputed<boolean>;

        public renderOptions: KnockoutComputed<any>;

        public newTodoText: KnockoutObservable<string>;
        public spinner: KnockoutObservable<boolean>;
        public lastUpdated: KnockoutObservable<string>;
        public notice: KnockoutObservable<string>;
        public pageReady: KnockoutObservable<boolean>;

        private _todoManager: TodoManager;

        constructor()
        {
            this._todoManager = new TodoTxtJs.TodoManager();

            this.version = ko.observable<string>("1.0.0");
            this.title = ko.observable<string>("TodoTxtJs");
            this.allTodos = ko.computed({owner: this, read: this._getAllTodos});
            this.priorities = ko.observableArray([]);
            this.projects = ko.computed({owner: this, read: this._getAllProjects});
            this.contexts = ko.computed({owner: this, read: this._getAllContexts});

            this.newPriorityFilter = ko.observable(undefined);
            this.showHelp = ko.observable<boolean>(false);

            this.options = new Options();

            this.importing = new Importing(this._todoManager);
            this.exporting = new Exporting(this._todoManager);

            this.filters = ko.observable<string>("");
            this.showCompleted = ko.observable<boolean>(false);
            this.showShortUrls = ko.observable<boolean>(true);
            this.showCreatedDate = ko.observable<boolean>(true);
            this.filtered = ko.computed({owner: this, read: this._getIsFiltered });

            this.renderOptions = ko.computed({owner:this, read: this._getRenderOptions });

            this.newTodoText = ko.observable<string>("");
            this.spinner = ko.observable<boolean>(false);

            this.lastUpdated = ko.observable<string>(undefined);
            this.notice = ko.observable<string>(undefined);
            this.pageReady = ko.observable<boolean>(false);
            $(document).ready( ()=> { this.pageReady(true); });

            this._InitializeAutoComplete();
            this._InitializeKeyboardShortCuts();

            $(window).unload(this.save);
            this.load();
        }

        public removeTodo(element)
        {
            var index = parseInt($(element).parents(".todo").find(".todo-view-index").text(), 10);
            TodoTxtJs.Events.onRemove();
            this._todoManager.remove(index);
            this.saveOnChange();
        }

        public refresh() : void
        {
            this.load();
        }

        public save = () : void =>
        {
            Main._highlightNotice();
            this.notice("Saving Todos to " + this.options.storage());
            this.spinner(true);

            var onSuccess = ()=>
            {
                this.lastUpdated("Last Saved: " + DateTime.toISO8601DateTime(new Date()));
                this.notice("Last Saved: " + DateTime.toISO8601DateTime(new Date()));
                this.spinner(false);
                setTimeout(this._normalNotice, 1000);
                TodoTxtJs.Events.onSaveComplete(this.options.storage());
            };

            var onError = (error) =>
            {
                this.notice("Error: [" + error  +  "]");
                this.lastUpdated("Error: [" + error  +  "]");
                Main._highlightNotice(true);
                setTimeout(this._normalNotice, 2000);
                this.spinner(false);
                TodoTxtJs.Events.onError("Error Saving (" + this.options.storage() + ") : [" + error + "]");
            };

            this.options.storageInfo().save(this.exporting.buildExportText(), onSuccess, onError);
        };

        public load()
        {
            Main._highlightNotice();
            this.options.load();

            var onSuccess = (data) : void =>
            {
                this._todoManager.loadFromStringArray(data);
                this.notice("Loaded " + DateTime.toISO8601DateTime(new Date()));
                this.spinner(false);
                setTimeout(this._normalNotice, 1000);
                TodoTxtJs.Events.onLoadComplete(this.options.storage());
            };

            var onError = (error) : void =>
            {
                this.notice("Loaded " + DateTime.toISO8601DateTime(new Date()));
                Main._highlightNotice(true);
                this.spinner(false);
                setTimeout(()=> this._normalNotice, 2000);
                TodoTxtJs.Events.onError("Error Loading (" + this.options.storage() + ") : [" + error + "]");
            };

            if (typeof(Storage) !== "undefined")
            {
                this._todoManager.removeAll();
                this.spinner(true);
                this.notice("Loading Todos from " + this.options.storage());
                this.options.storageInfo().load(onSuccess, onError);
            }
        }

        public addNewTodo()
        {
            var todo = new TodoTxtJs.Todo(this.newTodoText());
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

        public saveOnChange()
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

        private newTodoAutoCompleteValues() : string[]
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
            return this.filters() && this.filters().length > 0;
        }

        public clearFilters() : void
        {
            this.filters("");
        }

        public addFilterFromElement(newFilter)
        {
            var filterText = $(newFilter).text();
            if (this.filters().indexOf(filterText.toLowerCase()) > -1)
            {
                return;
            }

            var result = this.filters().trim();
            if (this.filters().length > 0)
            {
                result += " ";
            }
            result += filterText;
            this.filters(result);
        }

        public addFilter(newFilter : string)
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

        ////////////////////////////////////////////////////////////////////////////
        // Options
        ////////////////////////////////////////////////////////////////////////////

        public toggleToolbox(element) : void
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

        public isDisplayed(todo : Todo)
        {
            if (!this.showCompleted() && todo.completed())
            {
                return false;
            }

            var testText = todo.text().toLowerCase();
            var filters = this.filters().split(/\s/);
            var result = true;
            if (this.filtered())
            {
                for (var i = 0; i < filters.length && result; i++)
                {
                    result = testText.indexOf(filters[i].toLowerCase()) >= 0;
                }
            }

            return result;
        }

        public onClick_ShowHelp(data?, event?)
        {
            this.showHelp(!this.showHelp());
        }

        private static _highlightNotice(isError? : boolean) : void
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

        private _normalNotice = () : void =>
        {
            var notice = $("#notice");
            notice.find("#notice-text").effect("transfer", { to: $("#target") }, 1000);
            notice.removeClass("notice-highlight");
            this.lastUpdated(this.notice());
            this.notice("");
        };

        private _getAllTodos() : Todo[]
        {
            return this._todoManager.all();
        }

        private _getAllProjects() : string[]
        {
            var hash = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var projects = this.allTodos()[i].projects();
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
        }

        private _getAllContexts() : string[]
        {
            var hash = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var contexts = this.allTodos()[i].contexts();
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
        }

        private static _split(val:string ) : string[]
        {
            return val.split( /\s+/ );
        }

        private _extractLast(term:string) : string
        {
            return Main._split( term ).pop();
        }

        private _InitializeKeyboardShortCuts()
        {
            $(document).bind('keydown', 'n', function(event)
            {
                event.preventDefault();
                $(".addTodo Input").focus();
            });

            $(document).bind('keydown', '?', function(event)
            {
                event.preventDefault();
                this.onClick_ShowHelp();
            });
        }

        private _getRenderOptions() : any
        {
            return { shortUrls : this.showShortUrls() };
        }

        private _InitializeAutoComplete() : void
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
                                          _self.newTodoAutoCompleteValues(), _self._extractLast( request.term ) ) );
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
                                          _self.newTodoAutoCompleteValues(), _self._extractLast( request.term ) ) );
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
    }
}

var todoTxtView : TodoTxtJs.View.Main = new TodoTxtJs.View.Main();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);

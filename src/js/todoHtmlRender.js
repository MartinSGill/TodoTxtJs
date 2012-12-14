
function todoHtmlContentsRenderer(todo)
{
    "use strict";

    todo = ko.utils.unwrapObservable(todo);

    if (todo instanceof Todo)
    {
        return toHtml(todo);
    }
    else
    {
        throw "Not a todo!";
    }

    function toHtml(todo)
    {
        var formattedMessage = todo.contents;

        if (formattedMessage)
        {
            var contextRegex = /\s(@)(\w+)(?=\W|$)/g;
            formattedMessage = formattedMessage.replace(contextRegex,
                                                        '<span class="contextFlag" onclick="todoTxtView.addFilterContext(\'$2\')">$1</span><span class="context" onclick="todoTxtView.addFilterContext(\'$2\')">$2</span>');

            var projectRegex = /\s(\+)(\w+)(?=\W|$)/g;
            formattedMessage = formattedMessage.replace(projectRegex,
                                                        '<span class="projectFlag" onclick="todoTxtView.addFilterProject(\'$2\')">$1</span><span class="project" onclick="todoTxtView.addFilterProject(\'$2\')">$2</span>');
        }

        return formattedMessage;
    }
}

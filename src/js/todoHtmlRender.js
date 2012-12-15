
function todoHtmlContentsRenderer(contents)
{
    "use strict";

    contents = ko.utils.unwrapObservable(contents);

    if (contents instanceof Todo)
    {
        return toHtml(contents.contents());
    }

    if (typeof(contents) !== "string")
    {
        throw "Contents should be a string";
    }

    return toHtml(contents);

    function toHtml(contents)
    {
        var formattedMessage = contents;

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

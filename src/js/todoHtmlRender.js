
function todoHtmlContentsRenderer(contents)
{
    "use strict";

    contents = ko.utils.unwrapObservable(contents);

    if (!contents)
    {
        return undefined;
    }

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
            // TODO: Need to find a better way of doing this.
            var contextRegex = /(?:\s|^)(@)(\w+)(?=\W|$)/g;
            formattedMessage = formattedMessage.replace(contextRegex,
                                                        '<span class="contextFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$1</span><span class="context" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$2</span>');

            var projectRegex = /(?:\s|^)(\+)(\w+)(?=\W|$)/g;
            formattedMessage = formattedMessage.replace(projectRegex,
                                                        '<span class="projectFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$1</span><span class="project" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$2</span>');

            var urlRegex = /(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig;
            formattedMessage = formattedMessage.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        }

        return formattedMessage;
    }
}

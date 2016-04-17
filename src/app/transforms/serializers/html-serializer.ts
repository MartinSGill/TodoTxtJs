/*******************************************************************************
 * Copyright (C) 2013-2015 Martin Gill
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

import {Serializer} from './serializer'
import {GenericMetadata} from '../../models/metadata/generic-metadata'
import {Token, TokenType} from '../../models/token'

interface metaDataRenderer {
    (item:GenericMetadata):
        string;
}

export class HtmlSerializer implements Serializer {

    constructor() {
        this.registerMetadataRenderer('http', this.urlRenderer);
        this.registerMetadataRenderer('ftp', this.urlRenderer);
        this.registerMetadataRenderer('https', this.urlRenderer);
    }

    private customMetadataRenderers:{ [id:string]:metaDataRenderer } = {};

    /**
     * Allows registration of custom metadata renderers.
     * Use this to override rendering for a specific metadata id,
     * e.g. URLs.
     * @param id metadata Id. e.g. "id" from "id:value"
     * @param callback The function that renders the metadata content.
     */
    private registerMetadataRenderer(id:string, callback:metaDataRenderer) {
        this.customMetadataRenderers[id] = callback;
    }

    public serialize(tokens:Token[]):string {
        var result = "<span class='todo";
        if (tokens[0].type == TokenType.completed) {
            result += ' completed';
        }
        result += "'>";

        tokens.forEach((item) => {
            switch (item.type) {
                case TokenType.completed:
                    result += "<span class='completeDate'>";
                    result += item.text;
                    result += "</span>";
                    break;
                case TokenType.createDate:
                    result += "<span class='createDate'>";
                    result += item.text;
                    result += "</span>";
                    break;
                case TokenType.priority:
                    result += "<span class='priorityBraceLeft'>(</span>";
                    result += "<span class='priority'>" + item.text + "</span>";
                    result += "<span class='priorityBraceRight'>)</span>";
                    break;
                case TokenType.project:
                    result += "<span class='projectSymbol'>+</span>";
                    result += "<span class='project'>";
                    result += item.text;
                    result += "</span>";
                    break;
                case TokenType.context:
                    result += "<span class='contextSymbol'>@</span>";
                    result += "<span class='context'>";
                    result += item.text;
                    result += "</span>";
                    break;
                case TokenType.metadata:
                    result += "<span class='metadata meta-" + item.id + "'>";
                    if (this.customMetadataRenderers.hasOwnProperty(item.id)) {
                        result += this.customMetadataRenderers[item.id](item);
                    }
                    else {
                        result += "<span class='meta-key'>" + item.id + "</span>";
                        result += "<span class='meta-value'>" + item.text + "</span>";
                    }
                    result += "</span>";
                    break;
                case TokenType.text:
                default:
                    result += item.text;
            }
        });

        result += "</span>";
        return result.trim();
    }

    private urlRenderer(item:GenericMetadata):string {
        var url = item.id + ":" + item.text;
        return "<a href='" + url + "'>"
            + url
            + "</a>";
    }

}

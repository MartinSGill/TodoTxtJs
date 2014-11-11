/*******************************************************************************
 * Copyright (C) 2013-2014 Martin Gill
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

module TodoTxtJs.Regex
{
    export var MetaData = /(?:\W|^)([A-Za-z0-9_]*):([^\s:]*(?=\s|$))/g;

    export var DueDate = /(due):(((?:19|20)[0-9]{2})-((?:0[1-9]|1[012]))-((?:0[1-9]|[12][0-9]|3[01])))/ig;

    export var Context = /(?:\W|^)(@)([\S_]+[A-Za-z0-9_](?!\S))/ig;

    export var Project = /(?:\W|^)(\+)([\S_]+[A-Za-z0-9_](?!\S))/ig;

    export var Url = /(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig;
}


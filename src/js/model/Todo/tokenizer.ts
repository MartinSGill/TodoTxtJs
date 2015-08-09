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

/// <reference path="token.ts" />

namespace TodoTxtJs.TodoItems
{
    export namespace Tokenizer
    {
        class TokenizeResult
        {
            tokenList: Token[] = [];
            remainingText: string = '';
        }

        export function tokenize(text:string): Token[]
        {
            if (text === '') return [];

            var result = new TokenizeResult();
            result.remainingText = text;

            findCompleted(result);
            findCreated(result);
            findPriority(result);

            var foundToken = findNextToken(result);
            while (foundToken) { foundToken = findNextToken(result); }


            result.tokenList.push(new Token(TokenType.text, result.remainingText.trim()));
            return result.tokenList;
        }

        function findCompleted(result: TokenizeResult)
        {
            const REGEX_COMPLETED = /^x (((?:19|20)[0-9]{2})-((?:0[1-9]|1[012]))-((?:0[1-9]|[12][0-9]|3[01])))(?=\s+\S+)/;
            var matches = result.remainingText.match(REGEX_COMPLETED);
            if (matches)
            {
                result.tokenList.push(new Token(TokenType.completed, matches[1]));
                result.remainingText = result.remainingText.substr(matches[0].length).trim();
            }
        }

        function findCreated(result: TokenizeResult)
        {
            const REGEX_DATE = /^(((?:19|20)[0-9]{2})-((?:0[1-9]|1[012]))-((?:0[1-9]|[12][0-9]|3[01])))(?=\s+\S+)/;
            var matches = result.remainingText.match(REGEX_DATE);
            if (matches)
            {
                result.tokenList.push(new Token(TokenType.createDate, matches[1]));
                result.remainingText = result.remainingText.substr(matches[0].length).trim();
            }
        }

        function findPriority(result: TokenizeResult)
        {
            const REGEX_PRIORITY = /^\(([A-Z])\)(?=\s+\S+)/;
            var matches = result.remainingText.match(REGEX_PRIORITY);
            if (matches)
            {
                result.tokenList.push(new Token(TokenType.priority, matches[1]));
                result.remainingText = result.remainingText.substr(matches[0].length).trim();
            }
        }

        function findNextToken(result: TokenizeResult): boolean
        {
            return false;
        }
    }
}
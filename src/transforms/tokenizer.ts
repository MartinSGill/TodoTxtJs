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

/// <reference path="../models/token.ts" />

namespace TodoTxtJs.TodoItems
{
    export namespace Tokenizer
    {
        class TokenizeResult
        {
            tokenList:Token[] = [];
            remainingText:string = '';
        }

        export function tokenize(text:string):Token[]
        {
            if (text === '')
            {
                return [];
            }

            var result = new TokenizeResult();
            result.remainingText = text;

            findCompleted(result);
            findCreated(result);
            findPriority(result);

            findRemainingTokens(result);

            return result.tokenList;
        }

        function findCompleted(result:TokenizeResult)
        {
            const REGEX_COMPLETED = /^x (((?:19|20)[0-9]{2})-((?:0[1-9]|1[012]))-((?:0[1-9]|[12][0-9]|3[01])))(?=\s+\S+)/;
            var matches = result.remainingText.match(REGEX_COMPLETED);
            if (matches)
            {
                result.tokenList.push(new Token(TokenType.completed, matches[1]));
                result.remainingText = result.remainingText.substr(matches[0].length).trim();
            }
        }

        function findCreated(result:TokenizeResult)
        {
            const REGEX_DATE = /^(((?:19|20)[0-9]{2})-((?:0[1-9]|1[012]))-((?:0[1-9]|[12][0-9]|3[01])))(?=\s+\S+)/;
            var matches = result.remainingText.match(REGEX_DATE);
            if (matches)
            {
                result.tokenList.push(new Token(TokenType.createDate, matches[1]));
                result.remainingText = result.remainingText.substr(matches[0].length).trim();
            }
        }

        function findPriority(result:TokenizeResult)
        {
            const REGEX_PRIORITY = /^\(([A-Z])\)(?=\s+\S+)/;
            var matches = result.remainingText.match(REGEX_PRIORITY);
            if (matches)
            {
                result.tokenList.push(new Token(TokenType.priority, matches[1]));
                result.remainingText = result.remainingText.substr(matches[0].length).trim();
            }
        }

        function findToken(remainingText:string)
        {
            const TOKEN_PATTERNS = [
                {type: TokenType.project, regex: /^\+([^\s]+)/},
                {type: TokenType.context, regex: /^@([^\s]+)/},
                {type: TokenType.metadata, regex: /^([A-Za-z0-9_]*):([^\s:]+)(?=(\s|$))/}
            ];

            for (var i = 0; i < TOKEN_PATTERNS.length; i++)
            {
                var pattern = TOKEN_PATTERNS[i];
                var matches = remainingText.match(pattern.regex);
                if (matches)
                {
                    switch (pattern.type)
                    {
                        case TokenType.metadata:
                            return {token: new Token(pattern.type, matches[2], matches[1]), length: matches[0].length};
                        default:
                            return {token: new Token(pattern.type, matches[1]), length: matches[0].length};
                    }
                }
            }
        }

        function findRemainingTokens(result:TokenizeResult)
        {
            var text = '';
            var remainingText = result.remainingText;
            do
            {
                var foundToken = findToken(remainingText);
                if (foundToken)
                {
                    if (text.trim().length > 0)
                    {
                        result.tokenList.push(new Token(TokenType.text, text.trim()));
                        text = '';
                    }

                    result.tokenList.push(foundToken.token);
                    remainingText = remainingText.substr(foundToken.length).trim();
                }
                else
                {
                    text += remainingText.substring(0, 1);
                    remainingText = remainingText.substring(1);
                }
            } while (remainingText.length > 0);

            if (text.trim().length > 0)
            {
                result.tokenList.push(new Token(TokenType.text, text.trim()));
            }

            result.remainingText = remainingText;
        }
    }
}
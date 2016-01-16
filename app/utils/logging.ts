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

namespace TodoTxt
{
    class Logging
    {
        public static info(text: string, className?:string)
        {
            if (className) text = "["+ className + "]" + text;
            if (typeof console !== 'undefined')
            {
                console.info(text);
            }
        }

        public static debug(text: string, className?:string)
        {
            if (className) text = "["+ className + "]" + text;
            if (typeof console !== 'undefined')
            {
                if (console.debug)
                {
                    console.log(text);
                }
                else
                {
                    console.info("DEBUG:" + text);
                }
            }
        }

        public static warn(text: string, className?:string)
        {
            if (className) text = "["+ className + "]" + text;
            if (typeof console !== 'undefined')
            {
                console.warn(text);
            }
        }

        public static error(text: string, className?:string)
        {
            if (className) text = "["+ className + "]" + text;
            if (typeof console !== 'undefined')
            {
                console.error(text);
            }
        }
    }

    export var log = Logging;
}
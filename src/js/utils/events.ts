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

module TodoTxtJs
{
    export class Events
    {
        constructor() { throw new Error("Static class, cannot 'new'."); }

        private static subscribers = {};

        /**
         * Subscribe to events.
         * @param eventName Name of the event to subscribe to.
         * @param callback Callback to invoke when event fires.
         */
        public static subscribe(eventName:string, callback : () => void) : void
        {
            if (!Events.subscribers.hasOwnProperty(eventName))
            {
                Events.subscribers[eventName] = [];
            }
            Events.subscribers[eventName].push(callback);
        }

        private static publishSimpleEvent(name: string, value?: any) : void
        {
            if (Events.subscribers.hasOwnProperty(name))
            {
                var subs = Events.subscribers[name];
                for (var i:number = 0, length = subs.length; i < length; i++)
                {
                    subs[i](value);
                }
            }
        }

        public static onError(error : string) : void
        {
            if (Events.subscribers.hasOwnProperty(name))
            {
                var subs = Events.subscribers[name];
                for (var i:number = 0, length = subs.length; i < length; i++)
                {
                    subs[i](error);
                }
            }
        }

        /**
         * Call when a Todo is marked as complete.
         */
        public static onComplete() : void
        {
            Events.publishSimpleEvent("onComplete");
        }

        /**
         * Call when a Todo is created.
         */
        public static onNew() : void
        {
            Events.publishSimpleEvent("onNew");
        }

        /**
         * Call when a Todo is removed.
         */
        public static onRemove() : void
        {
            Events.publishSimpleEvent("onRemove");
        }

        /**
         * Call when a Load operation completes.
         */
        public static onLoadComplete(type: string) : void
        {
            Events.publishSimpleEvent("onLoadComplete", type);
        }

        /**
         * Call when a save operation completes.
         */
        public static onSaveComplete(type: string) : void
        {
            Events.publishSimpleEvent("onSaveComplete", type)
        }
    }
}

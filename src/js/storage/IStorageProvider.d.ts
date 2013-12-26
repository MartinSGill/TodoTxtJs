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

declare module TodoTxtJs.StorageProviders
{
    export interface IStorageProviderControls
    {
        storage: boolean;
        exports: boolean;
        imports: boolean;
    }

    export interface IStorageProvider
    {
        /**
         * Display name of this provider.
         */
        name : string;

        /**
         * Description of this provider for use in help text.
         */
        description: string;

        /**
         * The controls that should be enabled for this provider.
         */
        controls: IStorageProviderControls;

        /**
         * Load Todos from the provider.
         * @param onSuccess Callback on successful load. Contains the loaded todos.
         * @param onError Callback on failed load.
         */
        load(onSuccess? : (object) => void, onError?: (string) => void) : void;

        /**
         * Saves Todos to the provider.
         * @param data The Todo data to save.
         * @param onSuccess Callback on successful load. Contains the loaded todos.
         * @param onError Callback on failed save.
         */
        save(data : Object, onSuccess? : () => void, onError?: (string) => void) : void;
    }
}

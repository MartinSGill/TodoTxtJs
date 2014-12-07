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

declare module Dropbox
{
    module File
    {
        class Stat
        {
            public path: string;
            public name: string;
            public inAppFolder: boolean;
            public isFolder: boolean;
            public isFile: boolean;
            public isRemoved: boolean;
            public typeIcon: string;
            public versionTag: string;
            public contentHash: string;
            public mimeType: string;
            public size: number;
            public humanSize: string;
            public hasThumbnail: boolean;
            public modifiedAt: Date;
            public clientModifiedAt: Date;

            public static parse(metadata: Object): Stat;
            public json(): Object;
        }
    }

    module Http
    {
        class RangeInfo
        {
            public start: number;
            public size: number;
            public end: number;

            public static parse(headerValue: string): RangeInfo;
        }
    }

    interface ClientOptions
    {
        key: string;
        secret?: string;
        token?: string;
        uid?: string;
    }

    interface ClientAuthenticateOptions
    {
        interactive?: boolean;
    }

    interface ClientReadFileOptions
    {
        versionTag?: string;
        rev?: string;
        arrayBuffer?: boolean;
        blob?: boolean;
        buffer?: boolean;
        length?: number;
        start?: number;
        httpCache?: boolean;
    }

    interface ClientWriteFileOptions
    {
        lastVersionTag?: string;
        parentRev?: string;
        noOverwrite?: boolean;
    }

    class ApiError
    {
        constructor(xhr: XMLHttpRequest, method: string, url: string);

        public status: number;
        public method: string;
        public url: string;
        public responseText: string;
        public response: Object;

        public static NETWORK_ERROR: number;
        public static NO_CONTENT: number;
        public static INVALID_PARAM: number;
        public static INVALID_TOKEN: number;
        public static OAUTH_ERROR: number;
        public static NOT_FOUND: number;
        public static INVALID_METHOD: number;
        public static NOT_ACCEPTABLE: number;
        public static CONFLICT: number;
        public static RATE_LIMITED: number;
        public static SERVER_ERROR: number;
        public static OVER_QUOTA: number;
    }

    class Client
    {
        constructor(options: ClientOptions);

        public authDriver(driver: any): Client;
        public authenticate(callback: (error: ApiError, client: Client) => void): Client;
        public authenticate(options: ClientAuthenticateOptions, callback: (error: ApiError, client: Client) => void): Client;
        public isAuthenticated(): boolean;

        /** Options for signOut don't seem to work. not sure why not, as it's in the API docs **/
        public signOut(callback?: (error: ApiError) => void): XMLHttpRequest;

        public readFile(path: string, options: ClientReadFileOptions, callback: (error: ApiError, contents: string, metadata: File.Stat, rangeInfo: Http.RangeInfo) => void): XMLHttpRequest;
        public writeFile(path: string, data: any, options: ClientWriteFileOptions, callback: (error: ApiError, metadata: File.Stat) => void): XMLHttpRequest;

        public static ERROR: number;
        public static RESET: number;
        public static PARAM_SET: number;
        public static PARAM_LOADED: number;
        public static AUTHORIZED: number;
        public static DONE: number;
        public static SIGNED_OUT: number;
    }

    module Drivers
    {
        interface BrowserBaseOptions
        {
            scope?: string;
            rememberUser?: boolean;
        }

        class BrowserBase
        {
            constructor(options?: BrowserBaseOptions);

            authType(): void;
            onAuthStepChange(client: Client, callback: Function): void;
            locationStateParam(url: string): string;
        }

        interface RedirectOptions extends BrowserBaseOptions
        {
            redirectUrl?: string;
            redirectFile?: string;
        }

        class Redirect extends BrowserBase
        {
            constructor(options?: RedirectOptions);

            url(): string;
            doAuthorize(authUrl: string, stateParam: string, client: Client): void;
            resumeAuthorize(stateParam: string, client: Client, callback: Function): void;
        }
    }
}

declare var dropbox_key: string;


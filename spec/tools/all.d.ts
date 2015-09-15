
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />

declare function all<T>(description:string, dataset:T[], fn: (item:T) => void):void;
declare function xall<T>(description:string, dataset:T[], fn: (item:T) => void):void;
declare function using<T>(description:string, dataset:T[], fn: (item:T) => void):void;
declare function xusing<T>(description:string, dataset:T[], fn: (item:T) => void):void;
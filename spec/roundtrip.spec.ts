//import {
//  it,describe,expect,inject
//} from 'angular2/testing';
//import {Tokenizer} from '../transforms/tokenizer';
//import {Token, TokenType} from './token';
//import {StringSerializer} from '../transforms/serializers/serializer'
//
//describe('Models', () => {
//  describe('Round Trips', () => {
//    describe('String -> String', () => {
//      all('basic round trips succeed', [
//        'These are test cases for almost all features. Including some that have proved troublesome.',
//        '(A) Priority A',
//        '(B) Priority B',
//        '(C) Priority C',
//        '(D) Priority D',
//        '(E) Priority E',
//        '(F) Priority Other',
//        'A simple todotxt file for testing TodoTxtJs features',
//        'A todo with @context',
//        'A todo with +project',
//        'A todo with different case @Context',
//        'A todo with different case +Project',
//        '(A) Priority A due:today',
//        '(B) Priority B due:today',
//        '(C) Priority C due:today',
//        '2013-01-01 Todo with create date',
//        'Todo with due date: due:2013-01-01',
//        'Todo due Tomorrow: due:tomorrow',
//        'Todo due Today: due:today',
//        'Single character meta-data a:b as an example',
//        'Todo due Yesterday: due:yesterday',
//        'Todo due Monday: due:monday',
//        'Todo due Sunday: due:wed',
//        'Todo with metadata meta:data key:value',
//        'Todo with funky metadata v:1.2.3',
//        'Todo URL http://example.com/hello/there/world',
//        '2013-01-01 A todo with @every-thing +kitchen-sink http://example.com/hello/there/world due:2013-01-01',
//        'x 2013-01-01 2013-01-01 A todo with @every-thing +kitchen-sink http://example.com/hello/there/world due:2013-01-01',
//        'x 2013-01-01 (E) Completed todo',
//        't�m� on todo @kyn�ll�',
//        't�m� on toinen todo +p�iv�ll�',
//        't�m� on kolmas todo @y�ll�'
//      ], function (value) {
//        var tokens = Tokenizer.tokenize(value);
//        var actual = new StringSerializer().serialize(tokens);
//        expect(actual).toBe(value);
//      });
//    });
//  });
//});
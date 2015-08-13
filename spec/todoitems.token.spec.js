/**
 * Created by martin on 08/08/2015.
 */

describe('TodoItems.Token', function(){
    describe('Construction', function(){
        it('defaults to token type', function(){
            target = new TodoTxtJs.TodoItems.Token();
            expect(target.type).toBe(TodoTxtJs.TodoItems.TokenType.text);
        });

        it('defaults to text empty string', function(){
            target = new TodoTxtJs.TodoItems.Token();
            expect(target.text).toBe('');
        });

        it('correctly sets token type', function(){
            target = new TodoTxtJs.TodoItems.Token(TodoTxtJs.TodoItems.TokenType.completed);
            expect(target.type).toBe(TodoTxtJs.TodoItems.TokenType.completed);
        });

        it('correctly sets token type', function(){
            target = new TodoTxtJs.TodoItems.Token(TodoTxtJs.TodoItems.TokenType.completed, 'bob');
            expect(target.text).toBe('bob');
        });

        it('defaults subType to empty string', function(){
            target = new TodoTxtJs.TodoItems.Token();
            expect(target.subType).toBe('');
        });

        it('correctly sets token subType', function(){
            target = new TodoTxtJs.TodoItems.Token(TodoTxtJs.TodoItems.TokenType.metadata, 'bob', 'sub');
            expect(target.subType).toBe('sub');
        });
    });
});
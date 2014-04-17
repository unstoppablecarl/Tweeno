// 'use strict';
var assert = require("assert"),
    Tween = require('../src/tween.js'),
    Queue = require('../src/queue.js');

global.window = {};
describe('Queue', function() {
    describe('constructor()', function() {
        it('tweens array', function() {
            var queue = new Queue();
            assert(queue.tweens instanceof Array);
        });

        it('settings', function() {
            var tweens = [{}, {}, {}],
                queue = new Queue(tweens);

            assert.deepEqual(queue.tweens, tweens);
        });

        it("window.performance", function() {
            var obj = {
                    x: 1
                },
                settings = {
                    to: {x: 2},
                    duration: 1000,
                },
                queue = new Queue(),
                tween = new Tween(obj, settings);

            queue.window = {
                performance: {
                    now: function(){
                        return 0;
                    }
                }
            };

            queue.add(tween);
            tween.start(0);
            queue.update();
            queue.update(500);
            assert.deepEqual(obj.x, 1.5);

            queue.update(1000);
            assert.deepEqual(obj.x, 2);

            global.window = {};
        });

    });

    describe('add()', function() {
        it('adds tween and returns this', function(){
            var queue = new Queue(),
                tween1 = new Tween({}),
                tween2 = new Tween({}),
                tween3 = new Tween({}),
                ret;

            ret = queue.add(tween1);
            assert.deepEqual(ret, queue);
            assert.deepEqual(queue.tweens.length, 1);
            assert.notEqual(queue.tweens.indexOf(tween1), -1);


            ret = queue.add(tween2);
            assert.deepEqual(ret, queue);
            assert.deepEqual(queue.tweens.length, 2);
            assert.notEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);

            ret = queue.add(tween3);
            assert.deepEqual(ret, queue);
            assert.deepEqual(queue.tweens.length, 3);
            assert.notEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);
            assert.notEqual(queue.tweens.indexOf(tween3), -1);
        });
    });

    describe('remove()', function() {
        it('adds tween and returns this', function() {
            var queue = new Queue(),
                tween1 = new Tween({}),
                tween2 = new Tween({}),
                tween3 = new Tween({}),
                ret;

            queue.add(tween1);
            queue.add(tween2);
            queue.add(tween3);

            ret = queue.remove({});
            assert.deepEqual(ret, queue);
            assert.deepEqual(queue.tweens.length, 3);

            ret = queue.remove(tween1);
            assert.deepEqual(ret, queue);
            assert.deepEqual(queue.tweens.length, 2);
            assert.deepEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);
            assert.notEqual(queue.tweens.indexOf(tween3), -1);

            tween2.remove = true;
            queue.update();
            assert.deepEqual(queue.tweens.length, 1);
            assert.deepEqual(queue.tweens.indexOf(tween1), -1);
            assert.deepEqual(queue.tweens.indexOf(tween2), -1);
            assert.notEqual(queue.tweens.indexOf(tween3), -1);
        });
    });

    describe('update()', function() {
        it("returns true when there are active tweens", function() {
            var queue = new Queue(),
                tween = new Tween({});

            queue.add(tween);
            queue.start();
            assert.deepEqual(queue.update(), true);
        });

        it("returns false when there are no active tweens", function() {
            var queue = new Queue(),
                tween = new Tween({});

            assert.deepEqual(queue.update(), false);

            queue.add(tween);
            assert.deepEqual(queue.update(), true);
        });

        it("removes tweens when they are finished", function() {
            var queue = new Queue(),
                tween1 = new Tween({}, {
                    duration: 1000
                }),
                tween2 = new Tween({}, {
                    duration: 2000
                });

            queue.add(tween1);
            queue.add(tween2);

            tween1.start(0);
            tween2.start(0);

            assert.deepEqual(queue.tweens.length, 2);
            assert.notEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);

            queue.update(0);
            assert.deepEqual(queue.tweens.length, 2);
            assert.notEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);

            queue.update(999);
            assert.deepEqual(queue.tweens.length, 2);
            assert.notEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);

            queue.update(1000);
            assert.deepEqual(queue.tweens.length, 1);
            assert.deepEqual(queue.tweens.indexOf(tween1), -1);
            assert.notEqual(queue.tweens.indexOf(tween2), -1);

            queue.update(2000);
            assert.deepEqual(queue.tweens.length, 0);
            assert.deepEqual(queue.tweens.indexOf(tween1), -1);
            assert.deepEqual(queue.tweens.indexOf(tween2), -1);
        });
    });

    describe('start()', function() {
        var list = new Queue(),
            t = new Tween({});

        it("starts all tweens", function() {
            var tween1Started = false,
                tween2Started = false,
                tween1Complete = false,
                tween2Complete = false,
                queue = new Queue(),
                target1 = {
                    x: 0
                },
                tween1 = new Tween(target1, {
                    to: {
                        x: 1
                    },
                    duration: 1000,
                    onStart: function(){
                        tween1Started = true;
                    },
                    onComplete: function(){
                        tween1Complete = true;
                    }
                }),
                target2 = {
                    x: 10
                },
                tween2 = new Tween(target2, {
                    to: {
                        x: 100
                    },
                    duration: 2000,
                    onStart: function(){
                        tween2Started = true;
                    },
                    onComplete: function(){
                        tween2Complete = true;
                    }
                });

            assert.deepEqual(queue.tweens.length, 0);

            queue.add(tween1);
            queue.add(tween2);

            queue.update(0);
            assert.deepEqual(tween1Started, false);
            assert.deepEqual(tween2Started, false);
            assert.deepEqual(tween1Complete, false);
            assert.deepEqual(tween2Complete, false);

            assert.deepEqual(target1.x, 0);
            assert.deepEqual(target2.x, 10);

            queue.start(0);
            assert.deepEqual(tween1Started, false);
            assert.deepEqual(tween2Started, false);
            assert.deepEqual(tween1Complete, false);
            assert.deepEqual(tween2Complete, false);
            assert.deepEqual(target1.x, 0);
            assert.deepEqual(target2.x, 10);

            queue.update(1);
            assert.deepEqual(tween1Started, true);
            assert.deepEqual(tween2Started, true);
            assert.deepEqual(tween1Complete, false);
            assert.deepEqual(tween2Complete, false);
            assert.notEqual(target1.x, 0);
            assert.notEqual(target2.x, 10);

            queue.update(999);
            assert.deepEqual(tween1Complete, false);
            assert.deepEqual(tween2Complete, false);
            assert.notEqual(target1.x, 0);
            assert.notEqual(target2.x, 10);

            queue.update(1000);
            assert.deepEqual(tween1Complete, true);
            assert.deepEqual(tween2Complete, false);
            assert.deepEqual(target1.x, 1);
            assert.notEqual(target2.x, 10);


            queue.update(1500);
            assert.deepEqual(tween1Complete, true);
            assert.deepEqual(tween2Complete, false);
            assert.deepEqual(target1.x, 1);
            assert.notEqual(target2.x, 10);

            queue.update(2000);
            assert.deepEqual(tween1Complete, true);
            assert.deepEqual(tween2Complete, true);
            assert.deepEqual(target1.x, 1);
            assert.deepEqual(target2.x, 100);

        });


    });
});

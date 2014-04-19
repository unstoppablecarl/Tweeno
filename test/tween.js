// 'use strict';
var assert = require('assert'),
    Tween = require('../src/tween.js'),
    Queue = require('../src/queue.js'),
    Interpolation = require('../src/interpolation.js'),
    Filter = require('../src/filter.js');

global.window = {};

describe('Tween', function() {

    describe('constructor()', function() {
        it('instanceof', function() {
            var tween = new Tween({});
            assert(tween instanceof Tween);
        });

        it('can set settings multiple ways', function() {
            var settings = {
                to: {
                    x: 100
                },
                from: {
                    x: 10
                },
                duration: 99,
                repeat: 1,
                yoyo: true,
                delay: 50,
                easing: function() {},
                interpolation: function() {},
                onStart: function() {},
                onUpdate: function() {},
                onComplete: function() {},
                chained: []
            };
            var tween = new Tween({
                x: 0
            }, settings);
            for (var key in settings) {
                assert.deepEqual(tween[key], settings[key]);
            }
        });
    });

    describe('getDuration()', function() {
        it('simple duration', function() {
            var tween = new Tween({}, {
                duration: 100,
                delay: 50
            });
            assert.deepEqual(tween.getDuration(), 150);
        });

        it('with repeat', function() {
            var tween = new Tween({}, {
                duration: 100,
                delay: 50,
                repeat: 3,
            });
            assert.deepEqual(tween.getDuration(), 450);
        });
    });

    describe('start()', function() {
        it('returns the tween instance ', function() {
            var tween = new Tween({});
            assert(tween.start() instanceof Tween);
            assert.deepEqual(tween.start(), tween);
        });

        it('window.performance', function() {
            var obj = {
                x: 1
            },
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000
                },
                tween = new Tween(obj, settings);
            tween.window = {
                performance: {
                    now: function(){
                        return 0;
                    }
                }
            };
            tween.start();

            tween.update(500);
            assert.deepEqual(obj.x, 1.5);

            tween.update(1000);
            assert.deepEqual(obj.x, 2);

            global.window = {};
        });
    });



    describe('update()', function() {


        it('ignore multiple update() calls if not started', function() {
            var obj = {
                x: 1
            },
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            var up = tween.update(500);
            assert(up);
            assert.deepEqual(obj.x, 1);

            up = tween.update(1000);
            assert(up);
            assert.deepEqual(obj.x, 1);
        });

        it('Existing property', function() {
            var obj = {
                x: 1
            },
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            tween.start(0);

            tween.update(500);
            assert.deepEqual(obj.x, 1.5);

            tween.update(1000);
            assert.deepEqual(obj.x, 2);
        });

        it('Existing property using from param', function() {
            var obj = {
                x: 0
            },
                settings = {
                    from: {
                        x: 1
                    },
                    to: {
                        x: 2
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            tween.start(0);

            tween.update(500);
            assert.deepEqual(obj.x, 1.5);

            tween.update(1000);
            assert.deepEqual(obj.x, 2);
        });


        it('Non-existing property', function() {
            var obj = {
                x: 1
            },
                settings = {
                    to: {
                        y: 0
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            tween.start(0);
            tween.update(1000);
            assert.deepEqual(obj.y, 0);
        });

        it('Non-null property', function() {
            var obj = {
                x: 1
            },
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            tween.start(0);
            tween.update(1000);

            assert.deepEqual(obj.x, 2);
            assert(obj.x !== null);
        });

        it('Function property', function() {
            var my_function = function() {};
            var obj = {
                x: my_function
            },
                settings = {
                    to: {
                        x: my_function
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            tween.start(0);
            tween.update(1000);

            assert(obj.x === my_function, 'function value was changed by tween');
        });

        it('Boolean property', function() {
            var obj = {
                x: true
            },
                settings = {
                    to: {
                        x: function() {}
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            tween.start(0);

            tween.update(1000);

            assert(typeof obj.x === 'boolean', 'boolean value was changed by tween to different type');
            assert(obj.x, 'boolean value was changed by tween');
        });

        it('Null property', function() {
            var obj = {
                x: null
            },
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);
            assert.deepEqual(obj.x, null, 'null value was changed by tween');

            tween.start(0);
            assert.deepEqual(obj.x, null);

            tween.update(0);
            assert.deepEqual(obj.x, 0);
            tween.update(500);

            assert.deepEqual(obj.x, 1);
            tween.update(1000);

            assert.deepEqual(obj.x, 2);

        });

        it('Undefined property', function() {
            var obj = {},
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000,
                },
                tween = new Tween(obj, settings);

            assert(typeof obj.x === 'undefined');

            tween.start(0);
            assert(typeof obj.x === 'undefined');

            tween.update(0);
            assert.deepEqual(obj.x, 0);

            tween.update(500);

            assert.deepEqual(obj.x, 1);
            tween.update(1000);

            assert.deepEqual(obj.x, 2);

        });

        it('with delay', function() {
            var obj = {
                x: 1
            },
                settings = {
                    to: {
                        x: 2
                    },
                    duration: 1000,
                    delay: 500,
                },
                tween = new Tween(obj, settings);

            tween.start(0);

            tween.update(100);

            assert.deepEqual(obj.x, 1, "Tween hasn't started yet");

            tween.update(1000);

            assert((obj.x !== 1) && (obj.x !== 2), "Tween has started but hasn't finished yet");

            tween.update(1500);

            assert.equal(obj.x, 2, 'Tween finishes when expected');

        });

        describe('callbacks', function() {

            it('onStart()', function() {
                var counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 1000,
                        onStart: function() {
                            assert(true, 'onStart callback is called');
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);
                assert.deepEqual(counter, 0);

                tween.start(0);
                assert.deepEqual(counter, 0);
                tween.update(0);

                assert.deepEqual(counter, 1);
                tween.update(500);

                assert.deepEqual(counter, 1, 'onStart callback is not called again');

            });

            it('onUpdate()', function() {
                var expectedProgress = 0,
                    expectedCounter = 0,
                    counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 1000,
                        onUpdate: function(target, thisTween, progress) {
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            assert.deepEqual(counter, expectedCounter);
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);

                tween.start(0);

                expectedProgress = 0;
                expectedCounter = 0;
                tween.update(0);

                expectedCounter = 1;
                expectedProgress = 0.5;
                tween.update(500);

                expectedCounter = 2;
                expectedProgress = 0.6;
                tween.update(600);

                expectedCounter = 3;
                expectedProgress = 1;
                tween.update(1000);
            });

            it('onUpdate() with queue', function() {
                var queue = new Queue(),
                    expectedProgress = 0,
                    expectedCounter = 0,
                    counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 1000,
                        onUpdate: function(target, thisTween, progress) {
                            assert.deepEqual(target, obj);
                            assert.deepEqual(thisTween, tween);
                            assert.deepEqual(progress, expectedProgress);
                            assert.deepEqual(counter, expectedCounter);
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);

                queue.add(tween);

                assert.deepEqual(counter, 0);

                queue.start(0);
                expectedProgress = 0;
                expectedCounter = 0;
                queue.update(0);

                expectedCounter = 1;
                expectedProgress = 0.5;
                queue.update(500);

                expectedCounter = 2;
                expectedProgress = 0.6;
                queue.update(600);

                expectedCounter = 3;
                expectedProgress = 1;
                queue.update(1000);
                queue.update(1500);
                assert.deepEqual(counter, 4, 'onUpdate callback should not be called after the tween has finished');

            });

            it('onRepeat()', function() {
                var expectedProgress = 0,
                    expectedCounter = 0,
                    counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 100,
                        repeat: 2,
                        onRepeat: function(target, thisTween, progress) {
                            counter++;
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            assert.deepEqual(counter, expectedCounter);
                        }
                    },
                    tween = new Tween(obj, settings);

                tween.start(0);

                expectedProgress = 0;
                expectedCounter = 0;
                tween.update(0);

                expectedCounter = 1;
                expectedProgress = 1;
                tween.update(100);

                expectedCounter = 1;
                expectedProgress = 1;
                tween.update(150);

                expectedCounter = 2;
                expectedProgress = 1;
                tween.update(200);

                expectedCounter = 2;
                expectedProgress = 1;
                tween.update(250);
            });

            it('onRepeat() with queue', function() {
                var queue = new Queue(),
                    expectedProgress = 0,
                    expectedCounter = 0,
                    counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 100,
                        repeat: 2,
                        onRepeat: function(target, thisTween, progress) {
                            counter++;
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            assert.deepEqual(counter, expectedCounter);
                        }
                    },
                    tween = new Tween(obj, settings);

                queue.add(tween);
                queue.start(0);

                expectedProgress = 0;
                expectedCounter = 0;
                queue.update(0);

                expectedCounter = 1;
                expectedProgress = 1;
                queue.update(100);

                expectedCounter = 1;
                expectedProgress = 1;
                queue.update(150);

                expectedCounter = 2;
                expectedProgress = 1;
                queue.update(200);

                expectedCounter = 2;
                expectedProgress = 1;
                queue.update(250);
            });

            it('onYoYo()', function() {
                var expectedProgress = 0,
                    expectedCounter = 0,
                    counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 100,
                        yoyo: true,
                        repeat: 2,
                        onYoYo: function(target, thisTween, progress) {
                            counter++;
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            assert.deepEqual(counter, expectedCounter);
                        }
                    },
                    tween = new Tween(obj, settings);

                tween.start(0);

                expectedProgress = 0;
                expectedCounter = 0;
                tween.update(0);

                expectedCounter = 1;
                expectedProgress = 1;
                tween.update(100);

                expectedCounter = 1;
                expectedProgress = 1;
                tween.update(150);

                expectedCounter = 2;
                expectedProgress = 1;
                tween.update(200);

                expectedCounter = 2;
                expectedProgress = 1;
                tween.update(250);
            });

            it('onYoYo() with queue', function() {
                var queue = new Queue(),
                    expectedProgress = 0,
                    expectedCounter = 0,
                    counter = 0,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 100,
                        yoyo: true,
                        repeat: 2,
                        onYoYo: function(target, thisTween, progress) {
                            counter++;
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            assert.deepEqual(counter, expectedCounter);
                        }
                    },
                    tween = new Tween(obj, settings);

                queue.add(tween);
                queue.start(0);

                expectedProgress = 0;
                expectedCounter = 0;
                queue.update(0);

                expectedCounter = 1;
                expectedProgress = 1;
                queue.update(100);

                expectedCounter = 1;
                expectedProgress = 1;
                queue.update(150);

                expectedCounter = 2;
                expectedProgress = 1;
                queue.update(200);

                expectedCounter = 2;
                expectedProgress = 1;
                queue.update(250);
            });

            it('onComplete()', function() {
                var counter = 0,
                    expectedProgress = 1,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 1000,
                        onComplete: function(target, thisTween, progress) {
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);

                assert.deepEqual(counter, 0);

                tween.start(0);
                assert.deepEqual(counter, 0);

                tween.update(0);
                assert.deepEqual(counter, 0);

                tween.update(500);
                assert.deepEqual(counter, 0);

                tween.update(600);
                assert.deepEqual(counter, 0);

                tween.update(1000);
                assert.deepEqual(counter, 1);

                tween.update(1500);
                assert.deepEqual(counter, 1, 'onComplete callback must be called only once called ' + counter);

            });

            it('onComplete() with queue', function() {
                var queue = new Queue(),
                    counter = 0,
                    expectedProgress = 1,
                    obj = {},
                    settings = {
                        to: {
                            x: 2
                        },
                        duration: 1000,
                        onComplete: function(target, thisTween, progress) {
                            assert.deepEqual(target, obj);
                            assert.deepEqual(tween, thisTween);
                            assert.deepEqual(progress, expectedProgress);
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);

                queue.add(tween);

                queue.start(0);
                assert.deepEqual(counter, 0);

                queue.update(0);
                assert.deepEqual(counter, 0);

                queue.update(500);
                assert.deepEqual(counter, 0);

                queue.update(600);
                assert.deepEqual(counter, 0);

                queue.update(1000);
                assert.deepEqual(counter, 1);

                queue.update(1500);
                assert.deepEqual(counter, 1, 'onComplete callback must be called only once, called ' + counter);


            });

        });

        describe('repeat', function() {

            it('Tween does not repeat by default', function() {
                var counter = 0,
                    obj = {
                        x: 0
                    },
                    settings = {
                        to: {
                            x: 100
                        },
                        duration: 100,
                        onComplete: function() {
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);

                tween.start(0);

                tween.update(0);
                assert.deepEqual(obj.x, 0);

                tween.update(50);
                assert.deepEqual(obj.x, 50);

                tween.update(100);
                assert.deepEqual(obj.x, 100);

                tween.update(150);
                assert.deepEqual(obj.x, 100);

            });


            it('Single repeat happens only once', function() {
                var counter = 0,
                    obj = {
                        x: 0
                    },
                    settings = {
                        to: {
                            x: 100
                        },
                        duration: 100,
                        repeat: 1,
                        onComplete: function() {
                            counter++;
                        }
                    },
                    tween = new Tween(obj, settings);

                tween.start(0);

                tween.update(0);
                assert.deepEqual(obj.x, 0);

                tween.update(50);
                assert.deepEqual(obj.x, 50);

                tween.update(100);
                assert.deepEqual(obj.x, 100);

                tween.update(150);
                assert.deepEqual(obj.x, 50);

                tween.update(200);
                assert.deepEqual(obj.x, 100);

            });

            it('Infinity repeat happens forever', function() {
                var obj = {
                    x: 0
                },
                    settings = {
                        to: {
                            x: 100
                        },
                        duration: 100,
                        repeat: Infinity,

                    },
                    tween = new Tween(obj, settings);
                tween.start(0);

                tween.update(0);
                assert.deepEqual(obj.x, 0);

                tween.update(50);
                assert.deepEqual(obj.x, 50);

                tween.update(100);
                assert.deepEqual(obj.x, 100);

                tween.update(150);
                assert.deepEqual(obj.x, 50);

                tween.update(200);
                assert.deepEqual(obj.x, 100);

                tween.update(250);
                assert.deepEqual(obj.x, 50);

            });
        });

        describe('yoyo', function() {

            it('repeat 1 happens once', function() {
                var queue = new Queue(),
                    obj = {
                        x: 0
                    },
                    settings = {
                        to: {
                            x: 100
                        },
                        duration: 100,
                        repeat: 1,
                        yoyo: true
                    },
                    tween = new Tween(obj, settings);
                queue.add(tween);
                tween.start(0);

                queue.update(0);
                assert.deepEqual(obj.x, 0);

                queue.update(25);
                assert.deepEqual(obj.x, 25);

                queue.update(100);
                assert.deepEqual(obj.x, 100);

                queue.update(125);
                assert.deepEqual(obj.x, 75);

                queue.update(200);
                assert.deepEqual(obj.x, 0);

                queue.update(225);
                assert.deepEqual(obj.x, 0);
            });

            it('repeat Infinity happens forever', function() {
                var queue = new Queue(),
                    obj = {
                        x: 0
                    },
                    settings = {
                        to: {
                            x: 100
                        },
                        duration: 100,
                        repeat: Infinity,
                        yoyo: true
                    },
                    tween = new Tween(obj, settings);

                queue.add(tween);
                tween.start(0);
                queue.update(0);
                assert.deepEqual(obj.x, 0);

                queue.update(25);
                assert.deepEqual(obj.x, 25);

                queue.update(100);
                assert.deepEqual(obj.x, 100);

                queue.update(125);
                assert.deepEqual(obj.x, 75);

                queue.update(200);
                assert.deepEqual(obj.x, 0);

                queue.update(225);
                assert.deepEqual(obj.x, 25);

            });
        });
    });

    describe('interpolation', function() {
        it('default', function() {
            var obj = {
                x: 0,
                y: 0
            },
                interpolation = Interpolation.Bezier,
                settings = {
                    to: {
                        x: [1, 3, 9, -20],
                        y: []
                    },
                    duration: 100,
                    filters: {
                        color: new Filter()
                    },
                    interpolation: interpolation
                },
                tween = new Tween(obj, settings);

            tween.start(0);


            var test = function(progress) {
                var val = interpolation(progress, settings.to.x);
                assert.deepEqual(obj.x, val);

                assert.deepEqual(obj.y, 0);
            };

            test(0);

            test(25);

            test(50);
            test(75);
            test(100);
        });
    });
    describe('filter', function() {
        it('default', function() {
            var list = new Queue(),
                obj = {

                    color: 'rgba(10,20,30,1)'
                },
                settings = {
                    to: {
                        color: 'rgba(20,40,60,1)'
                    },
                    duration: 100,
                    filters: {
                        color: new Filter()
                    },
                },
                tween = new Tween(obj, settings);

            tween.start(0);

            tween.update(0);
            assert.equal(obj.color, 'rgba(10,20,30,1)');

            tween.update(25);
            assert.equal(obj.color, 'rgba(12.5,25,37.5,1)');

            tween.update(50);
            assert.equal(obj.color, 'rgba(15,30,45,1)');

            tween.update(100);
            assert.equal(obj.color, settings.to.color);
        });

        it('interpolated', function() {
            var obj = {
                r: 0,
                color: 'rgba(0,0,0,0)',
            },
                settings = {
                    to: {
                        r: [0, 1, 10, 5],
                        color: [
                            'rgba(1,0,0,0)',
                            'rgba(10,0,0,0)',
                            'rgba(5,0,0,0)',
                        ]
                    },
                    duration: 100,
                    filters: {
                        color: new Filter()
                    },
                    interpolation: Interpolation.Bezier
                },
                tween = new Tween(obj, settings);

            var r;
            tween.start(0);

            tween.update(0);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(25);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(50);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(55);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(80);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(100);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');
        });

        it('interpolated repeat', function() {
            var obj = {
                r: 0,
                color: 'rgba(0,0,0,0)',
            },
                settings = {
                    to: {
                        r: [0, 1, 10, 5],
                        color: [
                            'rgba(1,0,0,0)',
                            'rgba(10,0,0,0)',
                            'rgba(5,0,0,0)',
                        ]
                    },
                    repeat: 2,
                    duration: 100,
                    filters: {
                        color: new Filter()
                    },
                    interpolation: Interpolation.Bezier
                },
                tween = new Tween(obj, settings);

            var r;
            tween.start(0);

            tween.update(0);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(25);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(50);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(55);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(80);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');

            tween.update(100);
            r = obj.r;
            assert.equal(obj.color, 'rgba(' + r + ',0,0,0)');
        });
    });

     describe('chained', function() {
        it('chain one tween', function() {
            var queue = new Queue(),
                tweenStarted = false,
                tweenCompleted = false,

                tweenSettings = {
                    duration: 1000,
                    onStart: function() {
                        tweenStarted = true;
                    },
                    onComplete: function() {
                        tweenCompleted = true;
                    },
                },
                tween = new Tween({}, tweenSettings),
                tween2Settings = {
                    duration: 1000,
                    onStart: function() {
                        assert.deepEqual(tweenStarted, true);
                        assert.deepEqual(tweenCompleted, true);
                        assert.deepEqual(tween2Started, false);
                        tween2Started = true;
                    },
                    onComplete: function() {
                        tweenCompleted = true;
                    },
                },
                tween2 = new Tween({}, tween2Settings),
                tween2Started = false,
                tween2Completed = false;

            tween.chained = [tween2];

            queue.add(tween);
            assert.deepEqual(tweenStarted, false);
            assert.deepEqual(tween2Started, false);

            queue.start(0);
            queue.update(0);

            assert.deepEqual(tweenStarted, true);
            assert.deepEqual(tween2Started, false);

            queue.update(1000);

            assert.deepEqual(tweenCompleted, true);

            queue.update(1001);

            assert.deepEqual(tween2Started, true, 'tween2 is automatically started by tween');

        });

        it('multiple', function() {
            var queue = new Queue(),
                tweenSettings = {
                    duration: 1000,
                },
                tween = new Tween({}, tweenSettings),
                chainedTweens = [],
                numChained = 3,
                numChainedStarted = 0;

            var chainedSettings = {
                duration: 1000,
                onStart: function(){
                    numChainedStarted++;
                }
            };
            tween.chained = [];
            for(var i = 0; i < numChained; i++){
                var chained = new Tween({}, chainedSettings);
                tween.chained.push(chained);
            }

            assert.deepEqual(numChainedStarted, 0);

            queue.add(tween);
            queue.start(0);
            queue.update(0);
            queue.update(1000);
            queue.update(1001);

            assert.deepEqual(numChainedStarted, numChained, 'All chained tweens have been started');

        });

        it('allows endless loops', function() {

            var queue = new Queue(),
                target = {
                    x: 0
                },
                tween1Settings = {
                    to: {
                        x: 100
                    },
                    duration: 1000
                },
                tween1 = new Tween(target, tween1Settings),
                tween2Settings = {
                    to: {
                        x: 0
                    },
                    duration: 1000
                },
                tween2 = new Tween(target, tween2Settings);


            queue.add(tween1);

            tween1.chained = [tween2];
            tween2.chained = [tween1];

            assert.deepEqual(target.x, 0);

            // x == 0
            queue.start(0);
            queue.update(0);

            assert.deepEqual(target.x, 0);

            queue.update(500);
            assert.deepEqual(target.x, 50);

            queue.update(1000);
            assert.deepEqual(queue.tweens.indexOf(tween1), -1, 'tween1 removed');
            assert.notDeepEqual(queue.tweens.indexOf(tween2), -1, 'tween2 added');
            assert.deepEqual(target.x, 100);

            queue.update(1500);
            assert.deepEqual(target.x, 50);

            // ... and back again (x == 0)

            queue.update(2000);
            assert.deepEqual(queue.tweens.indexOf(tween2), -1, 'tween2 removed');
            assert.notDeepEqual(queue.tweens.indexOf(tween1), -1, 'tween1 added');
            assert.deepEqual(target.x, 0);

            queue.update(2500);
            assert.deepEqual(target.x, 50);

            queue.update(3000);
            assert.deepEqual(queue.tweens.indexOf(tween1), -1, 'tween1 removed');
            assert.notDeepEqual(queue.tweens.indexOf(tween2), -1, 'tween2 added');
            assert.deepEqual(target.x, 100); // and x == 100 again

        });
    });

});

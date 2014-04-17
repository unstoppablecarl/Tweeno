var assert = require("assert"),
    Tween = require('../src/tween.js'),
    Queue = require('../src/queue.js'),
    Easing = require('../src/easing.js'),
    Interpolation = require('../src/interpolation.js'),
    Filter = require('../src/filter.js');

global.window = {};
describe('Filter', function() {
    var settings = {
        format: 'rgba(%,%,%,%)'
    };
    describe('constructor()', function() {
        it('instanceof', function() {
            var t = new Filter({});
            assert(t instanceof Filter);

            t = new Filter();
            assert(t instanceof Filter);
        });
    });

    describe('stringToArray()', function() {

        var runTestData = function(filter, testData){
            for (var i = 0; i < testData.length; i++) {
                var str = testData[i].str,
                    arr = testData[i].arr;
                assert.deepEqual(filter.stringToArray(str), arr);
            }
        };

        it('default', function() {
            var settings = {
                    format: '%test(%,%,%)'
                },
                f = new Filter(settings),
                testData = [
                    {
                        str: 'test(1,2,3,4)',
                        arr: [1, 2, 3, 4]
                    },
                    {
                        str: 'test(10,200,3000,40000)',
                        arr: [10, 200, 3000, 40000]
                    },
                    {
                        str: 'test(1.1,2.2,3.3,4.4)',
                        arr: [1.1, 2.2, 3.3, 4.4]
                    },{
                        str: 'test(-1,-2.2,20.02,-0)',
                        arr: [-1, -2.2, 20.02, 0]
                    }
                ];
            runTestData(f, testData);
        });

        it('starts with number', function() {
            var settings = {
                    format: '%test(%,%,%)'
                },
                f = new Filter(settings),
                testData = [
                    {
                        str: '1test(2,3,4)',
                        arr: [1, 2, 3, 4]
                    },
                    {
                        str: '10test(200,3000,40000)',
                        arr: [10, 200, 3000, 40000]
                    },
                    {
                        str: '1.1test(2.2,3.3,4.4)',
                        arr: [1.1, 2.2, 3.3, 4.4]
                    },{
                        str: '-1test(-2.2,20.02,-0)',
                        arr: [-1, -2.2, 20.02, 0]
                    }
                ];
            runTestData(f, testData);
        });

        it('ends with number', function() {
            var settings = {
                    format: 'test(%,%,%)%'
                },
                f = new Filter(settings),
                testData = [
                    {
                        str: 'test(1,2,3)4',
                        arr: [1, 2, 3, 4]
                    },
                    {
                        str: 'test(10,200,3000)40000',
                        arr: [10, 200, 3000, 40000]
                    },
                    {
                        str: 'test(1.1,2.2,3.3)4.4',
                        arr: [1.1, 2.2, 3.3, 4.4]
                    },{
                        str: 'test(-1,-2.2,20.02)-0',
                        arr: [-1, -2.2, 20.02, 0]
                    }
                ];
            runTestData(f, testData);
        });
    });

    describe('arrayToString()', function() {

        var runTestData = function(filter, testData){
            for (var i = 0; i < testData.length; i++) {
                var str = testData[i].str,
                    arr = testData[i].arr;
                assert.deepEqual(filter.arrayToString(arr), str);
            }
        };

        it('default', function() {
            var settings = {
                    format: 'test(%,%,%,%)'
                },
                f = new Filter(settings);

            testData = [
                {
                    str: 'test(1,2,3,4)',
                    arr: [1, 2, 3, 4]
                },
                {
                    str: 'test(10,200,3000,40000)',
                    arr: [10, 200, 3000, 40000]
                },
                {
                    str: 'test(1.1,2.2,3.3,4.4)',
                    arr: [1.1, 2.2, 3.3, 4.4]
                },{
                    str: 'test(-1,-2.2,20.02,0)',
                    arr: [-1, -2.2, 20.02, -0]
                }
            ];
            runTestData(f, testData);
        });

        it('starts with number', function() {
            var settings = {
                    format: '%test(%,%,%)'
                },
                f = new Filter(settings),
                testData = [
                    {
                        str: '1test(2,3,4)',
                        arr: [1, 2, 3, 4]
                    },
                    {
                        str: '10test(200,3000,40000)',
                        arr: [10, 200, 3000, 40000]
                    },
                    {
                        str: '1.1test(2.2,3.3,4.4)',
                        arr: [1.1, 2.2, 3.3, 4.4]
                    },{
                        str: '-1test(-2.2,20.02,0)',
                        arr: [-1, -2.2, 20.02, -0]
                    }
                ];
            runTestData(f, testData);
        });

        it('ends with number', function() {
            var settings = {
                    format: 'test(%,%,%)%'
                },
                f = new Filter(settings),
                testData = [
                    {
                        str: 'test(1,2,3)4',
                        arr: [1, 2, 3, 4]
                    },
                    {
                        str: 'test(10,200,3000)40000',
                        arr: [10, 200, 3000, 40000]
                    },
                    {
                        str: 'test(1.1,2.2,3.3)4.4',
                        arr: [1.1, 2.2, 3.3, 4.4]
                    },{
                        str: 'test(-1,-2.2,20.02)0',
                        arr: [-1, -2.2, 20.02, -0]
                    }
                ];
            runTestData(f, testData);
        });
    });

    describe('validation', function() {
        var exLength = false,
            exString = false,
            exParam = false,
            exceptionThrown = false,
            resetValidateVars = function(){
                exLength = false;
                exString = false;
                exParam = false;
                exceptionThrown = false;
            },
            watchValidateFunction = function(filter){
                filter.validateArrayLength = function(length, string, param){
                    exLength = length;
                    exString = string;
                    exParam = param;
                    try {
                        Filter.prototype.validateArrayLength.apply(this, arguments);
                    } catch(e){
                        exceptionThrown = true;
                        throw e;
                    }
                };
            };

        it('validateArrayLength()', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1)',
                to = 'rgba(10,20,30,1)';

            watchValidateFunction(filter);
            resetValidateVars();

            try {
                filter.validateArrayLength(5, from, 'from');
            } catch(e) {}

            assert(exceptionThrown, 'less than Exception not thrown');
            assert.deepEqual(exLength, 5);
            assert.deepEqual(exString, from);
            assert.deepEqual(exParam, 'from');

            resetValidateVars();

            try {
                filter.validateArrayLength(5);
            } catch(e) {}

            assert(exceptionThrown, 'less than Exception not thrown');
            assert.deepEqual(exLength, 5);
            assert.deepEqual(exString, undefined);
            assert.deepEqual(exParam, undefined);

        });

        it('from length validate less', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3)',
                to = 'rgba(10,20,30,1)';

            resetValidateVars();
            watchValidateFunction(filter);

            try {
                filter.start(from, to);
            } catch(e) {}

            assert(exceptionThrown, 'less than Exception not thrown');
            assert.deepEqual(exLength, 3);
            assert.deepEqual(exString, from);
            assert.deepEqual(exParam, 'arrayFrom');
        });

        it('from length validate more', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1,999)',
                to = 'rgba(10,20,30,1)';
            resetValidateVars();
            watchValidateFunction(filter);

            try {
                filter.start(from, to);
            } catch(e) {}

            assert(exceptionThrown, 'greater than Exception not thrown');
            assert.deepEqual(exLength, 5);
            assert.deepEqual(exString, from);
            assert.deepEqual(exParam, 'arrayFrom');
        });

        it('to length validate less', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1)',
                to = 'rgba(10,20,30)';

            resetValidateVars();
            watchValidateFunction(filter);

            try {
                filter.start(from, to);
            } catch(e) {}

            assert(exceptionThrown, 'less than Exception not thrown');
            assert.deepEqual(exLength, 3);
            assert.deepEqual(exString, to);
            assert.deepEqual(exParam, 'arrayTo');
        });

        it('to length validate more', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1)',
                to = 'rgba(10,20,30,1,999)';

            resetValidateVars();
            watchValidateFunction(filter);

            try {
                filter.start(from, to);
            } catch(e) {}

            assert(exceptionThrown, 'greater than Exception not thrown');
            assert.deepEqual(exLength, 5);
            assert.deepEqual(exString, to);
            assert.deepEqual(exParam, 'arrayTo');
        });

        it('to length interpolated validate less', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1)',
                to = ['rbga(1,2,3)', 'rgba(10,20,30,1)', 'rgba(15,25,35,1)'];

            resetValidateVars();
            watchValidateFunction(filter);

            try {
                filter.start(from, to);
            } catch(e) {}

            assert(exceptionThrown, 'less than Exception not thrown');
            assert.deepEqual(exLength, 3);
            assert.deepEqual(exString, 'rbga(1,2,3)');
            assert.deepEqual(exParam, 'arrayTo');
        });

        it('to length interpolated validate more', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1)',
                to = ['rbga(1,2,3,1)', 'rgba(10,20,30,1,999)', 'rgba(15,25,35,1)'];
            resetValidateVars();
            watchValidateFunction(filter);

            try {
                filter.start(from, to);
            } catch(e) {}

            assert(exceptionThrown, 'greater than Exception not thrown');
            assert.deepEqual(exLength, 5);
            assert.deepEqual(exString, 'rgba(10,20,30,1,999)');
            assert.deepEqual(exParam, 'arrayTo');
        });

    });

    describe('conversion', function() {

        it('getIndexedInterpolationData', function() {
            var filter = new Filter(settings);

            var fromArray = [
                [1,2,3,1],
                [10,20,30,1],
                [15,25,35,1]
            ];
            var actual = filter.getIndexedInterpolationData(fromArray);

            var expected = [
                [1,10,15],
                [2,20,25],
                [3,30,35],
                [1,1,1]
            ];

            assert.deepEqual(actual, expected);
        });
    });

    describe('start', function() {

        it('default', function() {
            var filter = new Filter(settings),
                from = 'rbga(1,2,3,1)',
                to = 'rgba(10,20,30,1)';

            filter.start(from, to);
            assert.deepEqual(filter.from, from);
            assert.deepEqual(filter.arrayFrom, [1,2,3,1]);

            assert.deepEqual(filter.to, to);
            assert.deepEqual(filter.arrayTo, [10,20,30,1]);

        });

        it('interpolated', function() {
            var filter = new Filter(settings),
                from = 'rbga(0,0,0,0)',
                to = ['rbga(1,2,3,1)', 'rgba(10,20,30,1)', 'rgba(15,25,35,1)'];

            filter.start(from, to);

            assert.deepEqual(filter.from, from);
            assert.deepEqual(filter.arrayFrom, [0,0,0,0]);
            assert.deepEqual(filter.to, to);

            var arrayTo = [
                [0,0,0,0],
                [1,2,3,1],
                [10,20,30,1],
                [15,25,35,1]
            ];
            assert.deepEqual(filter.arrayTo, arrayTo);

            var arrayToIndexedInterpolated = [
                [0,1,10,15],
                [0,2,20,25],
                [0,3,30,35],
                [0,1,1,1]
            ];
            assert.deepEqual(filter.arrayToIndexedInterpolated, arrayToIndexedInterpolated);
        });

    });

    describe('getUpdatedValue', function() {

        it('default', function() {
            var filter = new Filter(settings),
                from = 'rbga(10,20,30,1)',
                to = 'rgba(20,30,40,1)';

            filter.start(from, to);

            var easedProgress = 0.5,
                interpolation = Interpolation.Linear;
            var out = filter.getUpdatedValue(easedProgress, interpolation);
            assert.deepEqual(out, 'rgba(15,25,35,1)');
        });

        it('interpolated', function() {
            var filter = new Filter(settings),
                from = 'rbga(0,0,0,0)',
                to = ['rbga(1,2,3,1)', 'rgba(10,20,30,1)', 'rgba(15,-25,35,1)'];

            filter.start(from, to);


            var interpolation = Interpolation.Linear;

            var getExpected = function(easedProgress){
                return [
                    interpolation([0,1,10,15], easedProgress),
                    interpolation([0,2,20,-25], easedProgress),
                    interpolation([0,3,30,35], easedProgress),
                    interpolation([0,1,1,1], easedProgress)
                ];
            };

            var easedProgress = 0.50,
                expected = getExpected(easedProgress),
                out = filter.getUpdatedValue(easedProgress, interpolation),
                outArr = filter.stringToArray(out);

            assert.deepEqual(outArr, expected);

            filter.start(from, to);
            easedProgress = 0.85;
            expected = getExpected(easedProgress);
            out = filter.getUpdatedValue(easedProgress, interpolation);
            outArr = filter.stringToArray(out);

            assert.deepEqual(outArr, expected);

        });
    });

});

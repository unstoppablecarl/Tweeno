'use strict';

var Filter = function(settings) {
    settings = settings || {};
    this.format = settings.format || this.format;

    this.placeholder = settings.placeholder || this.placeholder;
    // prevent reference
    this.placeholderTypes = settings.placeholderTypes || [].concat(this.placeholderTypes);
    this._formatArray = this.format.split(this.placeholder);
};

Filter.prototype._formatArray = null;

Filter.prototype.format = 'rgba(%,%,%,%)';
Filter.prototype.placeholder = '%';
Filter.prototype.placeholderTypes = ['int', 'int', 'int', 'float'];

Filter.prototype.to = null;
Filter.prototype.from = null;

Filter.prototype.stringToArray = function(string) {
    var array = string.match(/[+-]?[\d]+(\.[\d]+)?/g);
    return array.map(parseFloat);
};

Filter.prototype.validateArrayLength = function(length, string, param) {
    param = param || '';
    string = string || '';

    if(param) {
        param = ' set to the "' + param + '" param';
    }
    if(string) {
        string = ' of string "' + string + '"';
    }

    var placeholderCount = this._formatArray.length - 1;
    if(length < placeholderCount) {
        throw new Error('value array length' + ' ( ' + length + ' )' + string + param + ' is less than the number of format placeholders ' + '( ' + placeholderCount + ' ) in ' + this.format);
    } else if(length > placeholderCount) {
        throw new Error('value array length' + ' ( ' + length + ' )' + string + param + ' is greater than the number of format placeholders ' + '( ' + placeholderCount + ' ) in ' + this.format);
    }
};

Filter.prototype.arrayToString = function(array) {
    var formatArray = this._formatArray,
        len = formatArray.length,
        out = [],
        i;

    for(i = 0; i < len; i++) {
        if(this.placeholderTypes[i] === 'int'){
            array[i] = Math.round(array[i]);
        }

        out.push(formatArray[i]);
        out.push(array[i]);
    }
    return out.join('');
};


Filter.prototype.start = function(from, to) {
    this.from = from;
    this.to = to;
    this.arrayFrom = this.stringToArray(from);
    this.validateArrayLength(this.arrayFrom.length, from, 'arrayFrom');
    var arrayTo;
    // interpolated end value
    if(to instanceof Array) {
        arrayTo = [];
        // create a local copy of the Array with the start value at the front
        to = [from].concat(to);
        var len = to.length,
            i;

        for(i = 0; i < len; i++) {
            var arrItem = this.stringToArray(to[i]);
            this.validateArrayLength(arrItem.length, to[i], 'arrayTo');
            arrayTo[i] = arrItem;
        }
        this.arrayToIndexedInterpolated = this.getIndexedInterpolationData(arrayTo);
    }
    // assume string
    else {
        arrayTo = this.stringToArray(to);
        this.validateArrayLength(arrayTo.length, to, 'arrayTo');
    }
    this.arrayTo = arrayTo;
};

// indexed interpolation data
/**
            ex: [rbga(1,2,3,1), rgba(10,20,30,1), rgba(15,25,35,1)]

            output: interpolatedArrayData = [
                [1, 10, 15, 1],
                [2, 20, 25, 1],
                [3, 30, 35, 1]
            ]

**/
Filter.prototype.getIndexedInterpolationData = function(toArray) {
    var interpolatedArrayData = [],
        ilen = toArray.length,
        i, j;

    for(i = 0; i < ilen; i++) {
        var interpolationStep = toArray[i],
            jLen = interpolationStep.length;

        for(j = 0; j < jLen; j++) {
            if(typeof interpolatedArrayData[j] === 'undefined') {
                interpolatedArrayData[j] = [];
            }
            interpolatedArrayData[j].push(interpolationStep[j]);
        }
    }

    return interpolatedArrayData;
};

Filter.prototype.getUpdatedValue = function(easedProgress, interpolation) {
    var end = this.arrayTo,
        newInterpolatedArray = [],
        out, i, len;

    //check if interpolated array
    if(end[0] instanceof Array) {
        var interpolatedArray = this.arrayToIndexedInterpolated;
        /**
        convert from
            interpolatedArray = [
                [1, 10, 15],
                [2, 20, 25],
                [3, 30, 35]
            ]
            to interpolated array
            [1.5, 2.5, 3.5, 1]
        **/
        len = interpolatedArray.length;
        for(i = 0; i < len; i++) {


            newInterpolatedArray[i] = interpolation(interpolatedArray[i], easedProgress);
        }
        out = this.arrayToString(newInterpolatedArray);
        return out;
    }

    var endArr = [];

    len = end.length;
    for(i = 0; i < len; i++) {
        var startVal = this.arrayFrom[i],
            endVal = end[i];
        endArr.push(startVal + (endVal - startVal) * easedProgress);
    }
    out = this.arrayToString(endArr);
    return out;
};

module.exports = Filter;

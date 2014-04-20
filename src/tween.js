'use strict';
var Easing = require('./easing.js'),
    Interpolation = require('./interpolation.js');
/**
    settings = {
        from: false,
        to: null,
        duration: null,
        repeat: false,
        delay: 0,
        easing: false,
        yoyo: false, // requires repeat to be 1 or greater, reverses animation every other repeat
        interpolation: false,
        onStart: false,
        onYoYo: false,
        onRepeat: false,
        onUpdate: false,
        onComplete: false,
        filters: false
    };
    **/
var Tween = function(object, settings) {
    settings = settings || {};
    this._object = object;
    this._valuesStart = {};

    this._valuesStartRepeat = {};
    this._startTime = null;
    this._onStartCallbackFired = false;
    this._onCompleteCallbackFired = false;
    // if true this tween will be removed from any animation list it is part of
    this.remove = false;

    this._isPlaying = false;
    this._reversed = false;

    this.filters = settings.filters || {};

    this.duration = settings.duration || 1000;
    this.repeat = settings.repeat || 0;
    this.delay = settings.delay || 0;
    this.from = settings.from || false;
    this.to = settings.to || {};
    this.yoyo = settings.yoyo || false;

    this.easing = settings.easing || Easing.Linear.None;
    this.interpolation = settings.interpolation || Interpolation.Linear;

    this.chained = settings.chained || [];

    this.onStart = settings.onStart || false;
    this.onUpdate = settings.onUpdate || false;
    this.onComplete = settings.onComplete || false;
    this.onRepeat = settings.onRepeat || false;
    this.onYoYo = settings.onYoYo || false;
    this.window = false;
};

Tween.prototype.start = function(time) {
    this._isPlaying = true;
    var property;
    // Set all starting values present on the target object
    for(var field in this._object) {
        // if a from object was set, apply those properties to the target object
        if(this.from && typeof this.from[field] !== 'undefined') {
            this._object[field] = this.from[field];
        }
    }
    this._onStartCallbackFired = false;
    this._onCompleteCallbackFired = false;

    if(typeof time !== 'undefined') {
        this._startTime = time;
    } else {
        // allows for unit testing
        var window = this.window || window;
        if(
            typeof window !== 'undefined' &&
            typeof window.performance !== 'undefined' &&
            typeof window.performance.now !== 'undefined'
        ) {
            this._startTime = window.performance.now();
        } else {
            this._startTime = Date.now();
        }
    }
    this._startTime += this.delay;

    for(property in this.to) {
        var toProperty = this.to[property],
            filter = this.filters[property];

        // check if an Array was provided as property value
        if(toProperty instanceof Array) {
            if(toProperty.length === 0) {
                continue;
            }
            // create a local copy of the Array with the start value at the front
            toProperty = [this._object[property]].concat(toProperty);
        }

        // if this property has a filter
        if(filter) {
            filter.start(this._object[property], toProperty);
        }

        this.to[property] = toProperty;
        this._valuesStart[property] = this._object[property];
        this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
    }
    return this;
};

Tween.prototype.update = function(time) {
    if(!this._isPlaying) {
        return true;
    }
    var property;
    if(time < this._startTime) {
        return true;
    }
    if(this._onStartCallbackFired === false) {
        if(this.onStart) {
            this.onStart(this._object, this, 0);
        }
        this._onStartCallbackFired = true;
    }

    var elapsed = (time - this._startTime) / this.duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    var easedProgress = this.easing(elapsed);

    for(property in this.to) {

        var start = this._valuesStart[property] || 0,
            end = this.to[property],
            filter = typeof this.filters[property] !== 'undefined' ? this.filters[property] : false,
            newValue;

        // protect against non numeric properties.
        if(typeof end === "number") {
            newValue = start + (end - start) * easedProgress;
        }
        // handle filtered end values
        else if(filter) {
            newValue = filter.getUpdatedValue(easedProgress, this.interpolation);
        }
        // handle interpolated end values
        else if(end instanceof Array) {
            newValue = this.interpolation(easedProgress, end);
        }

        if(typeof newValue !== 'undefined') {
            this._object[property] = newValue;
        }
    }

    if(this.onUpdate) {
        this.onUpdate(this._object, this, easedProgress);
    }

    if(elapsed == 1) {
        if(this.repeat > 0) {
            if(isFinite(this.repeat)) {
                this.repeat--;
            }
            // reassign starting values, restart by making startTime = now
            for(property in this._valuesStartRepeat) {
                if(this.yoyo) {
                    var tmp = this._valuesStartRepeat[property];
                    this._valuesStartRepeat[property] = this.to[property];
                    this.to[property] = tmp;
                    this._reversed = !this._reversed;
                    if(this.onYoYo){
                        this.onYoYo(this._object, this, 1);
                    }
                }
                this._valuesStart[property] = this._valuesStartRepeat[property];
                if(this.filters[property]) {
                    this.filters[property].start(this._valuesStart[property], this.to[property]);
                }
            }
            this._startTime = time + this.delay;
            if(this.onRepeat){
                this.onRepeat(this._object, this, 1);
            }
            return true;
        } else {
            if(this._onCompleteCallbackFired === false) {
                if(this.onComplete) {
                    this.onComplete(this._object, this, 1);
                }
                this._onCompleteCallbackFired = true;
            }
            return false;
        }
    }
    return true;
};

Tween.prototype.getDuration = function() {
    return (this.delay + this.duration) * (this.repeat || 1);
};

module.exports = Tween;

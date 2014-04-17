'use strict';

var Queue = function(tweens) {
    this.tweens = tweens || [];
    this.window = false;
};
Queue.prototype.window = null;
Queue.prototype.tweens = null;

Queue.prototype.add = function(tween) {
    this.tweens.push(tween);
    return this;
};

Queue.prototype.remove = function(tween) {
    var i = this.tweens.indexOf(tween);
    if(i !== -1) {
        this.tweens.splice(i, 1);
    }
    return this;
};

Queue.prototype.update = function(time) {
    if(this.tweens.length === 0) {
        return false;
    }
    var i = 0;
    if(time === undefined) {
        // allows for unit testing
        var window = this.window || window;

        if(
            typeof window !== 'undefined' &&
            typeof window.performance !== 'undefined' &&
            typeof window.performance.now !== 'undefined'
        ) {
            time = window.performance.now();
        } else {
            time = Date.now();
        }
    }
    while(i < this.tweens.length) {
        var tween = this.tweens[i];
        if(tween.remove || !tween.update(time)) {
            this.tweens.splice(i, 1);
        } else {
            i++;
        }
    }
    return true;
};

Queue.prototype.start = function(time) {
    for(var i = this.tweens.length - 1; i >= 0; i--) {
        this.tweens[i].start(time);
    }
    return this;
};

module.exports = Queue;

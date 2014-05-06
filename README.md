
[![Build Status](https://travis-ci.org/unstoppablecarl/Tweeno.svg?branch=master)](https://travis-ci.org/unstoppablecarl/Tweeno) [![Coverage Status](https://coveralls.io/repos/unstoppablecarl/Tweeno/badge.png)](https://coveralls.io/r/unstoppablecarl/Tweeno)

# Tweeno.js

A super simple, fast and easy to use **tweening engine** which incorporates optimized Robert Penner's equations.

**Tweeno was originally created by refactoring [Tween.js](http://github.com/sole/tween.js)**

[Why I refactored Tween.js](https://github.com/unstoppablecarl/Tweeno/wiki/Why-Refactor-Tween.js%3F)

## Overview

Tweeno is a simple tweening engine designed to be used in html5 game development.

Library objects

- **Queue** manages an array of tween objects updating them every update loop.
- **Tween** handles the change of a target object's numeric property values over a span of time.
- **Filter** assists in tweening numeric values within strings. For example `rgba(10,20,30,1)`.
- **Easing** equations for easing
- **Interpolation** equations for interpolation

## Example Usage

```javascript
    /** nodejs / browserify **/
    var Tween = require('tweeno').Tween,
        Queue = require('tweeno').Queue,
        Easing = require('tweeno').Easing;

    /** browser **/
    var Tween = Tweeno.Tween,
        Queue = Tweeno.Queue,
        Easing = Tweeno.Easing;

    // creating a div to tween
    var targetDiv = document.createElement('div');
        targetDiv.style.cssText = 'position: absolute; left: 50px; top: 300px; font-size: 50px';
        document.body.appendChild(targetDiv);

    // target object with internal state to be tweened
    var target = {
        x: 0,
        y: 0,
        div: targetDiv,
        // updates the div object state every update loop
        update: function(){
            var innerHTML = '',
            innerHTML += 'x: ' + Math.round(this.x);

            this.div.innerHTML = innerHTML;
            this.div.style.left = this.x + 'px';
        }
    };

    // tween settings
    var settings = {
        // set when starting tween
        from: {
            x: 50,
            y: 0
        },
        // state to tween to
        to: {
            x: 400,
            y: 20
        },
        // 2 seconds
        duration: 2000,
        // repeat 2 times
        repeat: 2,
        // do it smoothly
        easing: Easing.Elastic.InOut,
    };

    var queue = new Queue(),
        tween = new Tween(target, settings);

    // add the tween to the queue
    queue.add(tween);

    // start the queue
    queue.start();

    // update loop
    var animate = function() {
        requestAnimationFrame(animate);
        // update the queued tweens
        queue.update();
        // update the target object state
        target.update();
    };

    // start the update loop
    animate();
```

## Installation

**Note:** Tweeno has no dependencies

**Nodejs / Browserify**

`$ npm install tweeno --save`

```javascript
var Tweeno        = require('tweeno'),
    Queue         = Tweeno.Queue,
    Tween         = Tweeno.Tween,
    Filter        = Tweeno.Filter,
    Easing        = Tweeno.Easing,
    Interpolation = Tweeno.Interpolation;
```

**Browser**
```javascript
var Queue         = Tweeno.Queue,
    Tween         = Tweeno.Tween,
    Filter        = Tweeno.Filter,
    Easing        = Tweeno.Easing,
    Interpolation = Tweeno.Interpolation;
```

# Documentation

## Tween

Tween objects manage the state of a `target` object over a span of time.

#### Tween(target, settings)

- `target` object to tween the state of.
```javascript
// example
  var target = {
      x: 0,
      y: 0,
      width: 10,
      height: 10
  };
```
- `settings` *(optional)* contains tween settings.
```javascript
    // example
  var settings = {
      from: {
          x: 10,
          y: 10
      },
      to: {
          x: 100,
          y: 10
      },
      delay: 10,
      duration: 500,
      repeatDelay: 15,
      repeat: 4,

      yoyo: true,

      easing: Tweeno.Easing.Elastic.InOut,
      interpolation: Tweeno.Interpolation.Linear,

      chained: [], // array of tweens to be started when this tween is completed

      onStart:        false, // or: function(target, tween, easedProgress){},
      onYoYo:         false, // or: function(target, tween, easedProgress){},
      onRepeat:       false, // or: function(target, tween, easedProgress){},
      onUpdate:       false, // or: function(target, tween, easedProgress){},
      onComplete:     false, // or: function(target, tween, easedProgress){},
      filters:        false, // or: function(target, tween, easedProgress){},
  };
```

```javascript
var tween = new Tweeno.Tween(target, settings);
```

#### Settings Param


Name           | Type       | Default                        | Description
---------------|------------|--------------------------------|-----------------------------------------------
from           | Object     | `{}`                           | Starting state applied to the target when the tween starts *(when tween.start() is called)*
to             | Object     | `{}`                           | Ending target state to be tweened to
delay          | Number     | `0`                            | Delay in milliseconds *(when `repeat` is set, only the first cycle is affected)*
duration       | Number     | `1000`                         | Tween duration in milliseconds
repeatDelay    | Number     | `0`                            | Delay in milliseconds *(when `repeat` is set, every cycle after the first is affected)*
repeat         | Number     | `false`                        | Number of times to repeat the tween
yoyo           | Bool       | `false`                        | Reverses the tween every other repeat cycle starting with the second cylce *(requires `repeat` to be set)*
easing         | Function   | `Tweeno.Easing.None`           | Easing function, available in Tweeno.Easing *(see list below)*
interpolation  | Function   | `Tweeno.Interpolation.Linear`  | Interpolation function, available in Tween.Interpolation. *(see list below)*
onStart        | Function   | `false`                        | Callback when started
onUpdate       | Function   | `false`                        | Callback when updated
onRepeat       | Function   | `false`                        | Callback when repeated *(end of tween)*
onYoYo         | Function   | `false`                        | Callback when tween reversed *(end of tween, every other repeat cycle)*
onComplete     | Function   | `false`                        | Callback when completed
filters        | Object     | `false`                        | list of Tweeno.Filter objects indexed by the target object property name they are applied to *(see more about filters below)*
chained        | Array      | `false`                        | list of Tween objects to add to the Queue object containing this Tween, when this Tween is complete.

#### Callback Parameters

All callback functions are given the same paramaters.  `onStart`, `onUpdate`, `onRepeat`, `onYoYo`, `onComplete`

Name           | Type       | Description
---------------|------------|-----------------
target         | Object     | The target object of the tween calling the function
tween          | Object     | The Tweeno.Tween object calling the function
easedProgress  | Number     | Number between 0 and 1 showing current progress of the tween *(easing function is already applied)*
progress       | Number     | Number between 0 and 1 showing current progress of the tween

```javascript
var settings = {
    onUpdate: function(target, tween, easedProgress, progress){
        // onUpdate callback code
    }
}
```

#### Tween Settings After Creation

Any of the properties on the settings object can also be assigned or accessed directly on the tween object. They can be safely modified at any time before start() is called.

```javascript
var target = {
    x: 0
};

var settings = {
    to: {
        x: 10
    },
    repeat: 5
};

var tween = new Tweeno.Tween(target, settings);

// set or access any settings properties directly on the tween object before start() is called
tween.duration = 500;
tween.repeat = false;
// start the tween
tween.start();

```
----
#### Tween.start(startTime)

Sets the `startTime` and prepares the Tween to begin.

- `startTime` *(optional)* a timestamp to be used as the Tween  `startTime`.

**Returns:** Tween object instance.

```javascript
var tween = new Tweeno.Tween(target, settings);
    tween.start();
```
**When Tween.start() is Called:**

- The tween `startTime` is set automatically if none was specified.
- The `from` object properties are applied to the `target`.

----

#### Tween.update(currentTime)

Updates the state of the Tween's `target`. The `currentTime` is compared to the `startTime` to determine the progress of the Tween. `Tween.update()` should be called every `requestAnimationFrame()` update loop. It is typically called by the Queue object containing the Tween via `queue.update()`.

- `currentTime` *(optional)* a timestamp to be used as the tween  **start time**.

**Returns:** `true` if the Tween has not completed,  `false` if it has.

```javascript
var tween = new Tweeno.Tween(target, settings);
tween.update();
```

###### When Tween.update() is Called:

- The `onStart` callback is called ( if not already called ).
- The `onUpdate` callback is called.
- The `onRepeat` callback is called ( if the end of the tween has been reached and the tween is set to repeat ).
- The `onYoYo` callback is called ( if the end of the tween has been reached and the tween is set to repeat  and yoyo).
- The `onComplete` callback is called ( if the end of the tween has been reached ).

----

#### Tween.getDuration()

**Returns:** The total duration of the tween [ ( delay + duration) * repeat ]

```javascript
    var tween = new Tweeno.Tween(target, settings);
    var duration = tween.getDuration();
```

## Queue

A Queue object manages an array of Tweens. The Queue calls the `tween.update()` method of the tweens it contains every `requestAnimationFrame()` loop. Completed tweens are automatically removed from the queue.

#### Queue(tweens)

- `tweens` *(optional)* array of tweens to add.

```javascript
    var tweens = [] // optional
    var queue = new Tweeno.Queue(tweens);
```

----

#### Queue.add(tween)
Adds a tween object to the queue.

- `tween` Tween to add

**Returns:** Queue object instance.

```javascript
var queue = new Tweeno.Queue();
var tween = new Tweeno.Tween(target, settings);
queue.add(tween);
```

-----

#### Queue.remove(tween)
Removes a tween object from the queue.

- `tween` Tween to remove

**Returns:** Queue object instance.

```javascript
queue.remove(tween);
```
**Note:** Setting `tween.remove = true` will remove the tween from any queue it is in during the next `queue.update()`.

----

#### Queue.start(startTime)
Calls `tween.start()` on all Tweens in the queue, passing the `startTime` to each `tween.start(startTime)` in the Queue.

- `startTime` *(optional)* a timestamp to be used as the `startTime` for all Tweens in the Queue.

**Returns:** Queue object instance.

```javascript
var queue = new Tweeno.Queue();
var tween = new Tweeno.Tween(target, settings);
queue.add(tween);
queue.start();
```

###### When Queue.start() is Called:

- The tween `startTime` is set automatically if none was specified.

----

#### Queue.update(currentTime)

Calls `tween.update()` on all Tweens in the queue, passing the `currentTime` to each `tween.update(currentTime)` in the Queue.

- `currentTime` *(optional)* a timestamp to be used as the `tween.update(currentTime)`.


**Returns:** `true` if the Queue has any Tweens or `false`.

```javascript
var queue = new Tweeno.Queue();
var tween = new Tweeno.Tween(target, settings);
queue.add(tween);
queue.start();
queue.update();
```

###### When Queue.update() is Called:

- Tweens that are completed or have `tween.remove = true` are removed from the queue.

----

## Filter

Filters allow Tween objects to tween the numeric values within a string.

## Filter(settings)

- `settings` *(optional)* contains filter settings.
```javascript
var settings = {
      placeholder: '%',
      format: 'rgba(%,%,%,%)',
      placeholderTypes: ['int', 'int', 'int', 'float']
};
```

```javascript
var filter = new Tweeno.Filter(settings);
```

#### Settings Param

An object containing the settings for the tween object


Name           | Type       | Default         | Description
---------------|------------|-----------------|----------------------------------------------
placeholder    | String     | `%`             | Placeholder for numeric values within the string
format         | String     | `rgba(%,%,%,%)` | Format of the string to be filtered with placeholders where numeric values are to be placed
placeholderTypes | Array    | `['int', 'int', 'int', 'float']` | Array of strings `'int'` or `'float'` specifying the data type of the placeholder values, applied to each placeholder value in order of array index. **example:** `['int', 'int', 'int', 'float']` is equivalent to `rgba(1, 2, 3, 0.75)`

#### Usage

```javascript
var queue = new Queue(),
    filter = new Filter({
        placeholder: '%',
        format: 'rgba(%,%,%,%)',
        placeholderTypes: ['int', 'int', 'int', 'float']
    }),
    target = {
        color: 'rgba(255,0,0,0)'
    },
    settings = {
        to: {
            color: 'rgba(200,100,150,1)'
        },
        filters: {
            color: filter
        },
        duration: 500
    },
    tween = new Tween(target, settings);

queue.add(tween);
queue.start();

```

----

#### Filter.stringToArray(str)

Converts a string to an array of numeric values.

- **`str`** string to convert.

**Returns:** `array` of numeric values.

```javascript
    var settings = {
        placeholder: '%',
        format: 'rgba(%,%,%,%)'
    };
    var filter = new Tweeeno.Filter(settings);
    var str = 'rgba(5,6,7,1)';
    var arr = filter.stringToArray(str); // [5, 6, 7, 1]
```

----

#### Filter.arrayToString(arr)

Converts an array of numeric values to a string matching the `format` of the filter.

- **`arr`** array to convert.

**Returns:** formatted `string`.

```javascript
    var settings = {
        placeholder: '%',
        format: 'rgba(%,%,%,%)'
    };
    var filter = new Tweeeno.Filter(settings);
    var arr = [5, 6, 7, 1];
    var str = filter.arrayToString(arr); // 'rgba(5,6,7,1)'
```


### Changed from [Tween.js](http://github.com/sole/tween.js)

**Refactored**

- Simplified and better performing api
- Extendable Objects with prototype properties and methods
- Separation of Tween and Queue objects
- Portability of config data via settings object
- Exposed property values
- More consistent callbacks with more params passed
- Flexibility when delaying and repeating
- Documentation
- Unit Tests

**New Features**

- String value filtering ( `rgba(1,2,3,1)` ) with interpolation support
- npm, commonJS, AMD module loading

#### Easing Function Reference

- Tweeno.Easing.Linear.None

- Tweeno.Easing.Quadratic.In
- Tweeno.Easing.Quadratic.Out
- Tweeno.Easing.Quadratic.InOut

- Tweeno.Easing.Cubic.In
- Tweeno.Easing.Cubic.Out
- Tweeno.Easing.Cubic.InOut

- Tweeno.Easing.Quartic.In
- Tweeno.Easing.Quartic.Out
- Tweeno.Easing.Quartic.InOut

- Tweeno.Easing.Quintic.In
- Tweeno.Easing.Quintic.Out
- Tweeno.Easing.Quintic.InOut

- Tweeno.Easing.Sinusoidal.In
- Tweeno.Easing.Sinusoidal.Out
- Tweeno.Easing.Sinusoidal.InOut

- Tweeno.Easing.Exponential.In
- Tweeno.Easing.Exponential.Out
- Tweeno.Easing.Exponential.InOut

- Tweeno.Easing.Circular.In
- Tweeno.Easing.Circular.Out
- Tweeno.Easing.Circular.InOut

- Tweeno.Easing.Elastic.In
- Tweeno.Easing.Elastic.Out
- Tweeno.Easing.Elastic.InOut

- Tweeno.Easing.Back.In
- Tweeno.Easing.Back.Out
- Tweeno.Easing.Back.InOut

- Tweeno.Easing.Bounce.In
- Tweeno.Easing.Bounce.Out
- Tweeno.Easing.Bounce.InOut

#### Interpolation Function Reference

- Tweeno.Interpolation.Linear
- Tweeno.Interpolation.Bezier
- Tweeno.Interpolation.CatmullRom
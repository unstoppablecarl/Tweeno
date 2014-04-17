[![Build Status](https://travis-ci.org/unstoppablecarl/Tweeno.svg?branch=master)](https://travis-ci.org/unstoppablecarl/Tweeno)

Tweeno.js
========

#### Javascript Tweening Engine ####

Tweeno is a refactored and improved version of [Tween.js](http://github.com/sole/tween.js)

A super simple, fast and easy to use tweening engine which incorporates optimized Robert Penner's equations.


**Refactored**

- Simplified and better performing api
- Extendable Objects with prototype properties and methods
- Separation of Tween and Queue objects
- Portability of config data via settings object
- Exposed property values
- More consistent callbacks with more params passed
- Documentation
- Unit Tests

**New Features**

- String value filtering ( `rgba(1,2,3,1)` ) with interpolation support
- npm, commonJS, AMD module loading

## Tween

Tween objects manage the state of a target object over a span of time.

```javascript
    // target object is required, settings object is optional
    var tween = new Tweeno.Tween(target, settings);
```

#### Target Param

Any object with properties to be tweened.

```javascript
    // example
    var target = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
    };
```

#### Settings Param

An object containing the settings for the tween object.

```javascript
    // example
    var settings = {
        from: {
            x: 10,
            y: 10
        },
        to: {
            x: 100,
            y: 100
        },
        duration: 500,
        repeat: 4,
        delay: 10,
        yoyo: true,

        easing: Tweeno.Easing.Elastic.InOut,
        interpolation: Tweeno.Interpolation.Linear,

        onStart:        false, // or: function(target, tween, easedProgress){},
        onYoYo:         false, // or: function(target, tween, easedProgress){},
        onRepeat:       false, // or: function(target, tween, easedProgress){},
        onUpdate:       false, // or: function(target, tween, easedProgress){},
        onComplete:     false, // or: function(target, tween, easedProgress){},
        filters:        false, // or: function(target, tween, easedProgress){},
    };
```

Name           | Type       | Default                        | Description
---------------|------------|--------------------------------|-----------------------------------------------
from           | Object     | `{}`                           | Starting state applied to the target when the tween starts *(when tween.start() is called)*
to             | Object     | `{}`                           | Ending target state to be tweened to
duration       | Number     | `1000`                         | Tween duration in milliseconds
repeat         | Number     | `false`                        | Number of times to repeat the tween
delay          | Number     | `0`                            | Delay in milliseconds *(delays every repeat when `repeat` is set to a number)*
yoyo           | Bool       | `false`                        | Reverses the tween every other repeat cycle starting with the second cylce *(requires `repeat` to be set)*
easing         | Function   | `Tweeno.Easing.None`           | Easing function, available in Tweeno.Easing *(see list below)*
interpolation  | Function   | `Tweeno.Interpolation.Linear`  | Interpolation function, available in Tween.Interpolation. *(see list below)*
onStart        | Function   | `false`                        | Callback when started
onUpdate       | Function   | `false`                        | Callback when updated
onRepeat       | Function   | `false`                        | Callback when repeated *(end of tween)*
onYoYo         | function   | `false`                        | Callback when tween reversed *(every other repeat cycle)*
filters        | Object     | `false`                        | list of Tweeno.Filter objects indexed by the target object property name they are applied to *(see more about filters below)*

#### Callback Parameters

All callback functions are given the same paramaters.  `onStart`, `onUpdate`, `onRepeat`, `onYoYo`

Name           | Type       | Description
---------------|------------|-----------------
target         | Object     | The target object of the tween calling the function
tween          | Object     | The Tweeno.Tween object calling the function
easedProgress  | Number     | Number between 0 and 1 showing current progress of the tween *(easing function is already applied)*

```javascript
    var settings = {
        onUpdate: function(target, tween, easedProgress){
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

#### Tween.start()

Sets the start time and prepares the tween to begin.

**Returns:** Tween object instance.

```javascript
    var tween = new Tweeno.Tween(target, settings);
    tween.start();
```
###### When Tween.start() is Called:

- The tween start time is set automatically. Optionally, pass a timestamp to be used as the start time `tween.start(time)`.
- The `from` object properties are applied to the target *( if set in *`settings.from`* or *`tween.from`* )*.

#### Tween.update()

Updates the state of the Tween's target object. Should be called every  `requestAnimationFrame()` *(usually automatically by the Queue object it is added to)*.

**Returns:** `true` if the tween has not completed,  `false` if it has.

```javascript
    var tween = new Tweeno.Tween(target, settings);
    tween.update();
```

###### When Tween.update() is Called:

- The tween compares the **current time** to the start time to determine the progress of the tween. Optionally, pass a timestamp to be used as the **current time**. `tween.update(time)`.
- The `onStart` callback is called ( if not already called ).
- The `onUpdate` callback is called.
- The `onRepeat` callback is called ( if the end of the tween has been reached and the tween is set to repeat ).
- The `onYoYo` callback is called ( if the end of the tween has been reached and the tween is set to repeat  and yoyo).
- The `onComplete` callback is called ( if the end of the tween has been reached ).

#### Tween.getDuration()

**Returns:** The total duration of the tween [ ( delay + duration) * repeat ]

```javascript
    var tween = new Tweeno.Tween(target, settings);
    var duration = tween.getDuration();
```

## Queue
Queues manages an array of Tweens. Tween objects are added to the queue. The Queue calls the tween.update() method of tweens added to it every `requestAnimationFrame()` loop. Completed tweens are automatically removed from the queue.

```javascript
    var tweens = [] // optional
    var queue = new Tweeno.Queue(tweens);
```
#### Queue.add()
Adds a tween object to the queue.

**Returns:** Queue object instance.

```javascript
    var queue = new Tweeno.Queue();
    var tween = new Tweeno.Tween(target, settings);
    queue.add(tween);
```

#### Queue.remove()
Removes a tween object from the queue.

**Returns:** Queue object instance.

```javascript
    queue.remove(tween);
```
Setting `tween.remove = true` will remove the tween from any queue it is in during the next `queue.update()`.

#### Queue.start()
Calls `tween.start()` on all Tweens in the queue.

**Returns:** Queue object instance.

```javascript
    var queue = new Tweeno.Queue();
    var tween = new Tweeno.Tween(target, settings);
    queue.add(tween);
    queue.start();
```

###### When Queue.start() is Called:

- The tween **start time** is set automatically. Optionally, pass a timestamp to be used as the **start time** `queue.start(time)` it will be passed to each `tween.start(time)` in the queue.

#### Queue.update()
Calls `tween.update()` on all Tweens in the queue.

**Returns:** `true` if the Queue has any tweens or `false`.

```javascript
    var queue = new Tweeno.Queue();
    var tween = new Tweeno.Tween(target, settings);
    queue.add(tween);
    queue.start();
    queue.update();
```

###### When Queue.update() is Called:

- The queue calls `queue.update(time)` on all tweens in the queue. Optionally, pass a timestamp to be used as the **current time**. It will be passed to each `tween.update(time)`.
- Tweens that are completed or have `tween.remove = true` are removed from the queue.

## Filter

Filters allow Tween objects to tween the numeric values within a string.

```javascript
    var filter = new Tweeno.Filter(settings);
```

#### Settings Param

An object containing the settings for the tween object

```javascript
    var settings = {
        placeholder: '%',
        format: 'rgba(%,%,%,%)'
    };
```

Name           | Type       | Default         | Description
---------------|------------|-----------------|----------------------------------------------
placeholder    | String     | `%`             | Placeholder for numeric values within the string
format         | String     | `rgba(%,%,%,%)` | Format of the string to be filtered with placeholders where numeric values are to be placed

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

#### Filter Use Example

```javascript

    var target = {
        color: 'rgba(0,0,0,1)'
    };

    var filterSettings = {
        placeholder: '%',
        format: 'rgba(%,%,%,%)'
    };

    var colorFilter = new Tweeno.Filter(filterSettings);

    var tweenSettings = {
        to: {
            color: 'rgba(10,20,30,1)'
        },
        duration: 500,
        filters: {
            color: colorFilter
        }
    };

    var tween = new Tweeno.Tween(target, tweenSettings);

    var queue = new Tweeno.Queue();

    queue.add(tween);

    queue.start();
```

### Quickstart Example ###

```javascript

    /** node js **/
    var Tween = require('tweeno').Tween,
        Queue = require('tweeno').Queue,
        Easing = require('tweeno').Easing;

    /** browser **/
    var Tween = Tweeno.Tween,
        Queue = Tweeno.Queue,
        Easing = Tweeno.Easing;

    var targetDiv = document.createElement('div');
        targetDiv.style.cssText = 'position: absolute; left: 50px; top: 300px; font-size: 50px';
        document.body.appendChild(targetDiv);

    var target = {
        x: 0,
        y: 0,
        div: targetDiv,
        update: function(){
            var repeatNumber = settings.repeat + 1 - tween.repeat;
            this.div.innerHTML = 'x: ' + Math.round(this.x);
            this.div.innerHTML += '<br>';
            this.div.innerHTML += 'repeat #' + repeatNumber;
            this.div.style.left = this.x + 'px';
        }
    };

    var settings = {
        // set when starting tween
        from: {
            x: 50,
            y: 0
        },
        to: {
            x: 400,
            y: 20
        },
        duration: 2000,
        repeat: 2,
        easing: Easing.Elastic.InOut,

    };

    var tween = new Tween(target, settings);
    var queue = new Queue();

    queue.add(tween);
    queue.start();

    var animate = function() {
        requestAnimationFrame(animate);
        queue.update();
        target.update();
    };

    animate();
```

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

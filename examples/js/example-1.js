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
        yoyo: true,
        duration: 2000,
        repeat: 4,
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
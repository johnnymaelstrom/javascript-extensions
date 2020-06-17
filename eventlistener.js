console.log("Adding listeners");

var keepTrying = function (test, callback, sleep, maxAttempts) {
    if (typeof (sleep) == 'undefined') {
        sleep = 100;
    }
    var totalAttempts = 0;
    var args = Array.prototype.slice.call(arguments, 2);
    var incrementAttempts = function () {
        totalAttempts++;
        if (typeof maxAttempts !== 'undefined') {
            if (totalAttempts > maxAttempts) {
                clearInterval(timer);
                console.log('Reached maximum number of attempts.  Going to stop checking.');
            }
        }
    };
    var timer = setInterval(function () {
        try {
            if (test.apply(null, args)) {
                clearInterval(timer);
                // console.log('done trying: '+test);
                callback();
            } else {
                // console.log('tried: '+test);
                incrementAttempts();
            }
        } catch (e) {
            console.log('Failure in check: ' + e);
            incrementAttempts();
        }
    }, sleep);
};
var when = function (test, run, sleep, maxAttempts) {
    var args = Array.prototype.slice.call(arguments, 2);
    keepTrying(test, function () {
            run.apply(null, args);
        },
        sleep, maxAttempts);
};

when(function () {
    return !!jQuery(".flow-product__wrapper");
}, function () {
   
    jQuery("span.navheader__mityousee-icon").mousedown(function () {
        var payload = {
            "tealium_event": "login",
            "timestamp": new Date(),
        };
    
        console.log("Sending payload for : " + payload.tealium_event);
        utag.link(payload);
    
    });
    
    jQuery(".flow-product__wrapper").mousedown(function () {
        var monthly_price = jQuery(".flow-product__text-price",this)[0].innerText;
        var points = jQuery(".number",this)[0].innerText;
        
        var payload = {
            "tealium_event": "subscription_price_check",
            "timestamp": new Date(),
            "monthly_price": monthly_price,
            "points": points
        };
    
        console.log("Sending payload for : " + payload.tealium_event);
        utag.link(payload);
    });

}, 200, 100);
console.log("Listener added");
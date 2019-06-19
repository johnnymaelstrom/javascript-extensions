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
    return !!window.jQuery;
}, function () {
    //Begin k_uni listeners
    console.log("Adding category listener");
    jQuery(document.body).mousedown("._0b9b span", function () {
        var payload = {
            "tealium_event": "sport_category_view",
            "user_id": "123456",
            "timestamp": new Date(),
            "sport_category": "football",
            "button_clicked": jQuery(this)[0].innerText

        };

        console.log("Sending payload for : " + payload.tealium_event);
        utag.link(payload);

    });
    
    console.log("Adding sporting event listener");    
    jQuery(document.body).mousedown(".KambiBC-event-item__event-info", function () {
        var payload = {
            "tealium_event": "sport_event_view",
            "user_id": "123456",
            "timestamp": new Date(),
            "sport_event": "football",
            "competitor_1": "",
            "competitor_2": "",
            "button_clicked": jQuery(this)[0].innerText

        };

        console.log("Sending payload for : " + payload.tealium_event);
        utag.link(payload);

    });
    // End k_uni listeners

    // Begin ppbf_listener

    // End ppbf_listener


}, 200, 100);
console.log("Listener added");
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


    //Sports Category Listener
    when(function () {
        return !!jQuery("._6ebb").length;
    }, function () {
        console.log("Adding sport_category_view to element: " + jQuery("._6ebb").length);
        jQuery("._6ebb", document.body).on("mousedown", function (event) {
            console.log(event.currentTarget.innerText);
            var payload = {
                "tealium_event": "sport_category_view",
                "Sport_Type": event.currentTarget.innerText
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });
    }, 200, 1000);



    // Sports Event View
    when(function () {
        return !!jQuery(".KambiBC-event-participants").length;
    }, function () {
        console.log("Adding sport_event_view to element: " + jQuery(".KambiBC-event-participants").length);
        jQuery(".KambiBC-event-participants", document.body).on("mousedown", function (event) {

            var sport_type = jQuery("._39a7")[0].innerText;
            console.log(sport_type);
            var payload = {
                "tealium_event": "sport_event_view",
                "Sport_Type": sport_type,
                "sport_event": event.currentTarget.children[0].innerText + " v " + event.currentTarget.children[1].innerText,
                "competitor1": event.currentTarget.children[0].innerText,
                "competitor2": event.currentTarget.children[1].innerText
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });
    }, 200, 1000);

    // Join Now 1
    when(function () {
        return !!jQuery(".register-button-container").length;
    }, function () {
        console.log("Adding sport_join_now to element: " + jQuery(".register-button-container").length);
        jQuery(".register-button-container", document.body).on("mousedown", function (event) {
            var sport_type = jQuery("._39a7")[0].innerText;
            var payload = {
                "tealium_event": "sport_join_now",
                "Sport_Type": sport_type
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });

    }, 200, 1500);

    // Marketing Opt-in
    when(function () {
        return !!jQuery(".field-label").length;
    }, function () {
        console.log("Adding sport_marketing_opt_in to element: " + jQuery("field-label").length);
        jQuery(".field-label", document.body).on("mousedown", function (event) {
            console.log(event.currentTarget.innerText);
            if (event.currentTarget.innerText.includes("Accept")) {
                var payload = {
                    "tealium_event": "sport_marketing_opt_in"
                };

                console.log("Sending payload for : " + payload.tealium_event);
                utag.link(payload);
            }
        });
    }, 200, 1500);

    // Join Now 2
    when(function () {
        return !!jQuery(".submit-button").length;
    }, function () {
        console.log("Adding sports_join_now_2 to element: " + jQuery(".submit-button").length);
        jQuery(".submit-button", document.body).on("mousedown", function (event) {
            var payload;
            if (event.currentTarget.name.includes("continue-registration")) {
                var registration_stage;
                switch (window.location.href.split("#")[1]) {
                    case "registrationStep:0":
                        registration_stage = 0;
                        break;
                    case "registrationStep:1":
                        registration_stage = 1;
                        break;
                    case "registrationStep:2":
                        registration_stage = 2;
                        break;
                    case "registrationStep:3":
                        registration_stage = 3;
                        break;
                    case "registrationStep:4":
                        registration_stage = 4;
                        break;
                    default:
                        registration_stage = 0;
                        // code block
                }
                if (jQuery("#email")[0].value !== "") {
                    payload = {
                        "tealium_event": "sports_join_now_2",
                        "customer_email": jQuery("#email")[0].value,
                        "registration_stage": registration_stage
                    };
                } else {
                    payload = {
                        "tealium_event": "sports_join_now_2",
                        "registration_stage": registration_stage
                    };
                }


                console.log("Sending payload for : " + payload.tealium_event);
                utag.link(payload);
            } else if (event.currentTarget.name.includes("submit-registration")) {
                payload = {
                    "tealium_event": "sport_join_now_3"
                };

                console.log("Sending payload for : " + payload.tealium_event);
                utag.link(payload);
            }
        });


    }, 200, 1500);


    // Start Deposit Link
    when(function () {
        return !!jQuery(".deposit-button").length;
    }, function () {
        console.log("Adding sport_start_deposit to element: " + jQuery(".deposit-button").length);
        jQuery(".deposit-button", document.body).on("mousedown", function (event) {
            var payload = {
                "tealium_event": "sport_start_deposit"
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });

    }, 200, 1000);

    // Save Comms Preferences

    when(function () {
        return !!jQuery("._7byueq").length;
    }, function () {
        console.log("Adding sport_marketing_opt_in/out to element: " + jQuery("._7byueq-button").length);
        jQuery("._7byueq", document.body).on("mousedown", function (event) {
            var payload;
            var opt_out = jQuery("#cosent-NO-option")[0].checked;
            if (!opt_out) {
                payload = {
                    "tealium_event": "sport_marketing_opt_in"
                };
            } else {

                payload = {
                    "tealium_event": "sport_marketing_opt_out"
                };
            }

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });

    }, 200, 1000);

    // Add Bet/Odd Clicked
    when(function () {
        return !!jQuery(".avb-item__btn-odds").length;
    }, function () {
        console.log("Adding sport_bet_added to element: " + jQuery(".avb-item__btn-odds").length);
        jQuery(document.body).on("mousedown", ".avb-item__btn-odds", function (event) {

            var sport_type = jQuery(".sport-header__top-section-name")[0].innerText;
            var sport_event = jQuery(".ui-scoreboard-coupon-template__content--vertical-aligner")[0].innerText + " v " + jQuery(".ui-scoreboard-coupon-template__content--vertical-aligner")[2].innerText;
            console.log(sport_type);
            var payload = {
                "tealium_event": "sport_bet_added",
                "user_id": "123456",
                "timestamp": new Date(),
                "Sport_Type": sport_type,
                "sport_event": sport_event
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });
    }, 200, 100);

    // Remove Bet from Betslip
    when(function () {
        return !!jQuery(".close-icon").length;
    }, function () {
        console.log("Adding sport_bet_removed to element: " + jQuery(".close-icon").length);
        jQuery(document.body).on("mousedown", ".close-icon", function (event) {

            var payload = {
                "tealium_event": "sport_bet_removed",
                "user_id": "123456",
                "timestamp": new Date()
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });

    }, 200, 1000);

    // Betslip Clear
    when(function () {
        return !!jQuery(".clear-all-bets").length;
    }, function () {
        console.log("Adding sport_betslip_cleared to element: " + jQuery(".clear-all-bets").length);
        jQuery(document.body).on("mousedown", ".clear-all-bets", function (event) {

            var payload = {
                "tealium_event": "sport_betslip_cleared",
                "user_id": "123456",
                "timestamp": new Date()
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });
    }, 200, 1000);


    // Login
    when(function () {
        return !!jQuery("#login").length;
    }, function () {
        jQuery(document.body).on("mousedown", "#login", function (event) {

            var customer_email = jQuery("#username")[0].value;
            var payload = {
                "tealium_event": "sport_login",
                "customer_email": customer_email,
                "user_id": "123456",
                "timestamp": new Date()
            };

            console.log("Sending payload for : " + payload.tealium_event);
            utag.link(payload);
        });
    }, 200, 1000);


}, 200, 100);
console.log("Listener added");
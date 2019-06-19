document.getElementById('dtmEventTarget').addEventListener('sportbookEvents',
    function (evt) {
        var eventData = evt.detail;
        var userId = eventData.userId;
        if(!userId){
            userId = "BLANK";
        }
        var payload = {
            'tealium_event': 'category_view',
            'user_id': userId,
            'timestamp': new Date()
        };
        /*
        if (eventData.fields && eventData.fields.constructor === Array) {
            console.log("It works");
            for (var i = 0; i < eventData.fields.length; i++) {
                var f = eventData.fields[i];
                var k = f.fieldId;
                var v = f.fieldValue;
                payload['field_' + k] = v;
            }
        }
        */
        utag.link(payload);
    });
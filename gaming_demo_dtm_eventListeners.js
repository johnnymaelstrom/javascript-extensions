document.getElementById('dtmEventTarget').addEventListener('allSportsNavigation',
    function (evt) {
        var eventData = evt.detail;
        var payload = {
            'tealium_event': 'category_view',
            'adf_page_name': "Registration complete",
            'user_id': eventData.userId,
            'timestamp': new Date(),
            'adf_channel': _satellite.getVar("campaignTrackingCode")
        };
        if (eventData.fields && eventData.fields.constructor === Array) {
            for (var i = 0; i < eventData.fields.length; i++) {
                var f = eventData.fields[i];
                var k = f.fieldId;
                var v = f.fieldValue;
                payload['field_' + k] = v;
            }
        }
        utag.link(payload);
    });
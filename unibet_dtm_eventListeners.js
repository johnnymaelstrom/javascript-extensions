document.getElementById('dtmEventTarget').addEventListener('GameLaunch',
    function(evt) {
        var eventData = evt.detail;
        var f = function() {
            utag.link({
                'event_name': 'GameLaunch',
                'adf_page_name': 'Game Launch: eventData: ' + JSON.stringify(eventData),
                'adb_location': eventData.location,
                'adb_game_info': 'uniquegameId: ' + eventData.uniquegameId + ', gameName: ' + eventData.gameName,
                'adb_money_mode': 'realMoneyMode: ' + eventData.realMoneyMode
            });
        };
        window.utag.kindred_queue = window.utag.kindred_queue || [];
        window.utag.kindred_queue.push(f);
    });


document.getElementById('dtmEventTarget').addEventListener('depositRequested',
    function(evt) {
        var eventData = evt.detail;
        var noOfDeposits = eventData.noOfDeposits;
        if (eventData.status === "Redirected") {
            noOfDeposits++; //payment has not incremented counter yet!
        }

        var depositUrlName;
        if (noOfDeposits === 1) {
            depositUrlName = "First deposit intent";
        } else if (noOfDeposits > 1) {
            depositUrlName = "Further deposit intent";
        }

        utag.link({
            'event_name': 'depositRequested',
            'adf_page_name': depositUrlName,
            'deposit_amount': eventData.amount,
            'transaction_id': eventData.paymentTransactionId,
            'user_id': _satellite.getVar('cms.user.customerId'),
            'deposit_number': noOfDeposits,
            'timestamp': new Date(),
            'adf_channel': _satellite.getVar("campaignTrackingCode"),
            'currency': eventData.currency,
            'paymentMethodClassification': eventData.paymentMethodClassification,
            'paymentMethod': eventData.paymentMethod
        });
    });

document.getElementById('dtmEventTarget').addEventListener('registrationSuccessful',
    function(evt) {
        var eventData = evt.detail;
        var payload = {
            'event_name': 'registrationSuccessful',
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

document.getElementById('dtmEventTarget').addEventListener('pageLoaded',
    function(evt) {
      utag.pageLoadedFallback = true;
        utag.view({
            'event_name': 'pageLoaded',
            'adf_channel': _satellite.cookie.get("AdformChannel"),
            'user_id' : window.cms.user.customerId,
            'is_app' : window.cms.device.isApp
        });
    });


window.addEventListener("load", function(event) {
  if(!utag.pageLoadedFallback) {
    utag.pageLoadedFallback = true;
        utag.view({
            'event_name': 'pageLoaded',
    	    'page_loaded_fallback' : true,
    	    'adf_channel': _satellite.cookie.get("AdformChannel"),
    	    'user_id' : window.cms.user.customerId,
            'is_app' : window.cms.device.isApp
        });
  }
});

/*
document.getElementById('dtmEventTarget').addEventListener('loginSuccess',
    function(evt) {
        var eventData = evt.detail;

        utag.link({
            'event_name': 'loginSuccess',
            'track_link_name': "Logged in - success",
            'user_id': eventData.userId,
            'timestamp': new Date(),
            'adb_session_id': eventData.sessionId,
            'adf_channel': _satellite.readCookie("AdformChannel"),
            'adf_page_name': "login succesfull" //sic
        });
    });
*/


// general-info/gamblingprofile, gambling self assessment test
document.getElementById('dtmEventTarget').addEventListener('selfTestCompleted',
    function(evt) {
        var eventData = evt.detail;

        utag.link({
            'event_name': 'selfTestCompleted',
            'track_link_name': "selfTestCompleted",
            'user_id': eventData.userId,
            'timestamp': new Date(),
            'self_test_result' : eventData.result,
            'is_app' : window.cms.device.isApp
        });
    });




    
/*Frankel Finding Methods and Virtual pageViews & promotions - fraser 10th October  */
/*To link the payload with the UI actions events are dispatched from Launch */
document.getElementById('dtmEventTarget').addEventListener('promoDetailsAction',
    function(evt) {
    var isItaly = false;
    var langVariant = "promotions"
    if(document.location.host==="www.unibet.it") {
      isItaly = true;
      langVariant = 'promozioni';
    }
    var eventData = evt.detail;
    var buttonName = eventData.button;
    var promoName = eventData.promoName; 
    var optIn = eventData.isOptIn; 
    var isGame = eventData.isGame; 
    var isCalendar = eventData.modal; 
    var modalTitle = eventData.title; 
    var day = eventData.day; 
    var payload = {
        'event_name': 'promoActionClick',
        'adb_timestamp':Math.round(new Date().getTime()/1000),
        'location':_satellite.getVar("browserLocale"),
        'adb_domain':window.location.hostname,
        'timestamp': new Date(),
        'adf_page_name': 'Promotion Action: eventData: ' + JSON.stringify(eventData),
        'adb_promotion_action_id': buttonName
    };
    payload.product_categories = [];
    payload.product_ids = [];
    payload.product_quantities = [];
    payload.product_prices = [];
    if (isCalendar === "shown"){
        payload.adb_modal_action = 'viewed';
    }else if (isCalendar === "clicked"){ 
        payload.adb_modal_action = 'clicked';
    }
    if (isCalendar === "shown"||isCalendar === "clicked"){
        payload.adb_calendar_day = day+'';
    }
    payload.product_categories.push((isCalendar === "shown")?'promotionsAdventCalendar' :'promotionsProfile');
    if (window.cms.lobby.name.indexOf("Tournaments")!==-1 || typeof window.cms.widget.Game === "function" || isCalendar === "shown" || isCalendar === "clicked"){
       payload.product_ids.push( ( (window.cms.lobby.name.indexOf("Tournaments")!==-1) ?
       ("Tournament Lists:"+document.location.href.split('#')[1]):
       (isCalendar === "shown" || isCalendar === "clicked")?(promoName.split('/').join(':')):("Game:"+_satellite.gameData.gameName + ":" +_satellite.gameData.gameId + ":" + _satellite.gameData.gameType) ) )
       if (optIn && document.location.pathname.indexOf(langVariant) === -1){payload.adb_event8_filler = 'true';}
    }else{
    payload.product_ids.push(((isItaly) ? (document.location.href.indexOf('promozioni')!==-1)?
    document.location.href.split('https://www.unibet.it')[1].split('/promozioni/')[1].split('/').join(':').split('#')[0].split('?')[0]:
    document.location.href.split('https://www.unibet.it/')[1]:document.location.href.split('/promotions/')[1].split('/').join(':').split('#')[0].split('?')[0]));
    }
    payload.product_quantities.push('1')
    payload.product_prices.push('0')
    utag.link(payload);
});


document.getElementById('dtmEventTarget').addEventListener('frankelPageView',
    function(evt) {
    
    var eventData = evt.detail;
    var position = eventData.index;
    var menu = eventData.menu;
    var commentary = eventData.commentary;
    var payload = {
        'event_name': 'frankelPageView',
        'adb_timestamp':Math.round(new Date().getTime()/1000),
        'location':_satellite.getVar("browserLocale"),
        'adb_domain':window.location.hostname,
        'timestamp': new Date()
    };
    utag.view(payload);
});

/* Betslip Cleanser Adds spacing in string locations */
function betSlipCleanser(text) {
  return text.replace(/(^|£+|To+|E\/W+)/g, " $1");
}
  
/* Clean characters */
function replaceChar(input) {
  return input.replace(/[a-zA-Z]+/g,"");
}

/* Clean Times */
function replaceTime(input) {
  return input.replace(/[0-9:]+/g,"");
}

/* Replace line breaksand and/or white space */
function replaceLines(input, useWhite) {
    if (useWhite){
      return input.replace(/(\r\n|\s|\n|\r)/gm,"");
    }else{
      return input.replace(/(\r\n|\n|\r)/gm,"");
    }
}
/* Output Betslip values into a sanitised array */
function betSlipUtil(element) {
  var betSlipValues = [];
    for (var fk = 0; fk < element.length; fk++){

      for (var fg = 0; fg < element[fk].children.length; fg++) {

        betSlipValues.push(betSlipCleanser(element[fk].children[fg].innerText));

      }
    }
    return betSlipValues;
}

document.getElementById('dtmEventTarget').addEventListener('betAdd',
    function(evt) {

        var eventData = evt.detail;
        var domain = _satellite.getVar("Domain");

        if(typeof eventData!=="undefined"){
          
          /* Get betslip values from page */
          /* DELAY ADDED DUE TO BETSLIP DELAY IN RENDER VS EVENT */
           window.setTimeout(function(){ 


            var payload = {
                'event_name': 'betAdd',
                'event_action_type':'frankel add to betslip',
                'track_link_name':'frankel add to betslip',
                'adb_timestamp':Math.round(new Date().getTime()/1000),
                'location':_satellite.getVar("browserLocale"),
                'adb_domain':window.location.hostname,
                'is_live_stream':false,
                'timestamp': new Date()
            };
            
             /* Get items in betslip */
             var betSlipAddResults = betSlipUtil($('.fkrc-bet-item')); 
             /* Define or pass */
             _satellite.containerArray = _satellite.containerArray || [], betSlipListSize = 4;   
             /* Add values into 2D array for simple access */
             _satellite.containerArray.push(betSlipAddResults.splice(betSlipAddResults.length - 4, betSlipListSize));
             
             //populate live streaming value as true in Telium and fire event9
             if (eventData.watchingLiveStreaming) {
                payload.is_live_stream = true;
             }
           
            var containerArrayLength =  _satellite.containerArray.length,
                frankeAttribution = (typeof _satellite.readCookie('dtm_ffm_attribution') !== "undefined")?_satellite.readCookie('dtm_ffm_attribution'):'^',
                runnerName = replaceLines(_satellite.containerArray[containerArrayLength - 1][1],false).substring(1),
                commentary = ($('#popup-audiostream')[0])?true:false,
                idSplit, dateFormat;
            
            payload.product_categories = [];
            payload.product_ids = [];
            payload.product_quantities = [];
            payload.product_prices = [];
            payload.product_info_5 = []; //evar40
            payload.adb_list_1= []; //list1

            payload.product_categories.push('betslip-frankel');
            payload.product_ids.push(eventData.id+'-'+runnerName);
            payload.product_quantities.push("1");
            payload.product_prices.push("0");
            
            /*
                    "product_info_5": ["^betAdd^Ayman^6/1 To Win^14:19:00^CAROUSEL^live^false^commentary^false"],
        "adb_list_1": ["DATE^20181031", "TIME^14:00", "COUNTRY^SWE", "LOCATION^bro_park", "RUNNER^Ayman", "ODDS^6/1", "WIDGET^CAROUSEL", "TIMEADDSLIP^1540995409294", "LIVESTREAM^false", "COMMENTARY^false"],
            
            
            */
            
            payload.product_info_5.push(frankeAttribution+'betAdd'+'^'+runnerName+'^'+replaceLines(_satellite.containerArray[containerArrayLength - 1][2],false).substring(1)+'^'+
              replaceLines(replaceChar(_satellite.containerArray[containerArrayLength - 1][0]),true) + ":00"+'^'+((typeof eventData.odds === "undefined")?'FORECAST':eventData.widgetName)+'^live^'+eventData.watchingLiveStreaming+((commentary)?"^commentary^true":"^commentary^false"))
            
            payload.adb_list_1.push( (idSplit = eventData.id.split('.'), "DATE^"+idSplit[0].substring(0,idSplit[0].length - 4)) );  
            payload.adb_list_1.push( (dateFormat = idSplit[0].substring(idSplit[0].length-4,idSplit[0].length), "TIME^"+dateFormat.slice(0,2)+":"+dateFormat.slice(2,4)) );
            payload.adb_list_1.push("COUNTRY^"+idSplit[2]);
            payload.adb_list_1.push("LOCATION^"+idSplit[3]);
            payload.adb_list_1.push("RUNNER^"+runnerName);      
            payload.adb_list_1.push("ODDS^"+((typeof eventData.odds === "undefined")?'FORECAST':eventData.odds));
            payload.adb_list_1.push("WIDGET^"+((typeof eventData.odds === "undefined")?'forecast':eventData.widgetName));
            payload.adb_list_1.push("TIMEADDSLIP^"+eventData.timestamp);
            payload.adb_list_1.push("LIVESTREAM^"+eventData.watchingLiveStreaming);
            payload.adb_list_1.push("COMMENTARY^"+((commentary)?"true":"false"));
          
            
            //send payload
            utag.link(payload);

          }, 800);


        }

    });


document.getElementById('dtmEventTarget').addEventListener('betPlace',
    function(evt) {

        var eventData = evt.detail;
        var domain = _satellite.getVar("Domain");

        var payload = {
                'event_name': 'betPlace',
                'event_action_type':'frankel place bet',
                'track_link_name':'frankel place bet',
                'adb_timestamp':Math.round(new Date().getTime()/1000),
                'location':_satellite.getVar("browserLocale"),
                'adb_domain':window.location.hostname,
                'transaction_id':eventData.transactionId,
                'purchase_id':eventData.transactionId,
                'is_live_stream':false,
                'timestamp': new Date()
            };


if(typeof eventData!=="undefined"){
  
          trackLinkName = 'frankel place bet';

          var numberOfProducts = eventData.bets.length;

          payload.product_categories = [];
          payload.product_ids = [];
          payload.product_quantities = [];
          payload.product_prices = [];

          /* Delay added because of Betslip rendering time vs event time */
          setTimeout(function(){
            
            var allBets = $('.fkrc-bet-receipt-ticket__runner');
            var namevalues = [];
            
            for (var ty = 0; ty < allBets.length; ty++){
                  namevalues.push($(allBets[ty]).text())
            }

            for(var i=0; i < numberOfProducts;i++) {

              payload.product_categories.push('betplace-frankel')
              payload.product_ids.push(eventData.bets[i].id+'-'+namevalues[i])
              payload.product_quantities.push('1')
              payload.product_prices.push(eventData.bets[i].stake)
          
            }

          
            //send payload
            utag.link(payload); 

          }, 500);


        }



    });
    
/* this is a temporary measure due to betPlace event being unavailable from front end - ADC-711 */
document.getElementById('dtmEventTarget').addEventListener('betPlaceFiller',
    function(evt) {

        var eventData = evt.detail; // defined from scraping page as missing event means missing bet values
        var domain = _satellite.getVar("Domain");

        var payload = {
                'event_name': 'betPlace',
                'event_action_type':'frankel place bet',
                'track_link_name':'frankel place bet',
                'adb_timestamp':Math.round(new Date().getTime()/1000),
                'location':_satellite.getVar("browserLocale"),
                'adb_domain':window.location.hostname,
                'transaction_id':'in-fill:' + new Date().getTime(), // won't align to Frankel transactionId
                'purchase_id':'in-fill:' + new Date().getTime(), //temporary neasure
                'is_live_stream':false,
                'timestamp': new Date()
            };


if(typeof eventData!=="undefined"){
  
          trackLinkName = 'frankel place bet';

          payload.product_categories = [];
          payload.product_ids = [];
          payload.product_quantities = [];
          payload.product_prices = [];

          /* Delay added because of Betslip rendering time vs event time */
          setTimeout(function(){
            
            var allBets = $('.fkrc-bet-receipt-ticket__runner');
            var namevalues = [];
            
            for (var ty = 0; ty < allBets.length; ty++){
                  namevalues.push($(allBets[ty]).text());
            }

            for(var i=0; i <  allBets.length;i++) {
              if (typeof namevalues[i] === 'string'){
              payload.product_categories.push('betplace-frankel[infill]');
              payload.product_ids.push('Infill:'+namevalues[i] + '-' + replaceLines($('.fkrc-bet-receipt-ticket__bet-details')[i].innerText)); //just adding name as ID due
              payload.product_quantities.push('1');
              payload.product_prices.push(replaceLines(replaceChar($('.fkrc-bet-receipt-ticket__stake')[i].innerText),true).slice(1));
              }
            }

            //send payload
            utag.link(payload); 

          }, 1000);


        }



    });


/*Frankel Finding Methods end */   

document.getElementById('dtmEventTarget').addEventListener('sportbookEvents',
    function(evt) {
        var videoPlayerLoad = _satellite.readCookie('currentVidDisplay');
        _satellite.removeCookie('currentVidDisplay');
        var eventData = evt.detail.data;
        var fireLink = false;
        var fireView = false;
        var payload = {
            event_name: 'sportbookEvents',
            is_live_stream: false,
        };

        if (typeof eventData === "undefined")
            return;

        if (typeof eventData.event !== "undefined") {
            switch (eventData.event) {
                case 'kambi add to betslip':

                    var sportsbookAttribution = typeof _satellite.readCookie('dtm_sfm_attribution') !== "undefined" ? _satellite.readCookie('dtm_sfm_attribution') : '';
                    fireLink = true;

                    payload.product_categories = [];
                    payload.product_ids = [];
                    payload.product_quantities = [];
                    payload.product_prices = [];
                    payload.product_info_1 = []; //prop18
                    payload.product_info_2 = []; //prop21
                    payload.product_info_3 = []; //evar8
                    payload.product_info_4 = []; //evar20
                    payload.product_info_8 = []; //evar64

                    payload.event_action_type = 'kambi add to betslip';
                    payload.track_link_name = 'kambi add to betslip';
                    payload.is_live_stream = (typeof _satellite.getVar('liveStreaming') !== "undefined" && _satellite.getVar('liveStreaming') === 1);
                    payload.adb_evar53 = videoPlayerLoad;
                    payload.location = eventData.kambi.client.locale;
                    payload.product_categories.push("betslip");
                    payload.product_ids.push(eventData.kambi.ecommerce.add.products[0].id);
                    payload.product_quantities.push("1");
                    payload.product_prices.push("0");
                    payload.product_info_1.push(eventData.kambi.ecommerce.add.products[0]['name']);
                    payload.product_info_3.push("" +
                        eventData.kambi.ecommerce.add.products[0]['betslip location source'].replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        eventData.kambi.ecommerce.add.products[0]['category'].replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        eventData.kambi.ecommerce.add.products[0]['name'].replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        payload.is_live_stream.toString() +
                        '^' +
                        eventData.kambi.ecommerce.add.products[0]['brand']);
                    payload.product_info_4.push("" +
                        sportsbookAttribution.replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        eventData.kambi.ecommerce.add.products[0]['category'].replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        eventData.kambi.ecommerce.add.products[0]['name'].replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        eventData.kambi.ecommerce.add.products[0]['brand'].replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        payload.is_live_stream.toString() +
                        '^' +
                        eventData.kambi.page.type.replace(/;/g, '-').replace(/,/g, '-'));
                    var t = eventData.kambi.ecommerce.add.products[0]['betofferTypeId'] === 2 ?
                        eventData.kambi.ecommerce.add.products[0]['bet details'] :
                        "";
                    payload.product_info_2.push(t);
                    if(_satellite.getVar('kambiVisualisaitonDeduplicationStatus')) {
                      payload.product_info_8.push(_satellite.getVar('kambiVisualisaitonDeduplicationStatus'));
                    }

                    break;
                case 'kambi place bet':

                    var numberOfProducts = eventData.kambi.ecommerce.purchase.products.length;
                    fireLink = true;

                    payload.event_action_type = 'kambi place bet';
                    payload.track_link_name = 'kambi place bet';
                    payload.receipt_id = $(".mod-KambiBC-js-betslip-receipt-header__receipt-id__id").text();
                    payload.location = eventData.kambi.client.locale;
                    payload.purchase_id = eventData.kambi.ecommerce.purchase.actionField.id.split('_')[1];
                    payload.total_revenue = eventData.kambi.ecommerce.purchase.actionField.revenue;
                    payload.adf_page_name = 'place bet';
                    payload.user_id = window.cms.user.customerId;
                    payload.adb_evar53 = videoPlayerLoad;

                    if (numberOfProducts > 0) {
                        payload.product_categories = [];
                        payload.product_ids = [];
                        payload.product_quantities = [];
                        payload.product_prices = [];
                        payload.product_info_1 = []; //prop18
                        payload.product_info_2 = []; //prop21

                        for (var i = 0; i < numberOfProducts; i++) {
                            payload.product_categories.push("betslip");
                            payload.product_ids.push(eventData.kambi.ecommerce.purchase.products[i].id);
                            payload.product_quantities.push("1");
                            payload.product_prices.push(eventData.kambi.ecommerce.purchase.products[i].price || "0");
                            payload.product_info_1.push(eventData.kambi.ecommerce.purchase.products[i].name);
                            var t = eventData.kambi.ecommerce.purchase.products[i]['betofferTypeId'] === 2 ?
                                eventData.kambi.ecommerce.purchase.products[i]['bet details'] :
                                "";
                            payload.product_info_2.push(t);
                        }
                    }

                    break;
                case 'kambi page view':

                    if (typeof eventData.kambi.search === "undefined") {

                        var isApp = _satellite.getVar('cms.device.isApp');
                        fireView = true;
                        
                        if (isApp === "true")
                            payload.adb_page_name_extended = _satellite.getVar('domain') + ":::APP" + ':betting' + eventData.kambi.page.path.replace(/\//g, ':');
                        else
                            payload.adb_page_name_extended = _satellite.getVar('domain') + ":::" + _satellite.getVar('cms.device.group') + ':betting' + eventData.kambi.page.path.replace(/\//g, ':');

                        payload.adb_page_name_extended = payload.adb_page_name_extended.replace('{layout_wide,layout_wide,layout_wide}', '');
                        payload.adf_page_name = 'betting'+eventData.kambi.page.path.replace(/\//g, ':').replace('{layout_wide,layout_wide,layout_wide}', '');
                        
                        payload.adb_gpv = utag.data.previousNavigationPathModule.get();

                        var hashSplit = document.location.hash.split('/');
                        var eventSKU = hashSplit[hashSplit.length - 1].replace(/[^0-9]/g, "");

                        if (eventSKU !== '' && eventSKU.length > 9) {

                            payload.is_product_view = true;
                            var sportsbookAttribution = typeof window.anayticsSfm !== "undefined" ? window.anayticsSfm : '';

                            payload.product_categories = [];
                            payload.product_ids = [];
                            payload.product_quantities = [];
                            payload.product_prices = [];
                            payload.product_info_4 = []; //evar20
                            payload.adb_evar53 = videoPlayerLoad;
                            payload.product_categories.push("betslip");
                            payload.product_ids.push(eventSKU);
                            payload.product_quantities.push("1");
                            payload.product_prices.push("0");
                            payload.product_info_4.push("" +
                                sportsbookAttribution.replace(/;/g, '-').replace(/,/g, '-') +
                                '^' +
                                eventData.kambi.ecommerce.detail.products[0]['category'].replace(/;/g, '-').replace(/,/g, '-') +
                                '^' +
                                eventData.kambi.ecommerce.detail.products[0]['name'].replace(/;/g, '-').replace(/,/g, '-') +
                                '^' +
                                eventData.kambi.ecommerce.detail.products[0]['brand'].replace(/;/g, '-').replace(/,/g, '-') +
                                '^' +
                                'false' +
                                '^' +
                                eventData.kambi.page.type.replace(/;/g, '-').replace(/,/g, '-'));

                        }
                        
                    //this is part of kambi visualisation tabs deduplication condition, so that we track kambi visualisation tabs only one after page view happens. Sometimes kambi visualisation tabs is executed multiple times
                    _satellite.setVar('kambiVisualisaitonDeduplicationFlag','pageView');

                    }
                    break;
                case 'kambi visualisation tabs':
                    
                    if(typeof window.optimizelyNoSegmentsFlag!=="undefined" && window.optimizelyNoSegmentsFlag===1) {
                        _satellite.cookie.set('optimizelyNoSegmentsFlag', '1', { expires: 30 });
                    }

                      //this is create so that when add to bet happens we can get this information and attribute current status of visualisation tabs to added bets
                      _satellite.setVar('kambiVisualisaitonDeduplicationStatus', eventData.kambi.tabs.activevisualisationtab  +':'+ eventData.kambi.tabs.streaming +':'+ eventData.kambi.tabs.visualisation +':'+ eventData.kambi.tabs.livestat);


                      if(_satellite.getVar('kambiVisualisaitonDeduplicationFlag')==='pageView' && eventData.kambi.page.type === "event detail page" && document.querySelector('a[class="KambiBC-modularized-event-path__fragment"]') !== null && document.querySelector('a[class="KambiBC-modularized-event-path__fragment"]').href.split('#')[1]==="filter/football") {
                        //this condition is created so that we can load this event on sportsbook football event detail page. Deduplication is added because sometimes kambi visualisaiton tabs event is dispatched more than one time. We caputre only the first time it appears after page view event.
                        _satellite.setVar('kambiVisualisaitonDeduplicationFlag','deduplicate');
                        fireView = false;
                        fireLink = true;
                        var hashSplit = document.location.hash.split('/');
                        var eventSKU = hashSplit[hashSplit.length - 1].replace(/[^0-9]/g, "");
                        payload.product_info_8 = []; //evar64

                        if (eventSKU !== '' && eventSKU.length > 9) {

                            payload.is_visualisation_view = true;

                            payload.product_categories = [];
                            payload.product_ids = [];
                            payload.product_quantities = [];
                            payload.product_prices = [];
                            
                            payload.product_categories.push("betslipVisualisation");
                            payload.product_ids.push(eventSKU);
                            payload.product_quantities.push("1");
                            payload.product_prices.push("0");
                        }

                        //this set of conditions determine active visualisation tab. The same data is available in the kambi visualisation event, but we do it this way because kambi visualisation tabs can be executed multiple times after page view happens, for each vis tab element separately, so we can't rely on eventData.kambi.tabs.activevisualisationtab
                            var activevisualisationtab = '';
                            if(eventData.kambi.tabs.streaming==='true') {
                              activevisualisationtab = 'streaming';
                            } else if (eventData.kambi.tabs.visualisation==='true') {
                              activevisualisationtab = 'visualisation';
                            } else if (eventData.kambi.tabs.livestat === 'true') {
                              activevisualisationtab = 'livestat';
                            }
                            
                            payload.product_info_8.push(activevisualisationtab +':'+ eventData.kambi.tabs.streaming +':'+ eventData.kambi.tabs.visualisation +':'+ eventData.kambi.tabs.livestat);

                            //event81
                            




                      }



                    break;
            }
        }

        if (typeof eventData.eventAction !== "undefined") {
            switch (eventData.eventAction) {
                case 'Start stream':
                    _satellite.setVar('liveStreaming', 1);
                    fireLink = true;
                    payload.event_action_type = 'Start stream';
                    payload.track_link_name = 'Start stream';
                    payload.location = cms.site.language.countryCode;

                    payload.product_categories = [];
                    payload.product_ids = [];
                    payload.product_quantities = [];
                    payload.product_prices = [];
                    payload.product_info_3 = []; //evar8
                    payload.product_info_1 = []; //prop18
                    payload.adb_evar53 = videoPlayerLoad;
                    payload.product_categories.push("streaming");
                    payload.product_ids.push(_satellite.getVar("eventId"));
                    payload.product_quantities.push("1");
                    payload.product_prices.push("0");
                    payload.product_info_1.push(_satellite.getVar("betName"));
                    payload.product_info_3.push("" +
                        _satellite.getVar("streamLocation").replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        _satellite.getVar("widgetBreadcrumb").replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        _satellite.getVar("betName").replace(/;/g, '-').replace(/,/g, '-') +
                        '^' +
                        "true" + '^' +
                        _satellite.getVar('streamingStatus'));

                    break;
                case 'Stop stream':
                    payload.event_action_type = 'Stop stream';
                    payload.track_link_name = 'Stop stream';
                    break;
                case 'Error':
                    if (eventData.data.eventCategory === "Streaming") {

                        payload.event_action_type = 'Error streaming';
                        payload.track_link_name = 'Error streaming';

                        payload.product_categories = [];
                        payload.product_ids = [];
                        payload.product_quantities = [];
                        payload.product_prices = [];
                        payload.product_info_3 = []; //evar8
                        payload.adb_evar53 = videoPlayerLoad;
                        payload.product_categories.push("streaming");
                        payload.product_ids.push(_satellite.getVar("eventId"));
                        payload.product_quantities.push("1");
                        payload.product_prices.push("0");
                        payload.product_info_3.push("" +
                            _satellite.getVar("streamLocation").replace(/;/g, '-').replace(/,/g, '-') +
                            '^' +
                            _satellite.getVar("widgetBreadcrumb").replace(/;/g, '-').replace(/,/g, '-') +
                            '^' +
                            _satellite.getVar("betName").replace(/;/g, '-').replace(/,/g, '-') +
                            '^' +
                            "true" +
                            '^' +
                            _satellite.getVar('streamingStatus'));

                    }
                    break;
                case 'Bet error':
                    payload.event_action_type = 'Bet error';
                    payload.track_link_name = 'Bet error';
                    payload.adb_evar53 = videoPlayerLoad;
                    fireLink = true;
                    payload.error_description = "bet error";
                    payload.error_label = eventData.data.eventLabel;
                    break;
            }
        }
        if (payload.product_info_1 && payload.product_info_1.constructor === Array) {
            payload.adb_prop18 = payload.product_info_1.join('^');
        }
        if (payload.product_info_2 && payload.product_info_2.constructor === Array) {
            payload.adb_prop21 = payload.product_info_2.join('^');
        }
        if (fireLink && !fireView) {
            utag.link(payload);
        }
        if (fireView) {
            utag.view(payload);
        }
    });

document.getElementById('dtmEventTarget').addEventListener('withdrawalCompleted',
    function(evt) {
        var eventData = evt.detail;

        utag.link({
            'event_name': 'withdrawalCompleted',
            'adf_page_name': 'Withdrawal Intent: eventData: ' + JSON.stringify(eventData)
        });
    });

document.getElementById('dtmEventTarget').addEventListener('bonusAccept',
    function(evt) {
        var eventData = evt.detail;

        utag.link({
            'event_name': 'bonusAccept',
            'adb_bonus_id': eventData.bonusId
        });
    });

document.getElementById('dtmEventTarget').addEventListener('PromotionOptIn',
    function(evt) {
        var eventData = evt.detail;

        utag.link({
            'event_name': 'PromotionOptIn',
            'adf_page_name': 'Promotion Opt-In: eventData: ' + JSON.stringify(eventData),
            'adb_promotion_id': eventData.promotionId
        });
    });

var liveStreamingClickListener = function() {
    var playerBtn = document.querySelector("button.KambiBC-video-stream-player__play-btn");
    if (playerBtn) {
        playerBtn.addEventListener("click", function() {
            utag.link({
                'event_name': 'liveStreamingClick',
                'track_link_name': 'Live streaming player link click'
            });
        });
    }
};

document.getElementById('dtmEventTarget').addEventListener('pageLoaded', liveStreamingClickListener, false);

//should not need to worry about adding the event listener more than once because 
//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Multiple_identical_event_listeners
window.addEventListener("hashchange", liveStreamingClickListener, false);

document.getElementById('dtmEventTarget').addEventListener('exclusion',
    function(evt) {
        var videoPlayerLoad = _satellite.readCookie('currentVidDisplay');
        _satellite.removeCookie('currentVidDisplay');
        var eventData = evt.detail;
        var timeframe = 'undefined';

        switch (eventData.timeframe) {
            case 0:
                timeframe = 'Hours';
                break;
            case 1:
                timeframe = 'Days';
                break;
            case 2:
                timeframe = 'Months';
                break;
            case 3:
                timeframe = 'Permanent';
                break;
            case 4:
                timeframe = 'Years';
                break;
        }

        utag.link({
            'event_name': 'exclusion',
            'adf_page_name': 'Self Exclusion: eventData: ' + JSON.stringify(eventData),
            'adb_exclusion_data': eventData.quantity + ' ' + timeframe
        });
    });

document.getElementById('dtmEventTarget').addEventListener('SetDepositLimit',
    function(evt) {
        var eventData = evt.detail;
        var t = 'undefined';

        switch (eventData.periodType) {
            case "0":
                t = '1 Day';
                break;
            case "1":
                t = '1 Week';
                break;
            case "2":
                t = '1 Month';
                break;
            case "3":
                t = '1 year';
                break;
        }

        utag.link({
            'event_name': 'SetDepositLimit',
            'adf_page_name': 'Set Deposit Limit: eventData: ' + JSON.stringify(eventData),
            'adb_deposit_amount': eventData.amount,
            'adb_deposit_limit': t
        });
    });

//Add right click event Listener for carousel and promo button
if (document.getElementById('top') !== null && document.getElementById('top').length > 0) {
    document.getElementById('top').addEventListener('contextmenu', function(ev) {
                _satellite.setCookie('rightClick','true');
    });
}
if (typeof document.getElementById('nav-main') !== "undefined") {
    var mnv = document.getElementById('nav-main');
    var subnav = mnv.getElementsByClassName('list-item');
    subnav[subnav.length -1].addEventListener('contextmenu', function(ev) {
                _satellite.setCookie('rightClick','true');
    })
}

if (window.location.pathname.indexOf("registration") > -1 ||
    window.location.pathname.indexOf("blog") > -1) {

    var spaPageView = function() {
        window.setTimeout(function() {
            var payload = {
                'event_name': 'spaPageView'
            };

            payload.adb_gpv = utag.data.previousNavigationPathModule.get();
            payload.adb_type_of_interaction = _satellite.getVar('cms.device.group');
            payload.adb_currency_code = _satellite.getVar('cms.site.currency.code');
            payload.adb_page_name_inverted = _satellite.getVar("pageNameInverted");
            payload.adb_registration_steps = _satellite.getVar("registrationSteps");
            payload.adb_logged_in = _satellite.getVar("loggedIn");
            payload.timestamp = new Date();

            if (payload.adb_logged_in === 'Logged-In') {
                payload.adb_user_number = _satellite.getVar('cms.user.customerId');
            }

            payload.adb_is_returning_user = "No";
            if (utag.data["cp.isReturningUser"] === "true") {
                payload.adb_is_returning_user = "Yes";
            }

            utag.link(payload);
        }, 500);

    };

    window.addEventListener("hashchange", spaPageView, false);

    (function(history) {
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({
                    state: state
                });
            }
            spaPageView();
            return pushState.apply(history, arguments);
        };
    })(window.history);

}


//track my bets tab click
/*setTimeout(
    function() {


        $(document.body).on("click", "a[data-tab='myBetsComponent']", function() {
            utag.link({
                'event_name': 'myBetsComponent',
                'track_link_name': "my bets component click"
            });
        });
    },
    500);*/
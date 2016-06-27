String.prototype.sprtf = function ()
{
    var args, pattern;
    pattern = /\{\d+\}/g;
    args = arguments;
    return this.replace(pattern, function (capture)
    {
        return args[capture.match(/\d+/)];
    });
};

function args(elem) {
    // Return an object of element attributes
    var newAttrs = {};
    var rinlinejQuery = /^jQuery\d+$/;
    $.each(elem.attributes, function (i, attr) {
        if (attr.specified && !rinlinejQuery.test(attr.name)) {
            newAttrs[attr.name] = attr.value;
        }
    });
    return newAttrs;
}

function api(endpoint, data, element)
{
    var url = 'https://api.tacticalmastery.com';
    var jqxhr = $.ajax(
            {
                type: 'GET',
                url: url + "/" + endpoint + "/",
                data: data,
                contentType: "application/json",
                success: function (e)
                {
                    //console.log('api success');
                    if (typeof e.result != "undefined")
                    {
                    }
                    element(e);
                },
                error: function (e)
                {
                    console.log("error");
                }
            });
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++)
    {
        var pair = vars[i].split('=');

        if (decodeURIComponent(pair[0]) == variable)
        {
            return decodeURIComponent(pair[1]);
        }
    }

    return "";
}

function randString(x)
{
    var s = "";

    while (s.length < x && x > 0)
    {
        var r = Math.random();
        s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
    }

    return s;
}

function getSetSet(field, value, qsfield)
{

    value = value || '';
    qsfield = qsfield || field;

    var sField = value;

    if (typeof (Storage) !== "undefined")
    {
        sField = localStorage.getItem(field);
        if (sField == null)
            sField = getQueryVariable(qsfield);

        localStorage.setItem(field, sField);
    }

    $("input[name=" + field + "]").val(sField);
}

function getFirstLast(instring) {
    var parts = instring.split(' ');
    var fn = parts[0];
    parts.shift(); // parts is modified to remove first word
    var ln = '';
    if (parts instanceof Array) {
        ln = parts.join(' ');
    } else {
        ln = parts;
    }
    return [fn, ln];
}


function afGetGet(field, qsfield)
{
    qsfield = qsfield || false;
    var returnThis;

    if (typeof (Storage) !== "undefined")
    {
        returnThis = localStorage.getItem(field);
    }
    //if (returnThis == undefined) {
    if (qsfield) {

        qParam = getQueryVariable(qsfield);
        if (qParam) {
            //TODO: this is buggy, no check for local storage, lets just define our own getter setter method for ls, then gracefully fall back to a cookie
            localStorage.setItem(field, qParam);
            returnThis = qParam;
        }
        //} else {
        //    returnThis = '';
    }
    //}
    if (returnThis)
        return returnThis.replace(/[+]/g, ' ');
    return returnThis;

}

function afSetSet(field, value)
{

    if (typeof (Storage) !== "undefined")
    {
        localStorage.setItem(field, value);
    }
}

function addHiddenField(theForm, key, value) {
    // Create a hidden input element, and append it to the form:
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    theForm.appendChild(input);
}


/*  Page borne stuffs
 todo: this needs serious refactoring to perform as intended.
 todo:  messages/next/prev shoudl flow into a function that just handles success events and responds accordingly
 todo: need to clousure this mess
 */
function SubmitSubmit(this_form) {
//"/api/order/?firstName=danner-3&lastName=omerick&address1=123+main+street&city=sarasota&state=fl&postalCode=34202&phoneNumber=551-587-8328&emailAddress=zedzedbeta5@yahoo.com&orderId=B2DF48140C&cardNumber=0000000000000000&cardSecurityCode=100&month=06&year=17&campaignId=3&product1_id=3&product1_qty=1
    $("div#js-div-loading-bar").show();
    var year = $("select[name=year]").val(), month = $("select[name=month]").val();
    var d = new Date();
    var currentYear = d.getFullYear().toString().substr(2, 2), currentMonth = ("0" + (d.getMonth() + 1)).slice(-2);
    if (!((currentYear < year) || (currentYear == year) && (currentMonth <= month))) {
        $("div#js-div-loading-bar").fadeOut();
        $("#popModalHead").html('Problem with your order');
        $("#popModalBody").html('Invalid Expiration Date');
        $("#popModal").modal();
        return;
    }
    var apiFields = [];
    if (pageInfo.type == "orderform") {
        apiFields = [
            'firstName',
            'lastName',
            'emailAddress',
            'phoneNumber',
            'address1',
            'address2',
            'city',
            'state',
            'postalCode',
            'cardNumber',
            'cardSecurityCode',
            'month',
            'year',
            'campaignId',
            'product1_id',
            'product1_qty'
        ];
    }
    //console.log("sumbitted: "+$(this_form).attr('name'));
    var paramString = 'campaignId=3&product1_qty=1';

    $(this_form).find('input').each(function () {
        if ($.inArray($(this).attr('name'), apiFields) != -1) {
            var uVal = $(this).val();
            if (uVal) {
                uVal = encodeURIComponent(uVal);
                if ($(this).is(':radio')) {
                    if ($(this).is(':checked')) {
                        if (paramString != '') {
                            paramString += '&';
                        }
                        paramString += $(this).attr('name') + "=" + uVal;
                        if ($(this).attr('name') === 'product1_id') {
                            afSetSet('initialProductId', uVal);
                        }
                    }
                } else {
                    if (paramString != '') {
                        paramString += '&';
                    }
                    paramString += $(this).attr('name') + "=" + uVal;
                }
            }
        }
        //console.log($(this).attr('name') +"="+ $(this).val());
    });

    $(this_form).find('select').each(function () {
        if ($.inArray($(this).attr('name'), apiFields) != -1) {
            var uVal = $(this).val();
            if (uVal) {
                if (paramString != '') {
                    paramString += '&';
                }
                paramString += $(this).attr('name') + "=" + uVal;
            }
        }
        //console.log($(this).attr('name') +"="+ $(this).val());
    });
    if (window.myOrderID) {
        paramString += "&orderId=" + window.myOrderID;
    }
    //todo: this is gettig painfully redundant,
    var trackingFields = ['affId','s1','s2','s3'];
    $.each(trackingFields, function (index, f_name) {
        ls_name = "f_" + f_name; //todo: refactor localstorage name into our getsetter class
        f_val = afGetGet(ls_name, f_name);
        if (f_val) {
            //console.log(".");
            if (paramString != '')
                paramString += '&';
            paramString += f_name + "=" + f_val;
        }
    });

    //console.log(paramString);
    //just do the order right meow and get a response
    api("order", paramString, function (e) {
        json = JSON.parse(e);

        //console.log(json);
        switch (json.result) {
            case 'SUCCESS':
                if (typeof json.message.orderId != 'undefined') {
                    window.myOrderID = json.message.orderId;
                    afSetSet("orderId", myOrderID);
                }
                document.location = '/us_recharge.html?orderId=' + window.myOrderID;
                break;
            case 'ERROR':
                if (json.message) {
                    $("#popModalHead").html('Problem with your order');
                    if (json.message.trim() != 'Invalid Credit Card Number') {
                        json.message = 'Eek! Something went dark with your order and it was not processed. ' +
                            'Call our support team to shed some light and get your order processed right away! ' +
                            '- <a href="tel:+18444478240">(844) 447-8240</a>';
                    }
                    $("#popModalBody").html('<span style="color:red;font-size:24px">' + json.message + '</span>');
                    $("#popModal").modal();
                }
                break;
            default:
                //todo: reply back to our api instead of logging here
                break;
        }
        $("div#js-div-loading-bar").fadeOut();
    });

    $(this_form).find('input.af').each(function () {
        if ($(this).val() != "") {
            f_name = "f_" + $(this).attr('name');
            afSetSet(f_name, $(this).val());
            if (f_name == 'f_fullName') {
                nameParts = getFirstLast($(this).val());
                afSetSet('f_firstName', nameParts[0]);
                afSetSet('f_lastName', nameParts[1]);
            }
        }
    });
    return false;
}

function doUpsellYes(upsellID, productId) {
    $("div#js-div-loading-bar").show();
    if (window.myOrderID) {
        var paramString = 'orderId=' + window.myOrderID + '&productQty=1';
        var nextPage = '/us_hlmp.html?orderId=' + window.myOrderID;
        switch (upsellID) {
            case 'hdlmp':
                productId = $('#lampId').val() || '31';
                nextPage = '/thankyou.html?orderId=' + window.myOrderID;
                break;
            case 'recharge':
                productId = productId || '12';
                nextPage = '/us_hlmp.html?orderId=' + window.myOrderID;
                break;
            default:
                break;
        }
        if (productId) {
            paramString += '&productId=' + productId;
            api("upsell", paramString, function (e)
            {
                json = JSON.parse(e);

                //console.log(json);
                if (json.result == "SUCCESS") {
                    document.location = nextPage;
                    return;
                } else if (json.result == "ERROR") {
                    if (json.message) {
                        var messageOut = '';
                        if (typeof(json.message) === "string") {
                            messageOut = json.message;
                            if (messageOut === 'This upsale was already taken.') {
                                // continue down the funnel if the upsell is done
                                document.location = nextPage;
                                return;
                            }
                        } else {
                            for (var k in json.message) {
                                if (json.message.hasOwnProperty(k)) {
                                    messageOut += k + ":" + json.message[k] + '<br>';
                                }
                            }
                        }
                        $("#popModalHead").html('Problem with your Addon');
                        $("#popModalBody").html(messageOut);
                        $("#popModal").modal();
                    }
                } else {
                    $("#popModalHead").html('Problem with your Addon');
                    $("#popModalBody").html('An unknown error occured, try again or call our customer service');
                    $("#popModal").modal();
                }
                $("div#js-div-loading-bar").fadeOut();
            });
        }
    } else {
        alert("There was an error finding your order, please refresh the page and try again.")
        $("div#js-div-loading-bar").fadeOut();
    }

}
function doUpsellNo(upsellID) {
    $("div#js-div-loading-bar").show();
    var nextPage = '/thankyou.html?orderId=' + window.myOrderID;
    switch (upsellID) {
        case 'recharge':
            nextPage = '/us_hlmp.html?orderId=' + window.myOrderID;
            break;
        default:
    }
    document.location = nextPage;
    return;
}

function populateThanksPage(orderInfos) {

    if ($.type(orderInfos) === "array")
        orderInfos = orderInfos[0];
    //console.log(orderInfos);
    $('#totalBilled').html(orderInfos['currencySymbol'] + ' ' + orderInfos['price']);
    $('#orderNumber').html(orderInfos['orderId']);
    $('#totItems').html("Order Summary");
    //now loop and add the products
    $.each(orderInfos.items, function (i, val) {
        $('#orderDet tr:last').after('<tr><td>' + val.name + '</td><td class="text-right">' + val.price + '</td></tr>');
    });
    // The "appears on statement as" only appears in the transacion api
    // TODO: The query to the order status can mosetly be completely replaced by this query but no time atm.
    // TODO: it's dumb to dump an api query here. This whole thing should be refactored to something like grabfields('thanksinfo', orderid)
    api("trans", "orderId={0}".sprtf(myOrderID), function (e)
    {
        json = JSON.parse(e);
        if (json.result == "SUCCESS") {
            if (json.message.data) {
                firstRow = json.message.data[0];
                if (firstRow && firstRow['merchantDescriptor']) {
                    $('#ccIdentity').html('<br>' + firstRow['merchantDescriptor']);
                } else {
                    $('#ccIdentity').html('<br>Tactical Mastery');
                }
            }
        }

    });

}

$(document).ready(function ()
{
    if (pageInfo != undefined) {

        //make sure affiliate stuff is always there
        //anything we put here will end up in a page variable as well as ls
        window.trkStuff = new Array();

        var trackingFields = ['affId','s1','s2','s3']; //todo, should be "global" thing (class init)

        //trap the lander form and add affiliate info (otherwise we do not carry over to secure
        var iF = document.forms['formLead'];

        $.each(trackingFields, function (index, f_name) {
            var ls_name = "f_" + f_name;
            var f_val = afGetGet(ls_name, f_name);
            if (f_val) {
                trkStuff[f_name] = f_val;
                if (iF != undefined) addHiddenField(iF, f_name, f_val);
            }
        });

        //Terms and privacy popups
        $('#terms').click(function (e)
        {
            bModal = false;
            $("#popModalHead").html('Terms and Conditions');
            $("#popModalBody").load('terms.html');
            $("#popModal").modal();
        });

        $('#privacy').click(function (e)
        {
            bModal = false;
            $("#popModalHead").html('Privacy Policy');
            $("#popModalBody").load('privacy.html');
            $("#popModal").modal();
        });

        $('#popupTerms').on('hidden.bs.modal', function (e)
        {
            bModal = true;
        });


        //check autopopulate
        if (pageInfo.autopopulate) {
            $('input.af').each(function () {
                f_name = "f_" + $(this).attr('name');
                //console.log("populating:"+f_name+"|")
                $(this).val(afGetGet(f_name, $(this).attr('name')));
            });
        }
        if (pageInfo.hasorderid) {
            if (pageInfo.type == 'orderform') {
                window.myOrderID = null;
                //console.log('new order')
            } else {
                window.myOrderID = afGetGet("orderId", "orderId");
            }
            if (myOrderID == null) {
                paramString = '';
                var okToQuery = true;
                var requiredFields = ['firstName', 'lastName','phoneNumber' ];
                var optionalFields = ['emailAddress','affId','s1','s2','s3'];
                $.each(requiredFields.concat(optionalFields), function (index, f_name) {
                    ls_name = "f_" + f_name; //todo: refactor localstorage name into our getsetter class
                    f_val = afGetGet(ls_name, f_name);
                    if (f_val) {
                        //console.log(".");
                        if (paramString != '')
                            paramString += '&';
                        paramString += f_name + "=" + f_val;
                    } else if (requiredFields.indexOf(f_name) != -1) {
                        okToQuery = false;
                        //console.log("breakquery: missing required field:" + f_name)
                    }
                });
                //console.log(paramString);
                if (okToQuery)
                    api("createlead", paramString, function (e)
                    {
                        json = JSON.parse(e);

                        if (typeof json.message.orderId != 'undefined') {
                            window.myOrderID = json.message.orderId;
                            afSetSet("orderId", myOrderID);
                        }
                    });
            } else
            {
                //window.orderID = afGetGet("orderId","orderId");
                //todo: just send /getlead (endpoints and have the function do the uri
                api("getlead", "orderId={0}".sprtf(myOrderID), function (e)
                {
                    json = JSON.parse(e);
                    if (pageInfo.type == 'thankyou') {
                        //console.log("hey it's a thank you page!");
                        if (json.result == "SUCCESS") {
                            populateThanksPage(json.message.data);
                        } else if (json.result == "ERROR") {
                            alert('Error: ' + json.message);
                        } else {
                            alert('undefined error. please try again');
                        }

                    } else {
                        if (json.message && json.message.data && json.message.data[0]) {
                            if (json.message.data[0]['orderStatus'] == 'COMPLETE') {
                                //the order is complete and they are not on the success page
                                // they can be on an upsell page up to an hour after the initial sale
                                var doThatPop = true;
                                if (pageInfo.type == 'upsell') {
                                    var gmtStr = json.message.data[0]['dateUpdated'] + ' GMT-0400';
                                    var orderDate = new Date(gmtStr);
                                    var nowDate = new Date();
                                    var minutesSince = ((nowDate - orderDate) / 1000 / 60);
                                    //console.log('Minutes since last order' + minutesSince);
                                    doThatPop = (minutesSince > 55);
                                }
                                if (doThatPop) {
                                    isBack = false;
                                    setTimeout("location.href = '/thankyou.html';",1500);
                                    //$("#popModalHead").html('Previous order detected!');
                                    //var myMessage = 'Hey! It looks like you have already completed an order with us!<br> ' +
                                    //    'You may either view your reciept page or start a new order<br> ' +
                                    //    '<a href="/thankyou.html?orderId=' + window.myOrderID + '">VIEW CURRENT RECIEPT</a><br>' +
                                    //    '<a href="/checkout.html?task=startneworder">START NEW ORDER</a>';
                                    //$("#popModalBody").html('<span style="color:red;font-size:18px">' + myMessage + '</span>');
                                    //$("#popModal").modal();
                                }
                            }
                        }
                    }
                });
            }
        }

        //$( "#frm_order" ).submit(function (event) {
        //    if (pageInfo.hasorderid) {
        //        event.preventDefault();
        //        return false;
        //    }
        //
        //});

        //ditching this for now
        // if (pageInfo.helpaddress) {
        //
        //    $.LiveAddress({
        //        key: '10837777848707382',
        //        waitForStreet: true,
        //        geolocate: true,
        //        geolocatePrecision: "city",
        //        submitSelector: "#checkoutSubmit",
        //        addresses: [{
        //            id: 'shipping',        // IDs are not part of the address
        //            address1: '#f_address1',
        //            address2: '#f_address2',
        //            locality: '#f_city',
        //            administrative_area: '#f_state',
        //            postal_code: '#f_zip'
        //        }]
        //    });
        //}
        //todo: this is temporary and only goes by page type being different. it will get messy.
        if (pageInfo.type == 'orderform') {
            //console.log("we is validating");
            $('#frm_order').formValidation({
                framework: 'bootstrap',
                err: {
                    container: '#formerrors'
                },
                fields: {
                    firstName: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'First name is required'
                            },
                            stringLength: {
                                min: 3,
                                max: 30,
                                message: 'The name must be more than 3 and less than 30 characters long'
                            },
                            regexp: {
                                regexp: /^[a-zA-Z0-9_\-]+$/,
                                message: 'Names can only consist of alphabetical, number, underscore and hyphen'
                            }
                        }
                    },
                    lastName: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            },
                            stringLength: {
                                min: 3,
                                max: 30,
                                message: 'The name must be more than 3 and less than 30 characters long'
                            },
                            regexp: {
                                regexp: /^[a-zA-Z0-9_\-]+$/,
                                message: 'Names can only consist of alphabetical, number, underscore and hyphen'
                            }
                        }
                    },
                    emailAddress: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'The email address is required'
                            },
                            emailAddress: {
                                message: 'The input is not a valid email address'
                            }}
                    },
                    phoneNumber: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Phone number is required'
                            },
                            stringLength: {
                                min: 9,
                                max: 20,
                                message: 'Please use a proper phone number, area code first'
                            }
                        }
                    },
                    address1: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Please enter a street address'
                            },
                            stringLength: {
                                min: 2,
                                max: 60,
                                message: 'please enter a full street adress'
                            }
                        }
                    },
                    state: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Please enter a city name'
                            }
                        }
                    },
                    city: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Please enter a city name'
                            },
                            stringLength: {
                                min: 2,
                                max: 50,
                                message: 'Please enter a proper length city'
                            }
                        }
                    },
                    postalCode: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Please enter a zip code'
                            },
                            stringLength: {
                                min: 5,
                                max: 10,
                                message: 'please enter a 5 digit or 9 digit zip code'
                            }
                        }
                    },
                    cardNumber: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Please enter a valid card number'
                            },
                            stringLength: {
                                min: 14,
                                max: 16,
                                message: 'Credit card must be 15 or 16 digits'
                            }
                        }
                    },
                    cardSecurityCode: {
                        row: '.field',
                        validators: {
                            notEmpty: {
                                message: 'Please enter a valid security code'
                            },
                            stringLength: {
                                min: 3,
                                max: 4,
                                message: 'Security code Invalid Length'
                            }
                        }
                    }
                }
            }).on('status.field.fv', function (e, data) {
                data.fv.disableSubmitButtons(false);
            }).on('success.field.fv', function (e, data) {
                if (data.fv.getSubmitButton()) {
                    data.fv.disableSubmitButtons(false);
                }
            }).on('err.form.fv', function (e) {
                $("#popErrors").modal();
                e.preventDefault();
            }).on('success.form.fv', function (e) {
                fakevar = SubmitSubmit('#frm_order');
                e.preventDefault();
            });
            //try to populate the state box
            $.getJSON('//geo.tacticalmastery.com/get/', function (data) {
                if (data && data.region) {
                    $("#f_state option").filter(function () {
                        return $(this).text() == data.region;
                    }).prop('selected', true);
                }
            })
        }
        if (pageInfo.type == 'upsell') {

            $('#upsellYes').click(function (e)
            {
                isBack = false;
                doUpsellYes(pageInfo.upsellval);
            });
            $('#upsellNo').click(function (e)
            {
                isBack = false;
                doUpsellNo(pageInfo.upsellval);
            });

        }

    }

    // external js code goes here

    if (pageInfo.type == 'orderform') {
        /* Creditcard.js v0.10.13 | Copyright (c) 2016 Creditcard.js | creditcardjs.com/licensing */(function(){var l,m=this;
            function p(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
                    b&&"undefined"==typeof a.call)return"object";return b}function aa(a){return"array"==p(a)}function ba(a){var b=p(a);return"array"==b||"object"==b&&"number"==typeof a.length}function q(a){return"string"==typeof a}function ca(a){return"number"==typeof a}function da(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}var ea="closure_uid_"+(1E9*Math.random()>>>0),fa=0;function ha(a,b,c){return a.call.apply(a.bind,arguments)}
            function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function ja(a,b,c){ja=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return ja.apply(null,arguments)}
            function oa(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}var pa=Date.now||function(){return+new Date};function qa(a,b){function c(){}c.prototype=b.prototype;a.pa=b.prototype;a.prototype=new c};function ra(a){if(!sa.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(ta,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(ua,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(va,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(wa,"&quot;"));return a}var ta=/&/g,ua=/</g,va=/>/g,wa=/\"/g,sa=/[&<>\"]/;function xa(a){a=String(a);var b=a.indexOf(".");-1==b&&(b=a.length);b=Math.max(0,2-b);return Array(b+1).join("0")+a}function ya(a,b){return a<b?-1:a>b?1:0};var r,za,Aa,Ba;function Ea(){return m.navigator?m.navigator.userAgent:null}Ba=Aa=za=r=!1;var Fa;if(Fa=Ea()){var Ga=m.navigator;r=0==Fa.lastIndexOf("Opera",0);za=!r&&(-1!=Fa.indexOf("MSIE")||-1!=Fa.indexOf("Trident"));Aa=!r&&-1!=Fa.indexOf("WebKit");Ba=!r&&!Aa&&!za&&"Gecko"==Ga.product}var Ha=r,t=za,u=Ba,v=Aa;function Ia(){var a=m.document;return a?a.documentMode:void 0}var Ja;
            a:{var Ka="",La;if(Ha&&m.opera)var Ma=m.opera.version,Ka="function"==typeof Ma?Ma():Ma;else if(u?La=/rv\:([^\);]+)(\)|;)/:t?La=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:v&&(La=/WebKit\/(\S+)/),La)var Na=La.exec(Ea()),Ka=Na?Na[1]:"";if(t){var Oa=Ia();if(Oa>parseFloat(Ka)){Ja=String(Oa);break a}}Ja=Ka}var Pa={};
            function w(a){var b;if(!(b=Pa[a])){b=0;for(var c=String(Ja).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",h=d[f]||"",s=RegExp("(\\d*)(\\D*)","g"),D=RegExp("(\\d*)(\\D*)","g");do{var k=s.exec(g)||["","",""],n=D.exec(h)||["","",""];if(0==k[0].length&&0==n[0].length)break;b=ya(0==k[1].length?0:parseInt(k[1],10),0==n[1].length?0:parseInt(n[1],10))||ya(0==k[2].length,0==n[2].length)||
                    ya(k[2],n[2])}while(0==b)}b=Pa[a]=0<=b}return b}var Qa=m.document,Ra=Qa&&t?Ia()||("CSS1Compat"==Qa.compatMode?parseInt(Ja,10):5):void 0;function Sa(a){var b=0,c=0;if(Ta(a))b=a.selectionStart,c=a.selectionEnd;else if(t){var d;d=a.ownerDocument||a.document;var e=d.selection.createRange();"textarea"==a.type?(d=d.body.createTextRange(),d.moveToElementText(a)):d=a.createTextRange();d=[d,e];e=d[0];d=d[1];if(e.inRange(d)){e.setEndPoint("EndToStart",d);if("textarea"==a.type){a=d.duplicate();var f=e.text,b=f;d=c=a.text;for(var g=!1;!g;)0==e.compareEndPoints("StartToEnd",e)?g=!0:(e.moveEnd("character",-1),e.text==f?b+="\r\n":g=!0);for(e=!1;!e;)0==
            a.compareEndPoints("StartToEnd",a)?e=!0:(a.moveEnd("character",-1),a.text==c?d+="\r\n":e=!0);e=[b.length,b.length+d.length];return e}b=e.text.length;c=e.text.length+d.text.length}}return[b,c]}function Ua(a,b){if(Ta(a))a.selectionStart=b,a.selectionEnd=b;else if(t){var c=b;"textarea"==a.type&&(c=a.value.substring(0,c).replace(/(\r\n|\r|\n)/g,"\n").length);b=c;c=a.createTextRange();c.collapse(!0);c.move("character",b);c.select()}}
            function Ta(a){try{return"number"==typeof a.selectionStart}catch(b){return!1}};function x(a){return"ccjs-"+a};var y=Array.prototype;function z(a,b){if(q(a))return q(b)&&1==b.length?a.indexOf(b,0):-1;for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1}function C(a,b){for(var c=a.length,d=q(a)?a.split(""):a,e=0;e<c;e++)e in d&&b.call(void 0,d[e],e,a)}function Va(a,b){for(var c=q(a)?a.split(""):a,d=a.length-1;0<=d;--d)d in c&&b.call(void 0,c[d],d,a)}function E(a,b){for(var c=a.length,d=[],e=0,f=q(a)?a.split(""):a,g=0;g<c;g++)if(g in f){var h=f[g];b.call(void 0,h,g,a)&&(d[e++]=h)}return d}
            function Wa(a,b){for(var c=a.length,d=Array(c),e=q(a)?a.split(""):a,f=0;f<c;f++)f in e&&(d[f]=b.call(void 0,e[f],f,a));return d}function Xa(a,b){var c={};C(a,function(d,e){c=b.call(void 0,c,d,e,a)});return c}function F(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}function Ya(a,b,c,d){return y.splice.apply(a,Za(arguments,1))}function Za(a,b,c){return 2>=arguments.length?y.slice.call(a,b):y.slice.call(a,b,c)};function $a(a,b,c){this.o=null;if(a.length!=b.length)return null;this.o=a;for(var d=1;d<a.length;d++)null==a[d]?a[d]=a[d-1]+1:c&&(a[d]+=a[d-1]);this.N=b}function ab(a,b){var c=bb(a,b);return 0>c?null:a.N[c]}function bb(a,b){for(var c=a.o,d=0,e=c.length;8<e-d;){var f=e+d>>1;c[f]<=b?d=f:e=f}for(;d<e&&!(b<c[d]);++d);return d-1};var G=[4,8,12],H=[4,9,14],I={O:{j:[[34],[37]],d:[15],e:3,c:4,a:x("amex"),k:"American Express",f:[4,10],h:[4,11],i:!0},ta:{j:[[300,305],[309],[36],[38,39]],d:[14],e:3,c:3,a:x("diners-club"),k:"Diners Club",f:[4,10],h:[4,11],i:!0},va:{j:[[3528,3589]],d:[16],e:3,c:3,a:x("jcb"),k:"JCB",f:G,h:H,i:!0},ua:{j:[[6011],[622126,622925],[644,649],[65]],d:[16],e:3,c:3,a:x("discover"),k:"Discover",f:G,h:H,i:!0},sa:{j:[[5019]],d:[16],e:3,c:3,a:x("dankort"),k:"Dankort",f:G,h:H,i:!0},wa:{j:[[6304],[6706],[6771],[6709]],
                d:[16,17,18],e:3,c:3,a:x("laser"),k:"Laser",f:G,h:H,i:!0},aa:{j:[[5018],[5020],[5038],[5893],[6304],[6759],[6761],[6762],[6763],[6390]],d:[16,12,13,14,15,17,18,19],e:3,c:3,a:x("maestro"),k:"Maestro",f:G,h:H,i:!0},xa:{j:[[2221,2720],[50,55]],d:[16],e:3,c:3,a:x("mastercard"),k:"MasterCard",f:G,h:H,i:!0},ya:{j:[[62],[88]],d:[16,17,18,19],e:3,c:3,a:x("unionpay"),k:"UnionPay",f:[4,8,12,16],h:[4,9,14,19],la:!0,i:!1},P:{j:[[4]],d:[16],e:3,c:3,a:x("visa"),k:"Visa",f:G,h:H,i:!0},Q:{j:[[4026],[417500],[4405],
                [4508],[4844],[4913],[4917]],d:[16],e:3,c:3,a:x("visa-electron"),k:"Visa Electron",f:G,h:H,i:!0}},J=new $a([],[]),cb=[],K,db;for(db in I){K=I[db];cb.push(K.a);C(K.j,function(a){var b=a[0];a=1===a.length?b:a[1];var b=new $a([b,a+1],[K,ab(J,a+1)],void 0),c=b.o[0];a=bb(J,c);var d=b.o,d=bb(J,d[d.length-1]);c!=J.o[a]&&a++;c=d-a+1;oa(Ya,J.o,a,c).apply(null,b.o);oa(Ya,J.N,a,c).apply(null,b.N)});K.ba=[];for(var eb=0;eb<K.f.length;eb++)K.ba[eb]=K.f[eb]-eb}I.ha=function(){return cb};
            I.fa=function(a){var b=a.split(""),c;if(0==b[0])return 0===a.indexOf("0604")?I.aa:null;a=Math.min(b.length,6);for(var d=a-1;0<=d&&(c=ab(J,b.slice(0,d+1).join("")),null==c);d--);return!c||c.la&&6!==a?null:c};function fb(a,b,c){var d=a.value,e;e=0<=d.indexOf("-")?"-":" ";var d=gb(d),f=hb(d),g=f||I.P,d=ib(d,g),h=d.qa,s=d.ma;setTimeout(function(){var d=Sa(a)[1];Ya(h,d,0,"cursor");for(var k=z(h,"cursor"),n=g.h,d=F(h),k=s?h.length:k,A=0,B=0;B<k;){switch(d[B]){case "delimiter":-1===z(n,A)&&(y.splice.call(d,B,1),B--,A--);break;case "cursor":A--;break;default:-1!==z(n,A)&&(Ya(d,B,0,"delimiter"),A++,B++)}A++;B++}n=jb(d,e);k=z(d,"cursor");a.value=n;c||Ua(a,k);d=kb(E(d,ca),f);b(f,d,n.replace(/\D/g,""))},0)}
            function gb(a){a=a.replace(/[^0-9 -]/g,"").split("");return Wa(a,function(a){return/[ -]/.test(a)?"delimiter":parseInt(a,10)})}function lb(a){return E(a,function(a){return"cursor"!==a&&"delimiter"!==a}).join("")}function jb(a,b){var c=b||" ";return Wa(E(a,function(a){return"cursor"!==a}),function(a){return"delimiter"==a?c:a}).join("")}function hb(a){a=lb(a);return I.fa(a)}function mb(a,b){var c=F(a);Va(b,function(a){y.splice.call(c,a,1)});return c}
            function ib(a,b){for(var c=b.d[b.d.length-1],d=[],e=0,f=0;f<a.length;f++)/\d/.test(a[f])&&(e++,e>c&&d.push(f));return{qa:mb(a,d),ma:e>=c}}function kb(a,b){if(b){if(a.length<b.d[0])return 0;var c;if(c=b.i){c=a[a.length-1];var d=a.slice(0,-1),e,f=0,g,h=!0;for(e=d.length-1;0<=e;e--)g=d[e],h?(g*=2,f=10<=g?f+(g-9):f+g):f+=g,h=!h;c=c!==9*f%10}if(c)return 1}else return 6<=a.length?2:0;return null};var L=!!m.DOMTokenList,nb=L?function(a){return a.classList}:function(a){a=a.className;return q(a)&&a.match(/\S+/g)||[]},ob=L?function(a,b){return a.classList.contains(b)}:function(a,b){var c=nb(a);return 0<=z(c,b)},M=L?function(a,b){a.classList.add(b)}:function(a,b){ob(a,b)||(a.className+=0<a.className.length?" "+b:b)},pb=L?function(a,b){C(b,function(b){M(a,b)})}:function(a,b){var c={};C(nb(a),function(a){c[a]=!0});C(b,function(a){c[a]=!0});a.className="";for(var d in c)a.className+=0<a.className.length?
            " "+d:d},qb=L?function(a,b){a.classList.remove(b)}:function(a,b){ob(a,b)&&(a.className=E(nb(a),function(a){return a!=b}).join(" "))},rb=L?function(a,b){C(b,function(b){qb(a,b)})}:function(a,b){a.className=E(nb(a),function(a){return!(0<=z(b,a))}).join(" ")};function N(a,b,c){c?M(a,b):qb(a,b)}function sb(a){var b=x("active"),c=!ob(a,b);N(a,b,c)};function tb(a,b,c){ca(a)?(this.b=new Date(a,b||0,c||1),ub(this,c||1)):da(a)?(this.b=new Date(a.getFullYear(),a.getMonth(),a.getDate()),ub(this,a.getDate())):(this.b=new Date(pa()),this.b.setHours(0),this.b.setMinutes(0),this.b.setSeconds(0),this.b.setMilliseconds(0))}l=tb.prototype;l.getFullYear=function(){return this.b.getFullYear()};l.getYear=function(){return this.getFullYear()};l.getMonth=function(){return this.b.getMonth()};l.getDate=function(){return this.b.getDate()};l.getTime=function(){return this.b.getTime()};
            l.getUTCHours=function(){return this.b.getUTCHours()};l.setFullYear=function(a){this.b.setFullYear(a)};l.setMonth=function(a){this.b.setMonth(a)};l.setDate=function(a){this.b.setDate(a)};
            l.add=function(a){if(a.ra||a.na){var b=this.getMonth()+a.na+12*a.ra,c=this.getYear()+Math.floor(b/12),b=b%12;0>b&&(b+=12);var d;a:{switch(b){case 1:d=0!=c%4||0==c%100&&0!=c%400?28:29;break a;case 5:case 8:case 10:case 3:d=30;break a}d=31}d=Math.min(d,this.getDate());this.setDate(1);this.setFullYear(c);this.setMonth(b);this.setDate(d)}a.da&&(a=new Date((new Date(this.getYear(),this.getMonth(),this.getDate(),12)).getTime()+864E5*a.da),this.setDate(1),this.setFullYear(a.getFullYear()),this.setMonth(a.getMonth()),
                    this.setDate(a.getDate()),ub(this,a.getDate()))};l.toString=function(){return[this.getFullYear(),xa(this.getMonth()+1),xa(this.getDate())].join("")+""};function ub(a,b){a.getDate()!=b&&a.b.setUTCHours(a.b.getUTCHours()+(a.getDate()<b?1:-1))}l.valueOf=function(){return this.b.valueOf()};function vb(a,b){var c;c=a.className;c=q(c)&&c.match(/\S+/g)||[];for(var d=Za(arguments,1),e=c.length+d.length,f=c,g=0;g<d.length;g++)0<=z(f,d[g])||f.push(d[g]);a.className=c.join(" ");return c.length==e};function wb(a,b){for(var c in a)b.call(void 0,a[c],c,a)}var xb="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function yb(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<xb.length;f++)c=xb[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var zb=!t||t&&9<=Ra,Ab=!u&&!t||t&&t&&9<=Ra||u&&w("1.9.1"),Bb=t&&!w("9"),Cb=t||Ha||v;function Db(a,b){var c=b||document;return c.querySelectorAll&&c.querySelector?c.querySelectorAll("."+a):c.getElementsByClassName?c.getElementsByClassName(a):Eb("*",a,b)}function O(a,b){var c=b||document,d=null;return(d=c.querySelectorAll&&c.querySelector?c.querySelector("."+a):Db(a,b)[0])||null}
            function Eb(a,b,c){var d=document;c=c||d;var e=a&&"*"!=a?a.toUpperCase():"";if(c.querySelectorAll&&c.querySelector&&(e||b))return c.querySelectorAll(e+(b?"."+b:""));if(b&&c.getElementsByClassName){a=c.getElementsByClassName(b);if(e){c={};for(var f=d=0,g;g=a[f];f++)e==g.nodeName&&(c[d++]=g);c.length=d;return c}return a}a=c.getElementsByTagName(e||"*");if(b){c={};for(f=d=0;g=a[f];f++){var e=g.className,h;if(h="function"==typeof e.split)h=0<=z(e.split(/\s+/),b);h&&(c[d++]=g)}c.length=d;return c}return a}
            function Fb(a,b){wb(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:d in Gb?a.setAttribute(Gb[d],b):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,b):a[d]=b})}var Gb={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
            function Hb(a,b,c){var d=arguments,e=document,f=d[0],g=d[1];if(!zb&&g&&(g.name||g.type)){f=["<",f];g.name&&f.push(' name="',ra(g.name),'"');if(g.type){f.push(' type="',ra(g.type),'"');var h={};yb(h,g);delete h.type;g=h}f.push(">");f=f.join("")}f=e.createElement(f);g&&(q(g)?f.className=g:aa(g)?vb.apply(null,[f].concat(g)):Fb(f,g));2<d.length&&Ib(e,f,d,2);return f}
            function Ib(a,b,c,d){function e(c){c&&b.appendChild(q(c)?a.createTextNode(c):c)}for(;d<c.length;d++){var f=c[d];!ba(f)||da(f)&&0<f.nodeType?e(f):C(Jb(f)?F(f):f,e)}}
            function Kb(){var a;var b=document;a=b.createElement("div");t?(a.innerHTML="<br><div class=ccjs-csc-diagram-wrapper><div class=ccjs-csc-diagram><div class=ccjs-barcode></div><div class=ccjs-signature>Signature and digits from card #</div><div class=ccjs-card-code>123</div><div class=ccjs-explanation>On most cards, the 3-digit security code is on the back, to the right of the signature.</div><button type=button class=ccjs-close>&times;</button></div><div class=ccjs-csc-diagram-amex><div class=ccjs-card-number>XXXX XXXXXX XXXXX</div><div class=ccjs-explanation>On American Express cards, the 4-digit security code is on the front, to the top-right of the card number.</div><div class=ccjs-card-code>1234</div><button type=button class=ccjs-close>&times;</button></div></div>",a.removeChild(a.firstChild)):
                    a.innerHTML="<div class=ccjs-csc-diagram-wrapper><div class=ccjs-csc-diagram><div class=ccjs-barcode></div><div class=ccjs-signature>Signature and digits from card #</div><div class=ccjs-card-code>123</div><div class=ccjs-explanation>On most cards, the 3-digit security code is on the back, to the right of the signature.</div><button type=button class=ccjs-close>&times;</button></div><div class=ccjs-csc-diagram-amex><div class=ccjs-card-number>XXXX XXXXXX XXXXX</div><div class=ccjs-explanation>On American Express cards, the 4-digit security code is on the front, to the top-right of the card number.</div><div class=ccjs-card-code>1234</div><button type=button class=ccjs-close>&times;</button></div></div>";
                if(1==a.childNodes.length)a=a.removeChild(a.firstChild);else{for(b=b.createDocumentFragment();a.firstChild;)b.appendChild(a.firstChild);a=b}return a}function Lb(a,b){Ib(Mb(a),a,arguments,1)}function Nb(a,b){b.parentNode&&b.parentNode.insertBefore(a,b.nextSibling)}function Tb(a){a&&a.parentNode&&a.parentNode.removeChild(a)}function Ub(a){return Ab&&void 0!=a.children?a.children:E(a.childNodes,function(a){return 1==a.nodeType})}
            function Vb(a){if(Cb&&!(t&&w("9")&&!w("10")&&m.SVGElement&&a instanceof m.SVGElement))return a.parentElement;a=a.parentNode;return da(a)&&1==a.nodeType?a:null}function Mb(a){return 9==a.nodeType?a:a.ownerDocument||a.document}
            function P(a,b){if("textContent"in a)a.textContent=b;else if(a.firstChild&&3==a.firstChild.nodeType){for(;a.lastChild!=a.firstChild;)a.removeChild(a.lastChild);a.firstChild.data=b}else{for(var c;c=a.firstChild;)a.removeChild(c);a.appendChild(Mb(a).createTextNode(String(b)))}}var Wb={SCRIPT:1,STYLE:1,HEAD:1,IFRAME:1,OBJECT:1},Xb={IMG:" ",BR:"\n"};
            function Yb(a){if(Bb&&"innerText"in a)a=a.innerText.replace(/(\r\n|\r|\n)/g,"\n");else{var b=[];Zb(a,b,!0);a=b.join("")}a=a.replace(/ \xAD /g," ").replace(/\xAD/g,"");a=a.replace(/\u200B/g,"");Bb||(a=a.replace(/ +/g," "));" "!=a&&(a=a.replace(/^\s*/,""));return a}
            function Zb(a,b,c){if(!(a.nodeName in Wb))if(3==a.nodeType)c?b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g,"")):b.push(a.nodeValue);else if(a.nodeName in Xb)b.push(Xb[a.nodeName]);else for(a=a.firstChild;a;)Zb(a,b,c),a=a.nextSibling}function Jb(a){if(a&&"number"==typeof a.length){if(da(a))return"function"==typeof a.item||"string"==typeof a.item;if("function"==p(a))return"function"==typeof a.item}return!1}function $b(){var a=document;try{return a&&a.activeElement}catch(b){}return null};function ac(){0!=bc&&(this[ea]||(this[ea]=++fa))}var bc=0;var cc="closure_listenable_"+(1E6*Math.random()|0);function dc(a){try{return!(!a||!a[cc])}catch(b){return!1}}var ec=0;function fc(a,b,c,d,e){this.m=a;this.F=null;this.src=b;this.type=c;this.capture=!!d;this.B=e;this.key=++ec;this.r=this.w=!1}function gc(a){a.r=!0;a.m=null;a.F=null;a.src=null;a.B=null};function Q(a){this.src=a;this.g={};this.G=0}Q.prototype.add=function(a,b,c,d,e){var f=this.g[a];f||(f=this.g[a]=[],this.G++);var g=hc(f,b,d,e);-1<g?(a=f[g],c||(a.w=!1)):(a=new fc(b,this.src,a,!!d,e),a.w=c,f.push(a));return a};Q.prototype.remove=function(a,b,c,d){if(!(a in this.g))return!1;var e=this.g[a];b=hc(e,b,c,d);return-1<b?(gc(e[b]),y.splice.call(e,b,1),0==e.length&&(delete this.g[a],this.G--),!0):!1};
            function ic(a,b){var c=b.type;if(c in a.g){var d=a.g[c],e=z(d,b),f;(f=0<=e)&&y.splice.call(d,e,1);f&&(gc(b),0==a.g[c].length&&(delete a.g[c],a.G--))}}Q.prototype.t=function(a,b,c,d){a=this.g[a];var e=-1;a&&(e=hc(a,b,c,d));return-1<e?a[e]:null};function hc(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.r&&f.m==b&&f.capture==!!c&&f.B==d)return e}return-1};var jc=!t||t&&9<=Ra,kc=t&&!w("9");!v||w("528");u&&w("1.9b")||t&&w("8")||Ha&&w("9.5")||v&&w("528");u&&!w("8")||t&&w("9");function R(a,b){this.type=a;this.currentTarget=this.target=b}R.prototype.n=!1;R.prototype.defaultPrevented=!1;R.prototype.Z=!0;R.prototype.preventDefault=function(){this.defaultPrevented=!0;this.Z=!1};function lc(a){lc[" "](a);return a}lc[" "]=function(){};function S(a,b){if(a){var c=this.type=a.type;R.call(this,c);this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(u){var e;a:{try{lc(d.nodeName);e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=v||void 0!==a.offsetX?a.offsetX:a.layerX;this.offsetY=v||void 0!==a.offsetY?a.offsetY:a.layerY;this.clientX=void 0!==a.clientX?a.clientX:a.pageX;this.clientY=void 0!==a.clientY?a.clientY:
                    a.pageY;this.screenX=a.screenX||0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.I=a;a.defaultPrevented&&this.preventDefault();delete this.n}}qa(S,R);l=S.prototype;l.target=null;l.relatedTarget=null;l.offsetX=0;l.offsetY=0;l.clientX=0;l.clientY=0;l.screenX=0;l.screenY=0;l.button=0;l.keyCode=0;
            l.charCode=0;l.ctrlKey=!1;l.altKey=!1;l.shiftKey=!1;l.metaKey=!1;l.I=null;l.preventDefault=function(){S.pa.preventDefault.call(this);var a=this.I;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,kc)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var mc="closure_lm_"+(1E6*Math.random()|0),T={},nc=0;function U(a,b,c,d,e){if(aa(b)){for(var f=0;f<b.length;f++)U(a,b[f],c,d,e);return null}c=oc(c);if(dc(a))a=a.L(b,c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,g=pc(a);g||(a[mc]=g=new Q(a));c=g.add(b,c,!1,d,e);c.F||(d=qc(),c.F=d,d.src=a,d.m=c,a.addEventListener?a.addEventListener(b,d,f):a.attachEvent(b in T?T[b]:T[b]="on"+b,d),nc++);a=c}return a}
            function qc(){var a=rc,b=jc?function(c){return a.call(b.src,b.m,c)}:function(c){c=a.call(b.src,b.m,c);if(!c)return c};return b}function sc(a,b,c,d,e){if(aa(b))for(var f=0;f<b.length;f++)sc(a,b[f],c,d,e);else c=oc(c),dc(a)?a.M(b,c,d,e):a&&(a=pc(a))&&(b=a.t(b,c,!!d,e))&&tc(b)}
            function tc(a){if(!ca(a)&&a&&!a.r){var b=a.src;if(dc(b))ic(b.p,a);else{var c=a.type,d=a.F;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent&&b.detachEvent(c in T?T[c]:T[c]="on"+c,d);nc--;(c=pc(b))?(ic(c,a),0==c.G&&(c.src=null,b[mc]=null)):gc(a)}}}function uc(a,b,c,d){var e=1;if(a=pc(a))if(b=a.g[b])for(b=F(b),a=0;a<b.length;a++){var f=b[a];f&&f.capture==c&&!f.r&&(e&=!1!==vc(f,d))}return Boolean(e)}function vc(a,b){var c=a.m,d=a.B||a.src;a.w&&tc(a);return c.call(d,b)}
            function rc(a,b){if(a.r)return!0;if(!jc){var c;if(!(c=b))a:{c=["window","event"];for(var d=m,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new S(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(g){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,h=e.length-1;!c.n&&0<=h;h--)c.currentTarget=e[h],d&=uc(e[h],f,!0,c);for(h=0;!c.n&&h<e.length;h++)c.currentTarget=
                    e[h],d&=uc(e[h],f,!1,c)}return d}return vc(a,new S(b,this))}function pc(a){a=a[mc];return a instanceof Q?a:null}var wc="__closure_events_fn_"+(1E9*Math.random()>>>0);function oc(a){return"function"==p(a)?a:a[wc]||(a[wc]=function(b){return a.handleEvent(b)})};function xc(){ac.call(this);this.p=new Q(this);this.ca=this}qa(xc,ac);xc.prototype[cc]=!0;l=xc.prototype;l.Y=null;l.addEventListener=function(a,b,c,d){U(this,a,b,c,d)};l.removeEventListener=function(a,b,c,d){sc(this,a,b,c,d)};
            l.dispatchEvent=function(a){var b,c=this.Y;if(c)for(b=[];c;c=c.Y)b.push(c);var c=this.ca,d=a.type||a;if(q(a))a=new R(a,c);else if(a instanceof R)a.target=a.target||c;else{var e=a;a=new R(d,c);yb(a,e)}var e=!0,f;if(b)for(var g=b.length-1;!a.n&&0<=g;g--)f=a.currentTarget=b[g],e=yc(f,d,!0,a)&&e;a.n||(f=a.currentTarget=c,e=yc(f,d,!0,a)&&e,a.n||(e=yc(f,d,!1,a)&&e));if(b)for(g=0;!a.n&&g<b.length;g++)f=a.currentTarget=b[g],e=yc(f,d,!1,a)&&e;return e};l.L=function(a,b,c,d){return this.p.add(a,b,!1,c,d)};
            l.M=function(a,b,c,d){return this.p.remove(a,b,c,d)};function yc(a,b,c,d){b=a.p.g[b];if(!b)return!0;b=F(b);for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.r&&g.capture==c){var h=g.m,s=g.B||g.src;g.w&&ic(a.p,g);e=!1!==h.call(s,d)&&e}}return e&&!1!=d.Z}l.t=function(a,b,c,d){return this.p.t(a,b,c,d)};function zc(a,b){if("function"==p(a))b&&(a=ja(a,b));else if(a&&"function"==typeof a.handleEvent)a=ja(a.handleEvent,a);else throw Error("Invalid listener argument");return m.setTimeout(a,0)};function Ac(a){ac.call(this);this.V=a;this.W={}}qa(Ac,ac);var Bc=[];Ac.prototype.L=function(a,b,c,d,e){aa(b)||(Bc[0]=b,b=Bc);for(var f=0;f<b.length;f++){var g=U(a,b[f],c||this,d||!1,e||this.V||this);if(!g)break;this.W[g.key]=g}return this};Ac.prototype.M=function(a,b,c,d,e){if(aa(b))for(var f=0;f<b.length;f++)this.M(a,b[f],c,d,e);else e=e||this.V||this,c=oc(c||this),d=!!d,b=dc(a)?a.t(b,c,d,e):a?(a=pc(a))?a.t(b,c,d,e):null:null,b&&(tc(b),delete this.W[b.key]);return this};
            Ac.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function Cc(a){if(a.altKey&&!a.ctrlKey||a.metaKey||112<=a.keyCode&&123>=a.keyCode)return!1;switch(a.keyCode){case 18:case 20:case 93:case 17:case 40:case 35:case 27:case 36:case 45:case 37:case 224:case 91:case 144:case 12:case 34:case 33:case 19:case 255:case 44:case 39:case 145:case 16:case 38:case 224:case 92:return!1;case 0:return!u;default:return 166>a.keyCode||183<a.keyCode}};function V(a){xc.call(this);this.s=a;a=t||v&&!w("531")&&"TEXTAREA"==a.tagName;this.ea=new Ac(this);this.ea.L(this.s,a?["keydown","paste","cut","drop","input"]:"input",this)}qa(V,xc);V.prototype.v=null;
            V.prototype.handleEvent=function(a){if("input"==a.type)Dc(this),Ha&&this.s!=Mb(this.s).activeElement||this.dispatchEvent(Ec(a));else if("keydown"!=a.type||Cc(a)){var b="keydown"==a.type?this.s.value:null;t&&229==a.keyCode&&(b=null);var c=Ec(a);Dc(this);this.v=zc(function(){this.v=null;this.s.value!=b&&this.dispatchEvent(c)},this)}};function Dc(a){null!=a.v&&(m.clearTimeout(a.v),a.v=null)}function Ec(a){a=new S(a.I);a.type="input";return a};function Fc(a,b){null==a.getAttribute("autocomplete")&&(a.setAttribute("autocomplete",b),a.setAttribute("autocompletetype",b),a.setAttribute("x-autocompletetype",b))}function Gc(a,b){for(var c=Ub(a),d=c.length-1,e=c[c.length-1],f=e.value.length,e=Yb(e).length,g=String(b),h=parseInt(g,10),s=[],D,k=0;k<d;k++)D=g.slice(g.length-f,g.length),g=g.slice(g.length-e,g.length),D=Hb("option",{value:D}),P(D,g),s.push(D),h++,g=String(h);for(k=c.length;1<=k;k--)Tb(c[k]);C(s,function(b){Lb(a,b)})}
            function Hc(a,b,c){setTimeout(function(){if(b!==c){var d=Sa(a)[1];a.value=c;if(b.length>c.length){for(var e=b.length,f=0;f<c.length;f++)if(b.charAt(f)!==c.charAt(f)){e=f;break}d=e===d?d:e+1===d?Math.max(0,d-1):d}else d=b.length<c.length?d+1:d;Ua(a,d)}},0)}
            function Ic(a){var b=W,c=O(x("hidden-card-type"),b);if(c){a.H=c;var d=Ub(c),d=F(d);a.A=Xa(d,function(a,b){var c=b.className;c&&(a[c]=Yb(b));return a});(b=O(x("type-read-only"),b))?a.l=b:(a.l=Hb("div",x("type-read-only")),Nb(a.l,c))}else a.l=Hb("div",x("type-read-only"))}
            var Jc=x("card-type-set"),Kc=x("card-type-error"),Lc=function(a){return y.concat.apply(y,arguments)}(I.ha(),Jc,Kc),X=m.ccjs||{},W=O(x("card")),Z=new function(){function a(){var a=k.u;k.u=k.C&&k.D&&k.K&&k.J;a!==k.u&&C(k.X,function(a){a(k.u)})}function b(){ob(ka,"disabled")||(ka.focus(),sb(ka),sb(B))}function c(b,c){var d=new tb(c,b,1),d=Ca.getFullYear()<d.getFullYear()?!0:Ca.getFullYear()===d.getFullYear()?Ca.getMonth()<=d.getMonth()?!0:!1:!1;k.J=d;a();return d}this.X=[];this.$="Sorry, we don't accept %s.";
                var d=Eb("fieldset",x("expiration"),W)[0],e=Eb("input",x("csc"),W)[0],f=Eb("input",x("number"),W)[0],g=f.cloneNode(!0);g.removeAttribute("name");g.removeAttribute("id");g.removeAttribute("data-encrypted-name");g.className=x("number-formatted");M(f,x("hidden"));Nb(g,f);if($b()===f){g.focus();var h=g.value;h&&(h=h.length,0<h&&Ua(g,h))}var s=Eb("input",x("name"),W)[0];M(W,x("js-enabled"));Ic(this);var D=/\D/g,k=this;g.setAttribute("inputmode","numeric");Fc(g,"cc-number");var n;this.u=this.J=this.K=this.D=
                        this.C=!1;h=this.ka=function(b){fb(g,function(b,c,d){(n=b)&&n!==I.Q&&(k.A.hasOwnProperty(n.a)||(c=1));a:{b=k;var h=n;if(h){if(b.H){b.H.selectedIndex=-1;var Y=O(h.a,b.H);Y&&(Y.selected=!0)}rb(b.l,Lc);if(b.A){Y=b.A[h.a];if(null==Y)if(h===I.Q)Y=b.A[I.P.a];else{M(W,Kc);P(b.l,b.$.replace(/%s/,h.k));break a}pb(W,[h.a,Jc]);P(b.l,Y);M(b.l,h.a)}}else rb(W,Lc)}n?(e.value=e.value.slice(0,n.c),e.setAttribute("placeholder","\u2022\u2022\u2022\u2022".slice(0,n.c))):e.setAttribute("placeholder","\u2022\u2022\u2022");
                    f.value=d;null===c?(N(g,x("complete"),!0),k.C=!0):(N(g,x("complete"),!1),k.C=!1);a();1===c||2===c?N(g,x("error"),!0):N(g,x("error"),!1)},b)};U(new V(g),"input",h);var A=!1;this.T=function(){A=""!==s.value;k.K=A;a();N(s,x("complete"),A)};U(new V(s),"input",this.T);h=Kb();Nb(h,Vb(e));var B=Db(x("csc-diagram-wrapper"),W)[0],ka=O(x("csc-help"),W);ka.setAttribute("tabindex",-1);U(ka,"click",b);C(Db(x("close"),B),function(a){U(a,"click",b)});e.setAttribute("inputmode","numeric");e.setAttribute("pattern",
                        "\\d*");Fc(e,"cc-csc");this.R=function(){var b=e.value,c=b.replace(D,""),d,f;null!=n?(d=n.c,f=n.e):(d=I.O.c,f=I.O.e);c=c.slice(0,d);Hc(e,b,c);b=c.length;k.D=b===f||b===d?!0:!1;a();N(e,x("complete"),k.D)};U(new V(e),"input",this.R);Fc(s,"cc-full-name");var Da=O(x("month"),d),la=O(x("year"),d);Fc(Da,"cc-exp-month");Fc(la,"cc-exp-year");var Ca=new tb,h=Ca.getYear(),Mc=h.toString().slice(0,-2);Gc(la,h);var ma,na;this.S=function(){var a=Da.value;"MM"!==a&&(ma=parseInt(a,10)-1,null!=ma&&null!=na&&(a=c(ma,
                        na),N(d,x("complete"),a),N(d,x("error"),!a)))};U(Da,"change",this.S);this.U=function(){var a=la.value;"YY"!==a&&(na=parseInt(Mc+a,10),null!=ma&&null!=na&&(a=c(ma,na),N(d,x("complete"),a),N(d,x("error"),!a)))};U(la,"change",this.U);this.ia=function(){return g.value};this.ja=function(){return e.value};this.getMonth=function(){return Da.value};this.getYear=function(){return la.value};this.getName=function(){return s.value};var Ob="",Pb="",Qb="",Rb="",Sb="";this.ga=function(){var a=k.ia();Ob!==a&&(Ob=
                        a,k.ka(!0));a=k.ja();Pb!==a&&(Pb=a,k.R());a=k.getMonth();Qb!==a&&(Qb=a,k.S());a=k.getYear();Rb!==a&&(Rb=a,k.U());a=k.getName();Sb!==a&&(Sb=a,k.T())};this.oa=function(){k.ga();setTimeout(arguments.callee,1E3)}};m.ccjs=m.ccjs||X;m.creditcardjs=m.creditcardjs||X;X.CARD_NUMBER="CARD_NUMBER";X.SECURITY_CODE="SECURITY_CODE";X.EXPIRATION="EXPIRATION";X.NAME="NAME";X.onload=function(a){a()};
            X.getInvalidFields=function(){var a=[];Z.C||a.push(X.CARD_NUMBER);Z.D||a.push(X.SECURITY_CODE);Z.J||a.push(X.EXPIRATION);Z.K||a.push(X.NAME);return a};X.isValid=function(){return Z.u};X.onValidityChange=function(a){Z.X.push(a)};X.setLocale=function(a){var b=O(x("signature"),W),c=O(x("csc-diagram"),W),d=O(x("csc-diagram-amex"),W),c=O(x("explanation"),c),d=O(x("explanation"),d);P(b,a.signatureHelp);P(d,a.americanHelp);P(c,a.cardsHelp);if(a=a.unsupportedCard)Z.$=a};Z.oa();C(X.q||[],function(a){(0,a[0])()});})();

    }


});



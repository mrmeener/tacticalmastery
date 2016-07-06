function args(e){var t={},a=/^jQuery\d+$/;return $.each(e.attributes,function(e,r){r.specified&&!a.test(r.name)&&(t[r.name]=r.value)}),t}function api(e,t,a){var r="https://api.tacticalmastery.com";$.ajax({type:"GET",url:r+"/"+e+"/",data:t,contentType:"application/json",success:function(e){"undefined"!=typeof e.result,a(e)},error:function(e){console.log("error")}})}function getQueryVariable(e){for(var t=window.location.search.substring(1),a=t.split("&"),r=0;r<a.length;r++){var n=a[r].split("=");if(decodeURIComponent(n[0])==e)return decodeURIComponent(n[1])}return""}function randString(e){for(var t="";t.length<e&&e>0;){var a=Math.random();t+=a<.1?Math.floor(100*a):String.fromCharCode(Math.floor(26*a)+(a>.5?97:65))}return t}function getSetSet(e,t,a){t=t||"",a=a||e;var r=t;"undefined"!=typeof Storage&&(r=localStorage.getItem(e),null==r&&(r=getQueryVariable(a)),localStorage.setItem(e,r)),$("input[name="+e+"]").val(r)}function getFirstLast(e){var t=e.split(" "),a=t[0];t.shift();var r="";return r=t instanceof Array?t.join(" "):t,[a,r]}function afGetGet(e,t){t=t||!1;var a;return"undefined"!=typeof Storage&&(a=localStorage.getItem(e)),t&&(qParam=getQueryVariable(t),qParam&&(localStorage.setItem(e,qParam),a=qParam)),a?a.replace(/[+]/g," "):a}function afSetSet(e,t){"undefined"!=typeof Storage&&localStorage.setItem(e,t)}function addHiddenField(e,t,a){var r=document.createElement("input");r.type="hidden",r.name=t,r.value=a,e.appendChild(r)}function SubmitSubmit(e){$("div#js-div-loading-bar").show();var t=$("select[name=year]").val(),a=$("select[name=month]").val(),r=new Date,n=r.getFullYear().toString().substr(2,2),o=("0"+(r.getMonth()+1)).slice(-2);if(!(n<t||n==t&&o<=a))return $("div#js-div-loading-bar").fadeOut(),void makePrettyModal("<h2>Problem with your order</h2><p>Invalid Expiration Date</p>");var s=[];"orderform"==pageInfo.type&&(s=["firstName","lastName","emailAddress","phoneNumber","address1","address2","city","state","postalCode","cardNumber","cardSecurityCode","month","year","campaignId","product1_id","product1_qty"]);var i="campaignId=3&product1_qty=1";$(e).find("input").each(function(){if($.inArray($(this).attr("name"),s)!=-1){var e=$(this).val();e&&(e=encodeURIComponent(e),$(this).is(":radio")?$(this).is(":checked")&&(""!=i&&(i+="&"),i+=$(this).attr("name")+"="+e,"product1_id"===$(this).attr("name")&&afSetSet("initialProductId",e)):(""!=i&&(i+="&"),i+=$(this).attr("name")+"="+e))}}),$(e).find("select").each(function(){if($.inArray($(this).attr("name"),s)!=-1){var e=$(this).val();e&&(""!=i&&(i+="&"),i+=$(this).attr("name")+"="+e)}}),window.myOrderID&&(i+="&orderId="+window.myOrderID);var d=["affId","s1","s2","s3"];return $.each(d,function(e,t){ls_name="f_"+t,f_val=afGetGet(ls_name,t),f_val&&(""!=i&&(i+="&"),i+=t+"="+f_val)}),api("order",i,function(e){switch(json=JSON.parse(e),json.result){case"SUCCESS":"undefined"!=typeof json.message.orderId&&(window.myOrderID=json.message.orderId,afSetSet("orderId",myOrderID)),document.location="/tacticalsales/us_recharge.html?orderId="+window.myOrderID;break;case"ERROR":if(json.message){var t="Problem with your order";"Invalid Credit Card Number"!=json.message.trim()&&(json.message='Eek! Something went dark with your order and it was not processed. Call our support team to shed some light and get your order processed right away! - <a href="tel:+18444478240">(844) 447-8240</a>');var a='<span style="color:red;font-size:24px">'+json.message+"</span>";makePrettyModal("<h3>"+t+"</h3>"+a)}}$("div#js-div-loading-bar").fadeOut()}),$(e).find("input.af").each(function(){""!=$(this).val()&&(f_name="f_"+$(this).attr("name"),afSetSet(f_name,$(this).val()),"f_fullName"==f_name&&(nameParts=getFirstLast($(this).val()),afSetSet("f_firstName",nameParts[0]),afSetSet("f_lastName",nameParts[1])))}),!1}function doUpsellYes(e,t){if($("div#js-div-loading-bar").show(),window.myOrderID){var a="orderId="+window.myOrderID+"&productQty=1",r="/tacticalsales/us_hlmp.html?orderId="+window.myOrderID;switch(e){case"hdlmp":t=$("#lampId").val()||"31",r="/tacticalsales/thankyou.html?orderId="+window.myOrderID;break;case"recharge":t=t||"12",r="/tacticalsales/us_hlmp.html?orderId="+window.myOrderID}t&&(a+="&productId="+t,api("upsell",a,function(e){if(json=JSON.parse(e),"SUCCESS"==json.result)return void(document.location=r);if("ERROR"==json.result){if(json.message){var t="";if("string"==typeof json.message){if(t=json.message,"This upsale was already taken."===t)return void(document.location=r)}else for(var a in json.message)json.message.hasOwnProperty(a)&&(t+=a+":"+json.message[a]+"<br>");makePrettyModal("<h2>Problem with your Addon</h2><p>"+t+"</p>")}}else makePrettyModal("<h2>Problem with your Addon</h2><p>An unknown error occured, try again or call our customer service</p>");$("div#js-div-loading-bar").fadeOut()}))}else alert("There was an error finding your order, please refresh the page and try again."),$("div#js-div-loading-bar").fadeOut()}function doUpsellNo(e){$("div#js-div-loading-bar").show();var t="/tacticalsales/thankyou.html?orderId="+window.myOrderID;switch(e){case"recharge":t="/tacticalsales/us_hlmp.html?orderId="+window.myOrderID}document.location=t}function populateThanksPage(e){"array"===$.type(e)&&(e=e[0]),$("#totalBilled").html(e.currencySymbol+" "+e.price),$("#orderNumber").html(e.orderId),$("#totItems").html("Order Summary"),$.each(e.items,function(e,t){$("#orderDet tr:last").after("<tr><td>"+t.name+'</td><td class="text-right">'+t.price+"</td></tr>")}),api("trans","orderId={0}".sprtf(myOrderID),function(e){json=JSON.parse(e),"SUCCESS"==json.result&&json.message.data&&(firstRow=json.message.data[0],firstRow&&firstRow.merchantDescriptor?$("#ccIdentity").html("<br>"+firstRow.merchantDescriptor):$("#ccIdentity").html("<br>Tactical Mastery"))})}function makePrettyModal(e,t){t=t||!1;var a=new tingle.modal({footer:t,stickyFooter:!1,onOpen:function(){},onClose:function(){}});a.setContent(e),a.open()}function termsModal(e){bModal=!1,$.get("terms.html",function(e){makePrettyModal(e)})}function affiliateModal(e){bModal=!1,$.get("affiliate.html",function(e){makePrettyModal(e)})}function privacyModal(e){bModal=!1,$.get("privacy.html",function(e){makePrettyModal(e)})}function custcareModal(e){bModal=!1,$.get("customercare.html",function(e){makePrettyModal(e)})}function validate(){return!0}String.prototype.sprtf=function(){var e,t;return t=/\{\d+\}/g,e=arguments,this.replace(t,function(t){return e[t.match(/\d+/)]})},$(document).ready(function(){if(void 0!=pageInfo){window.trkStuff=new Array;var e=["affId","s1","s2","s3"],t=document.forms.formLead,a="";if($.each(e,function(e,r){var n="f_"+r,o=afGetGet(n,r);o&&(trkStuff[r]=o,void 0!=t&&addHiddenField(t,r,o),a+="&"+r+"="+o)}),$("a.ilink").each(function(){var e="https://tacticalmastery.com/tacticalsales/index.html?ref="+location.pathname.substring(1)+a;$(this).attr("href",e)}),pageInfo.autopopulate&&$("input.af").each(function(){f_name="f_"+$(this).attr("name"),$(this).val(afGetGet(f_name,$(this).attr("name")))}),pageInfo.hasorderid)if("orderform"==pageInfo.type?window.myOrderID=null:window.myOrderID=afGetGet("orderId","orderId"),null==myOrderID){paramString="";var r=!0,n=["firstName","lastName","phoneNumber"],o=["emailAddress","affId","s1","s2","s3"];$.each(n.concat(o),function(e,t){ls_name="f_"+t,f_val=afGetGet(ls_name,t),f_val?(""!=paramString&&(paramString+="&"),paramString+=t+"="+f_val):n.indexOf(t)!=-1&&(r=!1)}),r&&api("createlead",paramString,function(e){json=JSON.parse(e),"undefined"!=typeof json.message.orderId&&(window.myOrderID=json.message.orderId,afSetSet("orderId",myOrderID))})}else api("getlead","orderId={0}".sprtf(myOrderID),function(e){if(json=JSON.parse(e),"thankyou"==pageInfo.type)"SUCCESS"==json.result?populateThanksPage(json.message.data):"ERROR"==json.result?alert("Error: "+json.message):alert("undefined error. please try again");else if(json.message&&json.message.data&&json.message.data[0]&&"COMPLETE"==json.message.data[0].orderStatus){var t=!0;if("upsell"==pageInfo.type){var a=json.message.data[0].dateUpdated+" GMT-0400",r=new Date(a),n=new Date,o=(n-r)/1e3/60;t=o>55}t&&(isBack=!1,setTimeout("location.href = '/thankyou.html';",1500))}});"orderform"==pageInfo.type&&($("#frm_order").formValidation({framework:"bootstrap",err:{container:"#formerrors"},fields:{firstName:{row:".field",validators:{notEmpty:{message:"First name is required"},stringLength:{min:3,max:30,message:"The name must be more than 3 and less than 30 characters long"},regexp:{regexp:/^[a-zA-Z0-9_\-]+$/,message:"Names can only consist of alphabetical, number, underscore and hyphen"}}},lastName:{row:".field",validators:{notEmpty:{message:"Last name is required"},stringLength:{min:3,max:30,message:"The name must be more than 3 and less than 30 characters long"},regexp:{regexp:/^[a-zA-Z0-9_\-]+$/,message:"Names can only consist of alphabetical, number, underscore and hyphen"}}},emailAddress:{row:".field",validators:{notEmpty:{message:"The email address is required"},emailAddress:{message:"The input is not a valid email address"}}},phoneNumber:{row:".field",validators:{notEmpty:{message:"Phone number is required"},stringLength:{min:9,max:20,message:"Please use a proper phone number, area code first"}}},address1:{row:".field",validators:{notEmpty:{message:"Please enter a street address"},stringLength:{min:2,max:60,message:"please enter a full street adress"}}},state:{row:".field",validators:{notEmpty:{message:"Please enter a city name"}}},city:{row:".field",validators:{notEmpty:{message:"Please enter a city name"},stringLength:{min:2,max:50,message:"Please enter a proper length city"}}},postalCode:{row:".field",validators:{notEmpty:{message:"Please enter a zip code"},stringLength:{min:5,max:10,message:"please enter a 5 digit or 9 digit zip code"}}},cardNumber:{row:".field",validators:{notEmpty:{message:"Please enter a valid card number"},stringLength:{min:14,max:16,message:"Credit card must be 15 or 16 digits"}}},cardSecurityCode:{row:".field",validators:{notEmpty:{message:"Please enter a valid security code"},stringLength:{min:3,max:4,message:"Security code Invalid Length"}}},cardNumberSpace:{row:".field",validators:{notEmpty:{message:"Please enter a valid card number"},stringLength:{min:13,max:16,message:"Card number Invalid Length"}}}}}).on("status.field.fv",function(e,t){t.fv.disableSubmitButtons(!1)}).on("success.field.fv",function(e,t){t.fv.getSubmitButton()&&t.fv.disableSubmitButtons(!1)}).on("err.form.fv",function(e){makePrettyModal("<h2>There were errors</h2>"+$("#formerrors").html(),!1),e.preventDefault()}).on("success.form.fv",function(e){fakevar=SubmitSubmit("#frm_order"),e.preventDefault()}),$.getJSON("//geo.tacticalmastery.com/get/",function(e){e&&e.region&&$("#f_state option").filter(function(){return $(this).text()==e.region}).prop("selected",!0)})),"upsell"==pageInfo.type&&($("#upsellYes").click(function(e){isBack=!1,doUpsellYes(pageInfo.upsellval)}),$("#upsellNo").click(function(e){isBack=!1,doUpsellNo(pageInfo.upsellval)}))}});var bModal=!0;$(document).ready(function(){var e=new tingle.modal,t='<div class="offer-off"><p class="title">Enter Your Name and Telephone number To INSTANTLY Receive 75% Off The Tactical Mastery Flashlight!</p><form action="checkout.html" method="GET" id="js-form-lead" name="formLead"><input type="text" class="form-control half-size" id="js-text-first-name" name="firstName" placeholder="Enter Your First Name"><input type="text" class="form-control half-size" id="js-text-last-name" name="lastName" placeholder="Your Last Name"><input type="tel" class="form-control full-size" id="js-text-phone-number" name="phoneNumber" placeholder="Your Phone Number"><button type="submit" id="js-btn-confirm" class="btn btn-block btn-submit kform_submitBtn" onclick="return validate();"><i class="fa fa-check"></i><span trans>YES! Instantly Apply My 75% Discount</span></button><p class="no-spam">* we will not spam, rent, or sell your information... *</p></form></div>';e.setContent(t),window.modFormBtnClick=function(t){e.open()}}),window.onbeforeunload=function(e){},history.pushState(null,null,location.href),window.onpopstate=function(e){history.go(1)};
var _result = "";
var _id = "";
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.text == 'report_back') {
       // pass back user-id
       var elements = document.getElementsByClassName("permalink-header")[0];
       var div = elements.getElementsByClassName("js-user-profile-link")[0];
       var id = div.getAttribute("data-user-id");
       _id = id;
      // get retweets
      var no = document.getElementsByClassName("js-stat-retweets")[0];
      //changes for exception with 0 retweet
      if (no == undefined){
        retweets = "0";
      }
      else{
          var a = no.getElementsByClassName("request-retweeted-popup")[0];
          var retweets = a.getAttribute("data-tweet-stat-count");
      };

      //get title
      var result = document.getElementsByClassName("js-tweet-text")[0];
      var title= result.innerHTML.split("<")[0];
      var jsonString = '{"id":'+'"'+id+'"'+","+'"retweets":'+'"'+retweets+'"'+","+'"title":'+'"'+title+'"'+"}";

      //make it into json string
      function jsonEscape(str)  {
        return str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
      }
      sendResponse(jsonEscape(jsonString));
      alert("wait for sending data to server");
  }
});


// Inform the background page that
// this tab should have a page-action
chrome.runtime.sendMessage({from:'content',subject: 'showPageAction'});

//
function getResult(content){
  _result = content;
}
//
function WaitForResult(){
  chrome.runtime.sendMessage({from:'content',subject: 'showResult'},getResult);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
      WaitForResult();
      if(_result ==""){
        var domInfo = {score: "..load.."};
        response(domInfo);
      }
      else{
        var domInfo = _result;
        response(domInfo);
      }
    }
    if ((msg.from === 'popup') && (msg.subject === 'userid')) {
      response(_id);
    }

});

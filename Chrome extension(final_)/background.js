var _score = 0;
var _response ="";
var aim = /(https:\/\/twitter.com\/)([\s\S]*)(\/status\/)([\s\S]*)/;

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        // only at this url activate the pluin
        pageUrl: {hostContains: 'twitter.com' },
      })],
      // change the icon into colored
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});


// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
    // call the http method to send the data in "toJSON"
    if (domContent == undefined) {
      alert("issue")
    }
    else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://cxa18-api.herokuapp.com/withlinks", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          console.log(xhr.responseText);
          var resp = JSON.parse(xhr.responseText);
            _response = resp;
          }
      }
      xhr.send(domContent);

      setTimeout(function(){
      console.log("here it is");
      chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function(tabs) {
        tabId = tabs[0].id;
            //--------------------------------------------processing-------------------------------
          _score = parseInt(_response.score);
          if(_score >= 75){
            chrome.pageAction.setPopup({tabId, popup: "html_credible.html"});
          }
          else if (_score>40 && _score<75) {
            chrome.pageAction.setPopup({tabId, popup: "html_caution.html"});
          }
          else {
            chrome.pageAction.setPopup({tabId, popup: "html_warning.html"});
          }
      });
      if (_response=="") {
        alert("Network Problem");
      }
    },6000);
  }
}

// count to avoid repeated refreshing
var times = 0
var urlNow = ""

chrome.tabs.onUpdated.addListener(function(id,changeinfo,tab){
  chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function(tabs) {
    urlNow = tabs[0].url;
  });

  if(changeinfo.status == "complete" && aim.test(urlNow)== true){
    times += 1;
    console.log("+1");
  }
  // pictures are also loaded
  if (times >= 1) {
      chrome.tabs.sendMessage(id,{text:'report_back'},doStuffWithDom);
      console.log('I send the following DOM content: report_back');
      times = 0;
  }
});


chrome.runtime.onMessage.addListener(function (msg, sender,response) {
// First, validate the message's structure
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
      chrome.pageAction.show(sender.tab.id);
    };

    if ((msg.from === 'content') && (msg.subject === 'showResult')) {
      response(_response);
    };
});

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler(word) {
  
  return function(info, tab) {

    // The srcUrl property is only available for image elements.
    var query = info.selectionText;
    chrome.tabs.create({url: "http://thoughtlog.thehelmet.life?term=" + query});
    // var url = 'info.html#' + info.srcUrl;

    // // Create a new window to the info page.
    // chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "log your thought",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : getClickHandler()
});

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show() {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

  $.get( "http://ec2-35-154-178-237.ap-south-1.compute.amazonaws.com/api/thoughts", function( data ) {
  // $( ".result" ).html( data );
  // alert( "Load was performed." );
  thought=data.reverse()[0];
  if (localStorage.lastThought == thought._id)
  {
    localStorage.lastThought=thought._id
    var notification = new Notification(hour + time[2] + ' ' + period, {
    icon: '48.png',
    body: thought.description
  });
    notification.onclick = function () {
      window.open("http://stackoverflow.com/a/13328397/1269037");      
    };
  }

  
});
  
}

function gotoHome(){
      console.log('hhhhhhhhhhhhhhhhhjjkhjh')
        chrome.tabs.create({url: "http://thoughtlog.thehelmet.life"});
    };

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.lastThought='11';
  $.get( "http://ec2-35-154-178-237.ap-south-1.compute.amazonaws.com/api/thoughts", function( data ) {
    localStorage.lastThought=data.reverse()[0]._id;
  })
  
}

// Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { show(); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;

    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      show();
      interval = 0;
    }
  }, 60000);
}

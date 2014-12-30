// YOUR CODE HERE:

var message = {
  'username': window.location.search.slice(10),
  'text': 'trololo',
  'roomname': '4chan'
};

$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});

// create object to store existing message IDs
var storage = {};

var getMessage = function(limit){
 $.ajax({
   // always use this url
   url: 'https://api.parse.com/1/classes/chatterbox/',
   type: 'GET',
   contentType: 'application/json',
   data: {order: '-createdAt', limit: limit},
   success: function (data) {
     console.log('chatterbox: Message received');
     //grab data from server, loop through array of objects
     var messages = data.results;
     // for each object, select what we want to display on the screen
     for (var i = 0; i < messages.length; i++) {
       // If message ID does not exist in storage
       if (!storage[messages[i].objectId]) {
         // create an element and set its' innerText to the data associated with that object
         var newMessage = document.createElement('div');
         newMessage.innerText = messages[i].username + ': ' + messages[i].text;
         // append to dom and add ID to storage
         $('#main').prepend(newMessage);
         storage[messages[i].objectId] = messages[i].objectId;
       }
     }
   },
   error: function (data) {
     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
     console.error('chatterbox: Failed to receive message');
   }
 });
};

getMessage(10);

// Interval to refresh chat
setInterval(function() {
  getMessage(10);
}, 1000);






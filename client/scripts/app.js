// YOUR CODE HERE:
$(document).ready(function(){

  ///////////////// Send Messages /////////////////

  $('#chatButton').on('click', function() {
    message['text'] = $('#chatText').val();
    sendMessage();
    $('#chatText').val('');
  });

  $('#chatText').keyup(function(e) {
    /*e.preventDefault();*/
    if (e.keyCode === 13) {
      $('#chatButton').click();
    }
  });

  var message = {
    'username': window.location.search.slice(10),
    'text': '',
    'roomname': "WES' PLACE"
  };

  var sendMessage = function() {
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
  };

  ///////////////// Get & Display Messages /////////////////

  // create object to store existing message objects displayed in chat
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
           newMessage.innerText = messages[i].username + ': ' + messages[i].text + ', ' + messages[i].roomname;
           // append to dom and add message object to storage
           $('#main').prepend(newMessage);
           storage[messages[i].objectId] = messages[i];
         }
       }
     },
     error: function (data) {
       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
       console.error('chatterbox: Failed to receive message');
     }
   });
  };

  ///////////////// Chatroom Display /////////////////

  // object to track existing chatrooms in DOM
  var chatRooms = {};

  // check whether storage objects have any chatrooms that chatRooms object does not
  var createChatRooms = function () {
    // loop through storage object
    for (var key in storage) {
      // if storage chatroom is not a property of chatRooms object
      if (!chatRooms[storage[key].roomname]) {
        // add to chatRooms object
        chatRooms[storage[key].roomname] = storage[key].roomname;
        // append new chatroom to DOM
        var newChat = document.createElement('div');
        newChat.innerText = storage[key].roomname;
        $('body').append(newChat);
      }
    }
  };

  ///////////////// Update Messages and Chatrooms /////////////////

  getMessage(10);
  createChatRooms();

  // Interval to refresh chat and chatrooms
  setInterval(function() {
    getMessage(10);
    createChatRooms();
  }, 1000);

});

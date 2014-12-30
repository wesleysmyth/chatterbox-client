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
    'roomname': "Kiran's Place"
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
          // add message object to storage
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
      if (!chatRooms[storage[key].roomname] && storage[key].roomname !== undefined && storage[key].roomname !== '') {
        // add to chatRooms object
        chatRooms[storage[key].roomname] = storage[key].roomname;
        // append new chatroom to DOM
        var newChat = document.createElement('button');
        newChat.innerText = storage[key].roomname;
        $(newChat).css('display', 'block').css('margin', '0 auto').css('margin-top','20px').attr('class', 'room');
        $('body').append(newChat);
      }
    }
  };

  // store oldChatRoom
  var oldChatRoom;
  // store currentChatRoom (just clicked by user)
  var currentChatRoom;
  $('body').on('click', '.room', function(){
    oldChatRoom = currentChatRoom;
    currentChatRoom = this.innerText;
    // if currentChatRoom is not equal to oldChatRoom
    if (currentChatRoom !== oldChatRoom) {
      // remove all current divs in #main
      $('#main div').remove();
      // loop through storage object
      for (var key in storage) {
        // if message object's roomname is equal to oldChatRoom, set message object's appended property to false
        if (storage[key].roomname === oldChatRoom) {
          storage[key].appended = false;
        }
      }
    }
  });

  // create function to append messages in chatroom
  var appendMessages = function() {
    // loop through storage which holds all of our message objects
    for (var key in storage) {
      // if message objects have roomname equal to currenChatRoom and appended doesn't exist or false
      if (storage[key].roomname === currentChatRoom && !storage[key].appended) {
        // create an element and set its' innerText equal to the data associated with that message object and allow username selection
        var newMessage = document.createElement('div');
        $(newMessage).html('<a href="#">' + storage[key].username + '</a>' + ': ' + storage[key].text);
        // bold message if in friends
        if (storage[key].username === friends[storage[key].username]) {
          $(newMessage).css('font-weight', 'bold');
        }
        // append to dom
        $('#main').prepend(newMessage);
        //add appended property to storage object
        storage[key].appended = true;
      }
    }
  };

  ///////////////// Socializing /////////////////

  // every username click, store username in friends object
  var friends = {};
  $('body').on('click', 'a', function() {
    friends[this.innerText] = this.innerText;
  });

  // function to make all friend messages currently on DOM bold
  var boldText = function() {
    var DOMChildren = document.getElementById('main').children;
    console.log(DOMChildren);
    // looping through existing children on main
    for (var i = 0; i < DOMChildren.length; i++) {
      // if inner text is equal to friends[child.innertext]
      if (DOMChildren[i].children[0].innerText === friends[DOMChildren[i].children[0].innerText]) {
        // bold that node's text
        $(DOMChildren[i]).css('font-weight', 'bold');
      }
    }
  };

  // within appendmessages, if username = friend, then set div text to bold

  ///////////////// Update Messages and Chatrooms /////////////////

  getMessage(10);
  createChatRooms();

  // Interval to refresh chat and chatrooms
  setInterval(function() {
    getMessage(10);
    createChatRooms();
    boldText();
    // if chat is selected
    if (currentChatRoom) {
      // run append for that chatroom
      appendMessages();
    }
  }, 100);

});

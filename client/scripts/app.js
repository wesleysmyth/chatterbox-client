// YOUR CODE HERE:

var app = {

  message: {
    'username': window.location.search.slice(10),
    'text': '',
    'roomname': ''
  },

  // create object to store existing message objects displayed in chat
  storage: {},

  // object to track existing chatrooms in DOM
  chatRooms: {},

  // store oldChatRoom
  oldChatRoom: undefined,

  // store currentChatRoom (just clicked by user)
  currentChatRoom: undefined,

  // every username click, store username in friends object
  friends: {},

  sendMessage: function() {
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(app.message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  getMessage: function(limit){
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
         if (!app.storage[messages[i].objectId]) {
          // add message object to storage
           app.storage[messages[i].objectId] = messages[i];
         }
       }
     },
     error: function (data) {
       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
       console.error('chatterbox: Failed to receive message');
     }
   });
  },

  // check whether storage objects have any chatrooms that chatRooms object does not
  createChatRooms: function () {
    // loop through storage object
    for (var key in app.storage) {
      // if storage chatroom is not a property of chatRooms object
      if (!app.chatRooms[app.storage[key].roomname] && app.storage[key].roomname !== undefined && app.storage[key].roomname !== '') {
        // add to chatRooms object
        app.chatRooms[app.storage[key].roomname] = app.storage[key].roomname;
        // append new chatroom to DOM
        var newChat = document.createElement('button');
        newChat.innerText = app.storage[key].roomname;
        $(newChat).css('display', 'block').css('margin', '0 auto').css('margin-top','20px').attr('class', 'room');
        $('body').append(newChat);
      }
    }
  },

  // create function to append messages in chatroom
  appendMessages: function() {
    // loop through storage which holds all of our message objects
    for (var key in app.storage) {
      // if message objects have roomname equal to currenChatRoom and appended doesn't exist or false
      if (app.storage[key].roomname === app.currentChatRoom && !app.storage[key].appended) {
        // create an element and set its' innerText equal to the data associated with that message object and allow username selection
        var newMessage = document.createElement('div');
        $(newMessage).html('<a href="#">' + app.storage[key].username + '</a>' + ': ' + app.storage[key].text);
        // bold message if in friends
        if (app.storage[key].username === app.friends[app.storage[key].username]) {
          $(newMessage).css('font-weight', 'bold');
        }
        // append to dom
        $('#main').prepend(newMessage);
        //add appended property to storage object
        app.storage[key].appended = true;
      }
    }
  },

  // function to make all friend messages currently on DOM bold
  boldText: function() {
    var DOMChildren = document.getElementById('main').children;
    // looping through existing children on main
    for (var i = 0; i < DOMChildren.length; i++) {
      // if inner text is equal to friends[child.innertext]
      if (DOMChildren[i].children[0].innerText === app.friends[DOMChildren[i].children[0].innerText]) {
        // bold that node's text
        $(DOMChildren[i]).css('font-weight', 'bold');
      }
    }
  },

  // init kicks off all necessary callback functions, initializing functions, and updates
  init: function(){

    // user clicks or enters submit to send message to chat
    $('#chatButton').on('click', function() {
      app.message['text'] = $('#chatText').val();
      app.sendMessage();
      $('#chatText').val('');
    });

    $('#chatText').keyup(function(e) {
      /*e.preventDefault();*/
      if (e.keyCode === 13) {
        $('#chatButton').click();
      }
    });

    // on click, create chat room, and remove any old chat room messages
    $('body').on('click', '.room', function(){
      app.oldChatRoom = app.currentChatRoom;
      app.currentChatRoom = this.innerText;
      // sets roomname property on our message
      app.message['roomname'] = app.currentChatRoom;
      // if currentChatRoom is not equal to oldChatRoom
      if (app.currentChatRoom !== app.oldChatRoom) {
        // remove all current divs in #main
        $('#main div').remove();
        // loop through app.storage object
        for (var key in app.storage) {
          // if message object's roomname is equal to oldChatRoom, set message object's appended property to false
          if (app.storage[key].roomname === app.oldChatRoom) {
            app.storage[key].appended = false;
          }
        }
      }
    });

    // on click, store chat room to be created
    $('body').on('click', 'a', function() {
      app.friends[this.innerText] = this.innerText;
    });

    // these function calls are related to updating the client

    app.getMessage(100);
    app.createChatRooms();

    // Interval to refresh chat and chatrooms
    setInterval(function() {
      app.getMessage(10);
      app.createChatRooms();
      app.boldText();
      // if chat is selected
      if (app.currentChatRoom) {
        // run append for that chatroom
        app.appendMessages();
      }
    }, 100);
  }

};




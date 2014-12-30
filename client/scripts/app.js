// YOUR CODE HERE:

var message = {
  'username': 'shawndrost',
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


$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message received');
    console.log(data);
    // grab data from server, loop through array of objects
    var messages = data.results;
    // for each object, select what we want to display on the screen
    for (var i = 0; i < messages.length; i++) {
      var newMessage = document.createElement('div');
      // create an element and set its' innerText to the data associated with that object
      newMessage.innerText = messages[i].username + ': ' + messages[i].text;
      // append element to h1
      $('#main').append(newMessage);
    }
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to receive message');
  }
});









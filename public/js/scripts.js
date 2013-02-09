// setting up menu
$(document).ready(function() {
  // name prompt menu item
  $('#menu-your-name').on("click", function() {
    bootbox.prompt("<h4>What is your name?</h4><small>Your name is only used for the fränk high score table.</small>", function(result) {
      if (result === null) {
//          Example.show("Prompt dismissed");
      } else {
//          Example.show("Hi <b>"+result+"</b>");
      }
    })
  });

  // about menu item
  $('#menu-about').on("click", function() {
    bootbox.alert("<h4>About fränk</h4><small>fränk is an experimental multiplayer game using Raspberry Pi as a gaming hub. This game was created by Jani Turunen, 2013.</small>");
  });

  // connection test menu item
  $('#menu-connection-test').on("click", function() {
    bootbox.alert("<h4>Hit OK to ping server ...</h4>", function() {
      socket.emit('ping',Date.now().toString());
    });
  });

  // instructions menu item
  $('#menu-instructions').on("click", function() {
    bootbox.alert("<h4>How to play fränk</h4><small>Green is good, red is bad. Fastest player to släp a slab gets it. Single game lasts for 20 rounds. You can enter your name for high score purposes at any time via the menu.</small>");
  });
});
// end of setting up menu

// setting up socket
var socket = io.connect(window.location.hostname);
socket.on('pong', function (data) {
  var lag = Date.now() - parseInt(data);
  bootbox.alert("<h4>Ping time: "+lag+"ms</h4>");
})
// end of setting up socket
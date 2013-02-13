// master array for fraenks
var fraenks = [];

// setting up menu
$(document).ready(function() {

  // name prompt menu item
  $('#menu-your-name').on("click", function() {
    bootbox.prompt("<h4>What is your name?</h4><small>Your name is only used for the fränk high score table.</small>", function(result) {
      if (result === null) {
//          no name given
      } else {
//          send name to server
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

// setting up socket
var socket = io.connect(window.location.hostname);

// when socket receives ping respond with pong
socket.on('pong', function (data) {
  var lag = Date.now() - parseInt(data);
  bootbox.alert("<h4>Ping time: "+lag+"ms</h4>");
})

// when socket receives ping respond with pong
socket.on('fraenks', function (data) {
  // delete all existing fraenks
  $('.fraenk').remove();
  fraenks = []
  
  // create new ones
  jQuery.each(data, function(frank) {
    var f = new fraenk();
    f.create(data[frank].id);
    f.animate(19,11);
    f.wander();
    fraenks.push(f);
  });
})

socket.on('kill', function(data) {
  $('#'+data[0].id).remove();
});


function fraenk() {
  this.id = null;
  this.create = function(id) {
    this.id = id;
    this.ele = $('<div class="fraenk" id="'+id+'" />').appendTo('body');
    this.ele.on('click', function() {
      $(this).remove();
      socket.emit('kill',$(this).attr('id'));
    });
  },
  this.animate = function(max, min) {
    var f = Math.floor(Math.random() * (max - min + 1)) + min;
    this.ele.sprite({fps: f, no_of_frames: 4})
  },
  this.wander = function() {
    this.ele.spRandom({top: 0, bottom: $(document).height(), left: 0, right: $(document).width()})    
  }
}

socket.emit('ready'); // telling server we're ready
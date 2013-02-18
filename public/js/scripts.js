// master array for fraenks
var fraenks = [];

// disable double tap zoom via plugin
$('#stage,.fraenk,#slaps-container,#menu').nodoubletapzoom();

// disable selection of content on IE
if (typeof document.onselectstart != "undefined") document.onselectstart = function() { return false }

// small screen or?
var small = $(window).height()*$(window).width() > 200000 ? false : true;

// setting up menu
$(document).ready(function() {

  // name prompt menu item
  $('#menu-your-name').on("click", function() {
/*    bootbox.prompt("<h4>What is your name?</h4><small>Your name is only used for the fränk high score table.</small>", function(result) {
      if (result === null) {
//          no name given
      } else {
//          send name to server
      }
    })*/
    bootbox.alert("<small>note yet...</small>");
  });

  // about menu item
  $('#menu-about').on("click", function() {
    bootbox.alert("<h4>About fränk</h4><small>fränk is an experimental multiplayer game that can be deployed locally, for example using Raspberry Pi as a gaming hub, but also in the internet. This game was created by Jani Turunen & Kare Nieminen, Helsinki, 2013.</small>");
  });

  // screen real estate
  $('#menu-screen-area').on("click", function() {
    bootbox.alert("<h4>Screen area</h4><small>Your game area size is <b>"+$(window).height()*$(window).width()+"</b> pixels</small>");
  });

  // connection test menu item
  $('#menu-connection-test').on("click", function() {
    bootbox.alert("<h4>Hit OK to ping server ...</h4>", function() {
      socket.emit('ping',Date.now().toString());
    });
  });

  // instructions menu item
  $('#menu-instructions').on("click", function() {
    bootbox.alert("<h4>How to play fränk</h4><small>At this point, just keep clicking! We'll add scores and gameplay later!</small>");
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
  
  // spawn new ones
  jQuery.each(data, function(frank) {
    var f = new fraenk();
    f.create(data[frank].id);
    f.animate(19,11);
    f.wander();
    fraenks.push(f);
  });
  var fraenk_class =  small ? 'fraenk-small' : 'fraenk';
  $('.'+fraenk_class).nodoubletapzoom();
})

// kill individual fraenks when some other player has nuked them
socket.on('kill', function(data) {
  $('#'+data[0].id).remove();
});

// loop for adding slaps
var slaps = 0
  , max_slaps = 5;
var slap_loop = setInterval(function() {
  if (slaps < max_slaps) {
    var html = "";
    for (var i=0; i<max_slaps; i++) {
      html += '<div class="slap"><img src="/img/hand.png" border="0" /></div>';
    }
    slaps = max_slaps
    $('#slaps-container').empty();
    $('#slaps-container').html(html);
  }
},7000);

// removing slaps for misses
$('#stage').on('click', function() {
  remove_slap();
});

function remove_slap() {
  slaps -= 1;
  $('#slaps-container div:last-child').remove();
}

function fraenk() {
  this.id = null;
  this.create = function(id) {
    this.id = id;
    var fraenk_class =  small ? 'fraenk-small' : 'fraenk';
    this.ele = $('<div class="'+fraenk_class+'" id="'+id+'" />').appendTo('body');
    this.ele.on('click', function() {
      if (slaps < 1) return;
      $(this).destroy();
      remove_slap();
//      $(this).transition({ rotate: '360deg' })
      $(this).remove();
      socket.emit('kill',$(this).attr('id'));
    });
  },
  this.animate = function(max, min) {
    var f = Math.floor(Math.random() * (max - min + 1)) + min;
    this.ele.sprite({fps: f, no_of_frames: 4})
  },
  this.wander = function() {
    this.ele.spRandom({top: -100, bottom: $(window).height()+50, left: -100, right: $(window).width()+50})
  }
}
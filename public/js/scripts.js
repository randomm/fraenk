$(document).ready(function() {
  // name prompt menu item
  $('#menu-your-name').on("click", function() {
    bootbox.prompt("<h2>What is your name?</h2><small>Your name is only used for the fränk high score table.</small>", function(result) {
      if (result === null) {
//          Example.show("Prompt dismissed");
      } else {
//          Example.show("Hi <b>"+result+"</b>");
      }
    })
  });

  // about menu item
  $('#menu-about').on("click", function() {
    bootbox.alert("<h2>About fränk</h2><small>fränk is an experimental multiplayer game using Raspberry Pi as a gaming hub. This game was created by Jani Turunen, 2013.</small>");
  });

  // instructions menu item
  $('#menu-instructions').on("click", function() {
    bootbox.alert("<h2>How to play fränk</h2><small>Green is good, red is bad. Fastest player to släp a slab gets it. Single game lasts for 20 rounds. You can enter your name for high score purposes at any time via the menu.</small>");
  });
});

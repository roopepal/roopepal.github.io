var sendMessage = function(message) {
  window.parent.postMessage(message, "*");
};

var sendScore = function() {
  sendMessage({
    'messageType': 'SCORE',
    'score': 100.0
  });
};

var sendSave = function() {
  sendMessage({
    messageType: "SAVE",
    gameState: {
      playerItems: [
        "Sword",
        "Wizard Hat"
      ],
      score: 506.0 // Float
    }
  });
};

var sendLoadRequest = function() {
  sendMessage({
    'messageType': 'LOAD_REQUEST'
  });
};

var sendSettingSmall = function() {
  sendMessage({
    messageType: "SETTING",
    options: {
      "width": 400,
      "height": 300
    }
  });
};

var sendSettingMedium = function() {
  sendMessage({
    messageType: "SETTING",
    options: {
      "width": 640,
      "height": 480
    }
  });
};

var sendSettingLarge = function() {
  sendMessage({
    messageType: "SETTING",
    options: {
      "width": 1024,
      "height": 768
    }
  });
};

var sendSettingTooLarge = function() {
  sendMessage({
    messageType: "SETTING",
    options: {
      "width": 2000,
      "height": 1000
    }
  });
};

var sendSettingTooSmall = function() {
  sendMessage({
    messageType: "SETTING",
    options: {
      "width": -200,
      "height": -200
    }
  });
};

window.addEventListener('message', function(event) {
  var new_log = document.createElement('p');
  new_log.innerHTML = JSON.stringify(event.data);
  document.getElementById('log').appendChild(new_log);
});
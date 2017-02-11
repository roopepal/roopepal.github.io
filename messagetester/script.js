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

var sendSetting = function() {
  sendMessage({
    messageType: "SETTING",
    options: {
      "width": 400,
      "height": 300
    }
  });
};
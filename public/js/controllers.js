angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    function ($scope, socket) {
      $scope.Tweets = [];
      socket.emit('start tweets', true);
      socket.on('tweet', function (tweet) {
        $scope.Tweets.push(tweet);
      });
    }
  ])
  .controller('emojiController', ['$scope', 'EmojiFactory', function($scope, EmojiFactory) {
    $scope.Emojis = [];
    EmojiFactory.getEmojis()
      .then(function(emojis) {
        emojis.data.forEach(function (code) {
          $scope.Emojis.push(code);
        })
      })
  }]);
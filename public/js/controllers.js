angular.module('omniMood')
  // .controller('tweetController', [
  //   '$scope',
  //   'socket',
  //   function ($scope, socket) {
  //     $scope.Tweets = [];
  //     socket.emit('start tweets', true);
  //     socket.on('tweet', function (tweet) {
  //       $scope.Tweets.push(tweet);
  //     });
  //   }
  // ])
  .controller('emojiController', [
    '$scope',
    'socket',
    'EmojiFactory',
    'TweetFactory',
    function($scope, socket, EmojiFactory, TweetFactory) {
      $scope.Emojis = [];
      $scope.Tweets = [];
      socket.emit('start tweets', true);

      socket.on('tweet', function (tweet) {
        $scope.Tweets.push(tweet);
      });

      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function (code, index) {
            $scope.Emojis.push(code);
          });
        });
    }
  ])
  .controller('toggleViewController', function ($scope) {
    $scope.show = true;
    $scope.$watch('show', function () {
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
    });
  });

'use strict';

// Scores controller
angular.module('scores').controller('ScoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Scores',
  function ($scope, $stateParams, $location, Authentication, Scores) {
    $scope.authentication = Authentication;

    // Remove existing Score
    $scope.remove = function (score) {
      if (score) {
        score.$remove();

        for (var i in $scope.scores) {
          if ($scope.scores[i] === score) {
            $scope.scores.splice(i, 1);
          }
        }
      } else {
        $scope.score.$remove(function () {
          $location.path('scores');
        });
      }
    };
  }
]);

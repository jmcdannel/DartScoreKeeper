'use strict';

// Creeate Score Entry Directive
angular.module('scores').directive('dsEditScoreEntry', ['$stateParams', '$location', 'Authentication', 'Scores',
  function ($stateParams, $location, Authentication, Scores) {

		return {
			scope: {},
      templateUrl: 'modules/scores/client/views/edit-score-entry.client.view.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
				scope.authentication = Authentication;
				scope.score = Scores.get({
	        scoreId: $stateParams.scoreId
	      });

				scope.update = function () {
		      var score = scope.score,
						_updateSuccess = function() {
							$location.path('scores');
						},
						_updateError = function(errorResponse) {
							scope.error = errorResponse.data.message;
						};

		      score.$update(_updateSuccess, _updateError);
		    };

				scope.remove = function() {
		      scope.score.$remove();
					$location.path('scores');
		    };
      }
    };

	}
]);

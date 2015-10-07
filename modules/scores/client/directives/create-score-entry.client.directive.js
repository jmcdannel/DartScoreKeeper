'use strict';

// Creeate Score Entry Directive
angular.module('scores').directive('dsCreateScoreEntry', ['$location', 'Authentication', 'Scores',
  function ($location, Authentication, Scores) {

		return {
			scope: {},
      templateUrl: 'modules/scores/client/views/create-score-entry.client.view.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
				scope.authentication = Authentication;

				scope.create = function () {

					var score = new Scores({
						title: scope.title,
						game: scope.game,
						player: scope.player,
						score: scope.score,
						notes: scope.notes
					}),

					_saveSuccess = function(response) {
						$location.path('scores');

						scope.title = '';
						scope.game = '';
						scope.player = '';
						scope.score = '';
						scope.notes = '';
					},

					_saveError = function(errorResponse) {
						scope.error = errorResponse.data.message;
					};

					score.$save(_saveSuccess, _saveError);
				};
      }
    };

	}
]);

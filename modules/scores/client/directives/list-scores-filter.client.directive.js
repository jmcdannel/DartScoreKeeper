'use strict';

// Creeate Score List Filter Directive
angular.module('scores').directive('dsListScoresFilter', ['Scores',
  function (Scores) {

		return {
			replace: true,
			scope: {
				'search': '='
			},
      templateUrl: 'modules/scores/client/views/list-scores-filter.client.view.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
				console.log('dsListScoresFilter');
      }
    };

	}
]);

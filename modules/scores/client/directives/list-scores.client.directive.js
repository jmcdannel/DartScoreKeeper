'use strict';

// Score List Directive
angular.module('scores').directive('dsScoreList', ['Scores', 'Authentication',
  function (Scores, Authentication) {
		return {
			scope: {},
      templateUrl: 'modules/scores/client/views/list-scores.client.view.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
				scope.authentication = Authentication;
				scope.scores = Scores.query();
        scope.filters = { name: '', game: '', sortBy: { field: '', descending: false } };
        scope.sortBy = function(field) {
          scope.filters.sortBy = {
            field: field,
            descending: !scope.filters.sortBy.descending
          };
        };
      }
    };
	}
]);

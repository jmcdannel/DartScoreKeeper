'use strict';

// Setting up route
angular.module('scores').config(['$stateProvider',
  function ($stateProvider) {
    // scores state routing
    $stateProvider
      .state('scores', {
        abstract: true,
        url: '/scores',
        template: '<ui-view/>'

      })
      .state('scores.list', {
        url: '',
        templateUrl: 'modules/scores/client/views/list-scores.client.view.html'
      })
      .state('scores.create', {
        url: '/create',
        templateUrl: 'modules/scores/client/views/create-score-entry.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('scores.view', {
        url: '/:scoreId',
        templateUrl: 'modules/scores/client/views/view-score-entry.client.view.html'
      })
      .state('scores.edit', {
        url: '/:scoreId/edit',
        templateUrl: 'modules/scores/client/views/edit-score-entry.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

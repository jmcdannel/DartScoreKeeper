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
        template: '<ds-score-list/>'
      })
      .state('scores.create', {
        url: '/create',
        template: '<ds-create-score-entry/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('scores.edit', {
        url: '/:scoreId/edit',
        template: '<ds-edit-score-entry/>',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

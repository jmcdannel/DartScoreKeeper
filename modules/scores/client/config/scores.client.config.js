'use strict';

// Configuring the scores module
angular.module('scores').run(['Menus',
  function (Menus) {
    // Add the scores dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Scores',
      state: 'scores',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'scores', {
      title: 'List Scores',
      state: 'scores.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'scores', {
      title: 'Create Score',
      state: 'scores.create'
    });
  }
]);

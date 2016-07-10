(function() {
  'use strict';

  angular
    .module('dabla')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/new', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/add', {
        templateUrl: 'app/add/add.html',
        controller: 'AddController',
        controllerAs: 'add'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();

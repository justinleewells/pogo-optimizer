angular.module('optimizer.nav-menu.directive', [])
  .directive('navMenu', [function () {

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/components/nav-menu/nav-menu.html',
      controller: ['$scope', function ($scope) {
        console.log('testd');
      }]
    };

  }]);
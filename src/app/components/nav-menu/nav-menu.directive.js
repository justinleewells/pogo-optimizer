angular.module('optimizer.nav-menu.directive', [])
  .directive('navMenu', [function () {

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/components/nav-menu/nav-menu.html',
      controller: ['$scope', '$state', function ($scope, $state) {
        $scope.display = function () {
          return $state.current.name !== 'connect';
        }
      }]
    };

  }]);
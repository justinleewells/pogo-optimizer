angular.module('optimizer.nav-menu.directive', [])
  .directive('navMenu', [function () {

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/components/nav-menu/nav-menu.html',
      controller: ['$scope', '$rootScope', '$state', 'APIService',
        function ($scope, $rootScope, $state, APIService) {
          $scope.display = function () {
            return $state.current.name !== 'connect';
          };
          $scope.logout = function () {
            APIService.logout().then(
              function () {
                $rootScope.player = null;
                $rootScope.inventory = null;
                $state.go('connect');
              },
              function (err) {
                console.log(err);
              });
          };
      }]
    };

  }]);
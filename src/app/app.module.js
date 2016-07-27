angular.module('optimizer', [
  'ui.router',
  
  'optimizer.routes',

  'optimizer.connect.controller',
  'optimizer.dashboard.controller',
  'optimizer.evolution.controller',
  'optimizer.spreadsheet.controller',

  'optimizer.nav-menu.directive',

  'optimizer.api.service'
])
  .run(['APIService', '$rootScope', '$timeout', '$state',
    function (APIService, $rootScope, $timeout, $state) {
      function fetchData() {
        APIService.player().then(
          function (data) {
            if (data !== null) {
              $rootScope.player = data;
              if ($state.current.name === 'connect') $state.go('spreadsheet');
            } else {
              if ($state.current.name !== 'connect') $state.go('connect');
            }
          },
          function (err) {
            console.log(err);
          });
        APIService.inventory().then(
          function (data) {
            if (data !== null) {
              if (data.updates || $rootScope.inventory === undefined) $rootScope.inventory = data;
            }
          },
          function (err) {
            console.log(err);
          });

        $timeout(fetchData, 2000);
      }
      fetchData();
  }]);
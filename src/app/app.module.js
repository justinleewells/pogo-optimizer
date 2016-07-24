angular.module('optimizer', [
  'ui.router',
  
  'optimizer.routes',

  'optimizer.connect.controller',
  'optimizer.dashboard.controller',
  'optimizer.spreadsheet.controller',

  'optimizer.nav-menu.directive',

  'optimizer.data.service'
])
  .run(['DataService', '$rootScope', '$timeout', '$state',
    function (DataService, $rootScope, $timeout, $state) {
      function fetchData() {
        DataService.player().then(
          function (data) {
            if (data !== null) {
              $rootScope.player = data;
              if ($state.current.name === 'connect') $state.go('dashboard');
            } else {
              if ($state.current.name !== 'connect') $state.go('connect');
            }
          },
          function (err) {
            console.log(err);
          });
        DataService.inventory().then(
          function (data) {
            if (data !== null) $rootScope.inventory = data;
          },
          function (err) {
            console.log(err);
          });

        $timeout(fetchData, 2000);
      }
      fetchData();
  }]);
angular.module('optimizer', [
  'ui.router',

  'optimizer.connect.controller',
  'optimizer.dashboard.controller',
  'optimizer.spreadsheet.controller',

  'optimizer.nav-menu.directive'
])
  .run([function () {
    console.log('run');
  }]);
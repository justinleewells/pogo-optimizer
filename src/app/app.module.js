angular.module('optimizer', [
  'ui.router',
  
  'optimizer.routes',

  'optimizer.connect.controller',
  'optimizer.dashboard.controller',
  'optimizer.spreadsheet.controller',

  'optimizer.nav-menu.directive',

  'optimizer.data.service'
])
  .run([function () {
  }]);
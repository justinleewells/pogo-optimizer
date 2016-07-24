angular.module("optimizer.routes", [
  'ui.router'
])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {


      $urlRouterProvider.otherwise('/connect');

      $stateProvider
        .state("connect", {
          url: "/connect",
          templateUrl: "app/connect/connect.html",
          controller: "ConnectCtrl"
        })
        .state("dashboard", {
          url: "/dashboard",
          templateUrl: "app/dashboard/dashboard.html",
          controller: "DashboardCtrl"
        })
        .state("spreadsheet", {
          url: "/spreadsheet",
          templateUrl: "app/spreadsheet/spreadsheet.html",
          controller: "SpreadsheetCtrl"
        });

    }
  ]);
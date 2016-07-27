angular.module("optimizer.routes", [
  'ui.router'
])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {


      $urlRouterProvider.otherwise('/connect');

      $stateProvider
        .state("connect", {
          url: "/connect",
          templateUrl: "app/components/connect/connect.html",
          controller: "ConnectCtrl"
        })
        .state("dashboard", {
          url: "/dashboard",
          templateUrl: "app/components/dashboard/dashboard.html",
          controller: "DashboardCtrl"
        })
        .state("evolution", {
          url: "/evolution",
          templateUrl: "app/components/evolution/evolution.html",
          controller: "EvolutionCtrl"
        })
        .state("spreadsheet", {
          url: "/spreadsheet",
          templateUrl: "app/components/spreadsheet/spreadsheet.html",
          controller: "SpreadsheetCtrl"
        });

    }
  ]);
angular.module('optimizer.spreadsheet.controller', [])
  .controller('SpreadsheetCtrl', ['$scope', '$rootScope', 'APIService',
    function($scope, $rootScope, APIService) {
      $scope.selected = null;
      $scope.sortColumn = 'metadata.id';
      $scope.sortOrder = '+';
      $scope.search = '';
      $scope.setSort = function (column) {
        if ($scope.sortColumn !== column) $scope.sortColumn = column;
        else {
          if ($scope.sortOrder === '-') $scope.sortOrder = '+';
          else $scope.sortOrder = '-';
        }
      };
      $scope.getSort = function () {
        var ret = '';
        if ($scope.search.indexOf(',') === -1) {
          if ($scope.sortColumn === 'metadata.id') ret = [$scope.sortOrder + 'metadata.id', '-metadata.piv'];
          else ret = $scope.sortOrder + $scope.sortColumn;
        } else {
          ret = $scope.search.split(',');
        }
        return ret;
      };
      $scope.favoriteClass = function (pokemon) {
        var ret = '';
        if (pokemon.data.favorite) ret = 'favorite';
        return ret;
      };
      $scope.formatPercentage = function (float) {
        return Math.round(float * 100);
      };
      $scope.formatMetric = function (float) {
        return Math.round(float * 100) / 100;
      };
      $scope.formatMoveName = function (name) {
        var ret = '';
        var spl = name.split('_');
        for (var i = 0; i < spl.length; i++) {
          if (i !== 0 && spl[i] !== 'FAST') ret += ' ';
          if (spl[i] !== 'FAST') ret += spl[i].toLowerCase();
        }
        return ret;
      };
      $scope.openModal = function (pokemon) {
        $scope.selected = pokemon;
        $('.ui.basic.modal').modal('show');
      };
      $scope.updateSettings = function () {
        APIService.settings($rootScope.player.settings).then(
          function () {},
          function (err) {
            console.log(err);
          });
      };
      $scope.moveColorClass = function () {
        var ret = '';
        if ($rootScope.player.settings.enableMoveColors) ret = 'enable-move-colors';
        return ret;
      };
      $scope.ivColorClass = function () {
        var ret = '';
        if ($rootScope.player.settings.enableIVColors) ret = 'enable-iv-colors';
        return ret;
      };

      $scope.getFilter = function () {
        var ret = '';
        if ($scope.search.length > 0 && $scope.search.indexOf(',') === -1) {
          ret = $scope.search;
        }
        return ret;
      };
    }
  ]);
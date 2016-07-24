angular.module('optimizer.spreadsheet.controller', [])
  .controller('SpreadsheetCtrl', ['$scope',
    function($scope) {
      $scope.selected = null;
      $scope.sortColumn = 'metadata.id';
      $scope.sortOrder = '+';
      $scope.setSort = function (column) {
        if ($scope.sortColumn !== column) $scope.sortColumn = column;
        else {
          if ($scope.sortOrder === '-') $scope.sortOrder = '+';
          else $scope.sortOrder = '-';
        }
      };
      $scope.getSort = function () {
        var ret = '';
        if ($scope.sortColumn === 'metadata.id') ret = [$scope.sortOrder + 'metadata.id', '-metadata.piv'];
        else ret = $scope.sortOrder + $scope.sortColumn;
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
      $scope.getFormattedId = function () {
        var ret = '001';
        if ($scope.selected !== null) {
          ret = $scope.selected.metadata.id + '';
          if (ret.length !== 3) {
            while (ret.length !== 3) ret = "0" + ret;
          }
        }
        return ret;
      };
    }
  ]);
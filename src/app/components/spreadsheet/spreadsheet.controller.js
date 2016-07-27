angular.module('optimizer.spreadsheet.controller', [])
  .controller('SpreadsheetCtrl', ['$scope', '$rootScope', '$timeout', 'APIService',
    function($scope, $rootScope, $timeout, APIService) {
      
      /**
       * Initialization
       */
      
      $timeout(function () {
        $('table').stickyTableHeaders({fixedOffset: $('#nav-menu')});
      }, 10);
      
      /**
       * Spreadsheet Settings Modal
       */
      
      $scope.openSettingsModal = function () {
        $('#spreadsheet-settings-modal').modal('show');
      };
      
      $scope.updateSettings = function () {
        APIService.settings($rootScope.player.settings).then(
          function () {},
          function (err) {
            console.log(err);
          });
      };
      
      /**
       * Pokemon Selection Modal
       */
      
      $scope.selectedPokemon = null;
      
      $scope.openPokemonModal = function (pokemon) {
        $scope.selectedPokemon = pokemon;
        $('#pokemon-modal').modal('show');
      };
      
      /**
       * Sorting
       */
      
      $('.ui.dropdown').dropdown();
      
      $scope.sort     = [];
      $scope.sortArr  = [];
      
      $scope.sortChange = function () {
        if ($scope.sortArr.length < $scope.sort.length) {
          for (var i = 0; i < $scope.sort.length; i++) {
            var tmp = $scope.sort[i];
            if ($scope.sortArr.indexOf(tmp) === -1) $scope.sortArr.push(tmp);
          }
        } else {
          for (var i = 0; i < $scope.sortArr.length; i++) {
            var tmp = $scope.sortArr[i];
            if ($scope.sort.indexOf(tmp) === -1) $scope.sortArr.splice(i, 1);
          }
        }
      };
      
      $scope.getSortArray = function () {
        var ret = ['+metadata.id', '-metadata.piv'];
        if ($scope.sortArr.length > 0) ret = $scope.sortArr;
        return ret;
      };
      
      /**
       * Searching
       */
      
      $scope.search = '';
      
      $scope.getSearchFilter = function () {
        var ret = '';
        if ($scope.search.length > 0 && $scope.search.indexOf(',') === -1) {
          ret = $scope.search;
        }
        return ret;
      };
      
      /**
       * Styling
       */
      
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
      
      $scope.getMoveDPS = function (move) {
        var ret = 0;
        if (move.Power && move.DurationMs) {
          var dps = parseInt(move.Power)/parseInt(move.DurationMs)*1000;
          ret = dps.toFixed(2);
        }
        return ret;
      };
      
      $scope.favoriteClass = function (pokemon) {
        var ret = '';
        if (pokemon.data.favorite) ret = 'favorite';
        return ret;
      };
      
      $scope.moveColorClass = function () {
        var ret = '';
        if ($rootScope.player.settings.spreadsheet.enableMoveColors) ret = 'enable-move-colors';
        return ret;
      };
      
      $scope.ivColorClass = function () {
        var ret = '';
        if ($rootScope.player.settings.spreadsheet.enableIVColors) ret = 'enable-iv-colors';
        return ret;
      };
      
    }
  ]);
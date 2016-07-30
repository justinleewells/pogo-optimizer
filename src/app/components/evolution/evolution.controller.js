angular.module('optimizer.evolution.controller', [])
  .controller('EvolutionCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope) {

      /**
       * Data Retrieval
       */

      $scope.getPokemonCount = function (family_id) {
        return _.reduce($rootScope.inventory.pokemon, function (sum, p) {
          if (p.data.pokemon_id === family_id) sum++;
          return sum;
        }, 0);
      };

      $scope.getEvolutions = function (candy, transfer) {
        var count = this.getPokemonCount(candy.family_id);
        var n = parseInt(Math.min(candy.candy / candy.cost, count));
        if (!transfer) {
          return n;
        } else {
          var remainder = parseInt(candy.candy - (candy.cost * n));
          return n + Math.min(parseInt((count + remainder - n) / (candy.cost + 1)), count - n);
        }
      };

      $scope.getTransfers = function (candy) {
        var n = this.getEvolutions(candy, true);
        var count = this.getPokemonCount(candy.family_id);
        var rem = count - n;
        return n ? rem : 0;
      };

      /**
       * Styling
       */

      $scope.formatName = function (family_id) {
        var spl = family_id.toLowerCase().split('_');
        var ret = spl[0];
        if (spl.length === 2) ret += ' ' + spl[1];
        return ret;
      };

    }
  ]);

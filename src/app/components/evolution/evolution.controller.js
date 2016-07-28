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

      $scope.getEvolutions = function (candy) {
        var count = this.getPokemonCount(candy.family_id);
        var ret   = -1;
        for (var i = 0; i < candy.candy && ret < count; i += candy.cost) {
          ret++;
        }
        return ret;
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
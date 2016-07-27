angular.module('optimizer.evolution.controller', [])
  .controller('EvolutionCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope) {

      /**
       * Data Retrieval
       */

      $scope.getPokemonCount = function (family_id) {
        var spl = family_id.split('_');
        var name = spl[1];
        if (spl.length === 3) name += '_' + spl[2];
        return _.reduce($rootScope.inventory.pokemon, function (sum, p) {
          if (p.data.pokemon_id === name) sum++;
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
        var ret = spl[1];
        if (spl.length === 3) ret += ' ' + spl[2];
        return ret;
      };

    }
  ]);
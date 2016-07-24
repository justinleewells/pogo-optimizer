/**
 *  Example Service
 *  --- version: 1.0.0
 */
angular.module('optimizer.data.service', [])
  .factory('DataService', ['$q', '$http',
    function($q, $http) {

      return {

        player: function () {
          var deferred = $q.defer();

          $http({
            method  : 'GET',
            url     : 'http://localhost:3000/api/player'
          }).success(function (resp) {
            deferred.resolve(resp);
          }).error(function (err) {
            deferred.reject(err);
          });

          return deferred.promise;
        },

        pokemon: function () {
          var deferred = $q.defer();

          $http({
            method  : 'GET',
            url     : 'http://localhost:3000/api/pokemon'
          }).success(function (resp) {
            deferred.resolve(resp);
          }).error(function (err) {
            deferred.reject(err);
          });

          return deferred.promise;
        }

      };

    }
  ]);
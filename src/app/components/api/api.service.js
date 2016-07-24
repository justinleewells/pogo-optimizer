angular.module('optimizer.api.service', [])
  .factory('APIService', ['$q', '$http',
    function($q, $http) {

      return {

        player: function () {
          var deferred = $q.defer();

          $http({
            method  : 'GET',
            url     : 'http://localhost:3000/api/player',
            headers: {
              'Content-Type': 'application/json'
            }
          }).success(function (resp) {
            console.log(resp);
            deferred.resolve(resp);
          }).error(function (err) {
            deferred.reject(err);
          });

          return deferred.promise;
        },

        inventory: function () {
          var deferred = $q.defer();

          $http({
            method  : 'GET',
            url     : 'http://localhost:3000/api/inventory',
            headers: {
              'Content-Type': 'application/json'
            }
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
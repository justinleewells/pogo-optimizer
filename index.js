/**
 * Mitm
 */

var PokemonGoMITM = require('pokemon-go-mitm');

var Player    = require('./lib/player');
var Inventory = require('./lib/inventory');

var stage     = 0;
var player    = null;
var inventory = null;
var releasing = null;

new PokemonGoMITM({port: 8081})
  .setResponseHandler('GetPlayer', function (data) {
    if (data.success && player === null) {
      player = new Player(data.player_data.username);
      player.load(data.player_data);
      player.save();
      stage = 1;
    }
  })
  .setResponseHandler('GetInventory', function (data) {
    if (data.success) {
      var delta = data.inventory_delta;
      var pokemon = _.reduce(delta.inventory_items, function (result, item) {
        return (item.inventory_item_data.pokemon_data !== undefined) ? _.concat(result, item.inventory_item_data.pokemon_data) : result;
      }, []);
      var candy = _.reduce(delta.inventory_items, function (result, item) {
        return (item.inventory_item_data.pokemon_family !== undefined) ? _.concat(result, item.inventory_item_data.pokemon_family) : result;
      }, []);
      if (inventory === null) {
        inventory = new Inventory(player.username);
        inventory.load(candy, pokemon);
        inventory.save();
      } else {
        inventory.update(candy, pokemon);
        inventory.save();
      }
    }
  })
  .setRequestHandler("ReleasePokemon", function (data) {
    releasing = data.pokemon_id;
  })
  .setResponseHandler("ReleasePokemon", function(data) {
    if (data.result === 'SUCCESS' && releasing !== null) {
      inventory.release(releasing);
      inventory.save();
      releasing = null;
    }
  });

/**
 * Express
 */

var _       = require('lodash');
var fs      = require('fs');
var jsf     = require('jsonfile');
var express = require('express');
var app     = express();

jsf.writeFileSync('./data/inventory.json', [], {}, function (err) {
  if (err) console.log(err);
});

app.use(express.static('public'));
app.use("/ca.pem", express.static('.http-mitm-proxy/certs/ca.pem'));

app.get('/api/player', function (req, res, next) {
  if (player) return res.send(player.toJSON());
  else res.send({});
});

app.get('/api/inventory', function (req, res, next) {
  if (inventory) return res.send(inventory.toJSON());
  else res.send({});
});

app.listen(3000, function () {
  console.log('Pokemon GO Optimizer front-end listening on port 3000');

  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Accept the cert at ' + add + ':3000/ca.pem if you haven\'t already done so');
  });
});

/**
 * Initialization
 */

var _       = require('lodash');
var fs      = require('fs');
var bp      = require('body-parser');
var cors    = require('cors');
var express = require('express');
var app     = express();
var forge   = require('node-forge');

var player    = null;
var inventory = null;
var releasing = null;

if (!fs.existsSync(__dirname + '/data/save/')) fs.mkdirSync(__dirname + '/data/save/');

/**
 * Mitm
 */

var PokemonGoMITM = require('pokemon-go-mitm');

var Player    = require('./lib/player');
var Inventory = require('./lib/inventory');

new PokemonGoMITM({port: 8081})
  .setResponseHandler('GetPlayer', function (data) {
    if (data.success && player === null) {
      player = new Player(data.player_data.username);
      player.load(data.player_data);
      player.save();
    }
  })
  .setResponseHandler('GetInventory', function (data) {
    if (data.success && player !== null) {
      var delta = data.inventory_delta;
      var pokemon = _.reduce(delta.inventory_items, function (result, item) {
        return (item.inventory_item_data !== undefined &&
                item.inventory_item_data.pokemon_data !== undefined &&
               !item.inventory_item_data.pokemon_data.is_egg) ? _.concat(result, item.inventory_item_data.pokemon_data) : result;
      }, []);
      var candy = _.reduce(delta.inventory_items, function (result, item) {
        return (item.inventory_item_data !== undefined &&
                item.inventory_item_data.candy !== undefined) ? _.concat(result, item.inventory_item_data.candy) : result;
      }, []);
      if (inventory === null) {
        inventory = new Inventory(player.username);
        inventory.load(candy, pokemon);
        inventory.save();
      } else {
        inventory.update(candy, pokemon);
        inventory.save();
      }
    } else if (player === null) {
      console.error("WARNING: Cannot set inventory. No player logged in.");
    } else if (!data.inventory_delta) {
      console.log(data);
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
  })
  .setRequestHandler("EvolvePokemon", function (data) {
    releasing = data.pokemon_id;
  })
  .setResponseHandler("EvolvePokemon", function(data) {
    if (data.result === 'SUCCESS' && releasing !== null) {
      inventory.release(releasing);
      inventory.save();
      releasing = null;
    }
  });

/**
 * Express
 */

app.use(bp.json());
app.use(cors());

function renamePokemon(mon) {
  // don't rename pokemon that have already been renamed
  if (mon.nickname[2] === '%') return null;

  // only renames pokemon with no nickname
  // feel free to comment this out so you can override all your Pokemon's nicknames
  if (mon.nickname.toUpperCase() !== mon.pokemon_id) return null;

  const percentage = Math.floor((mon.individual_attack + mon.individual_defense + mon.individual_stamina) / 45 * 100)
  const stats = `${mon.individual_attack}/${mon.individual_defense}/${mon.individual_stamina}`

  return `${percentage}% ${stats}`
}

app.use(express.static('public'));
app.use("/ca.pem", express.static('.http-mitm-proxy/certs/ca.pem'));
app.use("/ca.crt", express.static('.http-mitm-proxy/certs/ca.crt'));

app.get('/api/player', function (req, res, next) {
  if (player) return res.send(player.toJSON());
  else return res.json(null);
});

app.post('/api/player/settings', function (req, res, next) {
  if (player) {
    player.settings = req.body;
    player.save();
  }
  return res.send();
});

app.get('/api/inventory', function (req, res, next) {
  if (inventory) {
    res.send(inventory.toJSON());
    inventory.updates = false;
  }
  else return res.json(null);
});

app.post('/api/logout', function (req, res, next) {
  player    = null;
  inventory = null;
  releasing = null;
  res.send();
});

app.listen(3000, function () {
  console.log('Pokemon GO Optimizer front-end listening on port 3000');

  var ip = require('quick-local-ip').getLocalIP4();
  console.log('Accept the cert at http://' + ip + ':3000/ca.pem if you haven\'t already done so');
});

app.get('/rename', (req, res) => {
  jsf.readFileSync('./data/inventory.json')
    .reduce((p, pokemon) => {
      const pokemon_id = pokemon.id;
      const nickname = renamePokemon(pokemon);
      const data = { pokemon_id, nickname };

      if (!nickname) return p;

      return p
        .then(() => server.craftRequest('NicknamePokemon', data));
    }, Promise.resolve())
    .then(() => {
      res.send('OK');
    });
});

/**
 * Certificate
 */

function createCrt() {
  if (fs.existsSync(__dirname + '/.http-mitm-proxy/certs/ca.pem')) {
    if (!fs.existsSync(__dirname + '/.http-mitm-proxy/certs/ca.crt')) {
      var cert = forge.pki.certificateFromPem(fs.readFileSync('.http-mitm-proxy/certs/ca.pem'));
      fs.writeFile('.http-mitm-proxy/certs/ca.crt', forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes(), {encoding: 'binary'});
    }
  } else {
    setTimeout(createCrt, 15000);
  }
}
createCrt();

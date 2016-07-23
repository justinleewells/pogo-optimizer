/**
 * Express
 */

var jsf = require('jsonfile');
var express = require('express');
var app = express();
var fs = require('fs');

jsf.writeFileSync('./data/inventory.json', [], {}, function (err) {
  if (err) console.log(err);
});

app.use(express.static('public'));
app.use("/ca.pem", express.static('.http-mitm-proxy/certs/ca.pem'));

app.get('/api/pokemon', function (req, res, next) {
  jsf.readFile("./data/inventory.json", function (err, data) {
    if (err) return next(err);
    res.send(data);
    next();
  });
});

app.listen(3000, function () {
  console.log('Pokemon GO Optimizer front-end listening on port 3000');

  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Accept the cert at ' + add + ':3000/ca.pem if you haven\'t already done so');
  });
});

/**
 * Mitm
 */

var _ = require('lodash');
var PokemonGoMITM = require('pokemon-go-mitm');
var PokemonData = require('./data/pokemon.json');
var releasing_id = null;

var server = new PokemonGoMITM({
  port: 8081
})
.setResponseHandler("GetInventory", function(data) {
  var formatted, tmp;
  tmp = data.inventory_delta.inventory_items;
  if (tmp.length > 0) {
    formatted = _.reduce(tmp, function(result, entry) {
      if (entry.inventory_item_data && entry.inventory_item_data.pokemon_data && !entry.inventory_item_data.pokemon_data.is_egg) {
        result.push(entry.inventory_item_data.pokemon_data);
      }
      return result;
    }, []);
    formatted = _.map(formatted, function (entry) {
      if (entry.individual_stamina === undefined) entry.individual_stamina = 0;
      if (entry.individual_attack === undefined)  entry.individual_attack  = 0;
      if (entry.individual_defense === undefined) entry.individual_defense = 0;
      entry.power_quotient = (entry.individual_stamina + entry.individual_attack + entry.individual_defense) / 45;
      var data = _.find(PokemonData, function (pokemon) {
        return (pokemon.Name.toUpperCase() == entry.pokemon_id || pokemon.AltName == entry.pokemon_id);
      });
      if (data != null) {
        entry.pokedex_id = parseInt(data.Number);
	      if (entry.nickname === undefined) entry.nickname = data["Name"];
        entry.type_1 = data["Type I"];
        if (data["Type II"]) entry.type_2 = data["Type II"];
      }
      entry.move_1 = formatMoveName(entry.move_1);
      entry.move_2 = formatMoveName(entry.move_2);
      entry.stat_base = computeStatBase(entry, data);
      entry.cpm_est = Math.sqrt(entry.cp) * entry.stat_base;
      entry.cpm = entry.cp_multiplier + (entry.additional_cp_multiplier === undefined ? 0 : entry.additional_cp_multiplier);
      return entry;
    });
    if (formatted.length > 0) {
      var inventory = jsf.readFileSync('./data/inventory.json');
      if (inventory.length > formatted.length) formatted = inventory.concat(formatted);
      jsf.writeFile("./data/inventory.json", formatted, {spaces: 2}, function(err) {
        if (err != null) console.log(err);
      });
    }
  }
})
.setRequestHandler("ReleasePokemon", function (data) {
  releasing_id = data.pokemon_id;
})
.setResponseHandler("ReleasePokemon", function(data) {
  if (data.result === 'SUCCESS' && releasing_id !== null) {
    var inventory = jsf.readFileSync('./data/inventory.json');
    _.remove(inventory, {id: releasing_id});
    releasing_id = null;
    jsf.writeFile("./data/inventory.json", inventory, {spaces: 2}, function(err) {
      if (err != null) console.log(err);
    });
  }
});

/**
 * Utility functions
 */

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatMoveName(name) {
  var ret = '';
  var spl = name.split('_');
  _.forEach(spl, function(str) {
    if (str !== 'FAST') {
      if (ret !== '') ret += ' ';
      ret += capitalize(str.toLowerCase());
    }
  });
  return ret;
}

/**
 * stat_base is a measure of this pokemon's individual strength, and will never change.
 * Unlike power_quotient, it is comparable cross-species.
 * It is related to the pokemon by: CPM = sqrt(CP) * stat_base,
 * Or equivalently: CP = (CPM / stat_base)^2
 */
function computeStatBase(entry, pokemon) {
    var atk = entry.individual_attack + pokemon.stats.attack;
    var def = entry.individual_defense + pokemon.stats.defense;
    var sta = entry.individual_stamina + pokemon.stats.stamina;
    return Math.sqrt(10 / (atk * Math.sqrt(def * sta)));
}

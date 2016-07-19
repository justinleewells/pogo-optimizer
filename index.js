/**
 * Express
 */

var jsf = require('jsonfile');
var express = require('express');
var app = express();
var fs = require('fs');

if (!fs.existsSync('./data/inventory.json')) {
  jsf.writeFileSync('./data/inventory.json', [], {}, function (err) {
    if (err) console.log(err);
  });
}

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
var MoveData = require('./data/moves.json');

var server = new PokemonGoMITM({
  port: 8081
}).setResponseHandler("GetInventory", function(data) {
  var formatted, tmp;
  tmp = data.inventory_delta.inventory_items;
  if (tmp.length > 0) {
    formatted = _.reduce(tmp, function(result, entry) {
      if (entry.inventory_item_data.pokemon !== undefined && !entry.inventory_item_data.pokemon.is_egg) {
        result.push(entry.inventory_item_data.pokemon);
      }
      return result;
    }, []);
    formatted = _.map(formatted, function (entry) {
      if (entry.individual_stamina === undefined) entry.individual_stamina = 0;
      if (entry.individual_attack === undefined)  entry.individual_attack  = 0;
      if (entry.individual_defense === undefined) entry.individual_defense = 0;
      entry.power_quotient = (entry.individual_stamina + entry.individual_attack + entry.individual_defense) / 45;
      var data = _.find(PokemonData, function (pokemon) {
        return (pokemon.Name.toUpperCase() == entry.pokemon_type || pokemon.AltName == entry.pokemon_type);
      });
      if (data != null) {
        entry.id = parseInt(data.Number);
        entry.type_1 = data["Type I"];
        if (data["Type II"]) entry.type_2 = data["Type II"];
      }
      var move1 = _.find(MoveData, {id: entry.move_1});
      if (move1 !== undefined) entry.move_1 = move1.name;
      var move2 = _.find(MoveData, {id: entry.move_2});
      if (move2 !== undefined) entry.move_2 = move2.name;
      return entry;
    });
    if (formatted.length > 0) {
      jsf.writeFile("./data/inventory.json", formatted, {spaces: 2}, function(err) {
        console.log(err);
      });
    }
  }
  return data;
});
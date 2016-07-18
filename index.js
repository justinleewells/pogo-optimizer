/**
 * Express
 */

var express = require('express');
var app = express();

app.use(express.static('.http-mitm-proxy/certs'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/**
 * Mitm
 */

var _ = require('lodash');
var jsf = require('jsonfile');
var PokemonGoMITM = require('pokemon-go-mitm-node');

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
    if (formatted.length > 0) {
      return jsf.writeFile("./data/inventory.json", formatted, {spaces: 2}, function(err) {
        return console.log(err);
      });
    }
  }
});
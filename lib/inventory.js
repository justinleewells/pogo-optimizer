var _   = require('lodash');
var fs  = require('fs');
var jsf = require('jsonfile');

var Pokemon = require('./pokemon');

/**
 * Object Definition
 */

var Inventory = function (username) {
  this.username = username;
  this.data = {
    candy:    [],
    pokemon:  []
  };
};

/**
 * Prototypes
 */

Inventory.prototype.load = function (candy, pokemon) {
  if (fs.existsSync(__dirname + '/../data/save/' + this.username)) {
    this.data.candy   = jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/inventory-candy.json');
    this.data.pokemon = _.map(jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/inventory-pokemon.json'), function (p) {
      return new Pokemon(p);
    });
    this.update(candy, pokemon);
  } else {
    this.data.candy   = candy;
    this.data.pokemon = _.map(pokemon, function (p) {
      return new Pokemon(p);
    });
  }
};

Inventory.prototype.save = function () {
  if (!fs.existsSync(__dirname + '/../data/save/' + this.username)) fs.mkdirSync(__dirname + '/../data/save/' + this.username);
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/inventory-candy.json', this.data.candy, {spaces: 2});
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/inventory-pokemon.json', this.data.pokemon, {spaces: 2});
};

Inventory.prototype.update = function (candy, pokemon) {
  this.data.candy = candy;

  var idMap = _.reduce(this.data.pokemon, function (result, p) {
    result[p.id] = false;
    return result;
  }, {});
  
  _.forEach(this.data.pokemon, function (p) {
    var data = _.find(pokemon, {id: p.id});
    p.update(data);
  });
};

module.exports = Inventory;

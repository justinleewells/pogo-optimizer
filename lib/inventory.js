var _   = require('lodash');
var fs  = require('fs');
var jsf = require('jsonfile');

var Pokemon = require('./pokemon');
var PokemonData = require('../data/game/pokemon.json');

/**
 * Object Definition
 */

var Inventory = function (username) {
  this.username = username;
  this.updates  = true;
  this.data = {
    candy:    [],
    pokemon:  []
  };
};

/**
 * Prototypes
 */

Inventory.prototype.load = function (candy, pokemon) {
  if (fs.existsSync(__dirname + '/../data/save/' + this.username + '/inventory-pokemon.json')) {
    this.data.candy   = jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/inventory-candy.json');
    this.data.pokemon = _.map(jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/inventory-pokemon.json'), function (p) {
      return new Pokemon(p);
    });
  } else {
    this.data.candy   = candy;
    this.data.pokemon = _.map(pokemon, function (p) {
      return new Pokemon(p);
    });
  }
  this.initialize(candy, pokemon);
};

Inventory.prototype.save = function () {
  var formatted = _.map(this.data.pokemon, function (p) {
    return p.data;
  });
  if (!fs.existsSync(__dirname + '/../data/save/' + this.username)) fs.mkdirSync(__dirname + '/../data/save/' + this.username);
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/inventory-candy.json', this.data.candy, {spaces: 2});
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/inventory-pokemon.json', formatted, {spaces: 2});
};

Inventory.prototype.initialize = function (candy, pokemon) {
  var self = this;

  this.data.candy = candy;

  _.forEach(this.data.candy, function (c) {
    if (c.id === undefined) {
      var spl = c.family_id.split('_');
      var name = spl[1];
      if (spl.length === 3) name += '_' + spl[2];
      var p = _.find(PokemonData, {name: name});
      c.id = p.id;
      c.cost = p.candy;
    }
  });

  var idMap = _.reduce(this.data.pokemon, function (result, p) {
    result[p.data.id] = false;
    return result;
  }, {});

  _.forEach(pokemon, function (data) {
    var p = _.find(self.data.pokemon, {data: {id: data.id}});
    if (p) p.update(data);
    else self.data.pokemon.push(new Pokemon(data));
    idMap[data.id] = true;
  });

  _.forEach(idMap, function (exists, id) {
    if (!exists) _.remove(self.data.pokemon, {data: {id: id}});
  });
};

Inventory.prototype.update = function (candy, pokemon) {
  var self = this;

  _.forEach(candy, function (c) {
    var data = _.find(self.data.candy, {family_id: c.family_id});
    if (data !== undefined) data.candy = c.candy;
    else {
      var name = c.family_id.split('_')[1];
      var p = _.find(PokemonData, {name: name});
      c.id = p.id;
      c.cost = p.candy;
      self.data.candy.push(c);
    }
    self.updates = true;
  });

  _.forEach(pokemon, function (data) {
    var p = _.find(self.data.pokemon, {data: {id: data.id}});
    if (p) p.update(data);
    else self.data.pokemon.push(new Pokemon(data));
    self.updates = true;
  });
};

Inventory.prototype.toJSON = function () {
  return {
    candy: this.data.candy,
    pokemon: _.map(this.data.pokemon, function (p) {
      return p.toJSON();
    }),
    updates: this.updates
  };
};

Inventory.prototype.release = function (id) {
  _.remove(this.data.pokemon, {data: {id: id}});
};

module.exports = Inventory;

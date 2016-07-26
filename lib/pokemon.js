var _ = require('lodash');
var LevelToCPM = require('../data/game/level-to-cpm.json');
var PokemonData = require('../data/game/pokemon.json');
var MoveData = require('../data/game/moves.json');

var Pokemon = function (data) {
  this.data     = data;
  this.metadata = {};
  this.initialize();
};

function determineLevel(cpm) {
  var ret = 0;
  _.forEach(LevelToCPM, function(value, level) {
    if (Math.abs(cpm - value) < 0.0001) ret = parseFloat(level);
  });
  return ret;
}

Pokemon.prototype.determineMetadata = function () {
  
  // set variables
  var pkmn = _.find(PokemonData, {name: this.data.pokemon_id});
  var cpm = this.data.cp_multiplier;
  if (this.data.additional_cp_multiplier) cpm += this.data.additional_cp_multiplier;
  var iva = this.data.individual_attack;
  var ivd = this.data.individual_defense;
  var ivs = this.data.individual_stamina;
  var ba = pkmn.stats.attack;
  var bd = pkmn.stats.defense;
  var bs = pkmn.stats.stamina;

  this.metadata.piv = (iva + ivd + ivs) / 45;
  this.metadata.level = determineLevel(cpm);
  this.metadata.id = pkmn.id;

  // determine max cp
  var perfcp = (ba + 15) * Math.pow((bd + 15), 0.5) * Math.pow((bs + 15), 0.5) * (Math.pow(LevelToCPM['40'], 2) / 10);
  var maxcp  = (ba + iva) * Math.pow((bd + ivd), 0.5) * Math.pow((bs + ivs), 0.5) * (Math.pow(LevelToCPM['40'], 2) / 10);
  var mincp  = (ba) * Math.pow((bd), 0.5) * Math.pow((bs), 0.5) * (Math.pow(LevelToCPM['40'], 2) / 10);
  this.metadata.pcp = (maxcp - mincp) / (perfcp - mincp);

  // get moves
  this.metadata.move_1 = _.find(MoveData, {Name: this.data.move_1});
  this.metadata.move_2 = _.find(MoveData, {Name: this.data.move_2});
};

Pokemon.prototype.initialize = function () {

  // add missing values
  if (this.data.individual_attack === undefined)  this.data.individual_attack  = 0;
  if (this.data.individual_defense === undefined) this.data.individual_defense = 0;
  if (this.data.individual_stamina === undefined) this.data.individual_stamina = 0;

  this.determineMetadata();
};

Pokemon.prototype.update = function (data) {
  this.data = data;
  this.initialize();
};

Pokemon.prototype.getId = function () {
  return this.data.id;
};

Pokemon.prototype.toJSON = function () {
  return {
    data: this.data,
    metadata: this.metadata
  }
};

module.exports = Pokemon;
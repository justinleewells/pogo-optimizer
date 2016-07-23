var _ = require('lodash');
var LevelToCPM = require('../data/game/level-to-cpm.json');

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
  var cpm = this.data.cp_multiplier;
  if (this.data.additional_cp_multiplier) cpm += this.data.additional_cp_multiplier;
  var aiv = this.data.individual_attack;
  var div = this.data.individual_defense;
  var siv = this.data.individual_stamina;
  
  this.metadata.piv = (aiv + div + siv) / 45;
  this.metadata.level = determineLevel(cpm);
};

Pokemon.prototype.initialize = function () {

  // add missing values
  if (!this.data.individual_attack)  this.data.individual_attack  = 0;
  if (!this.data.individual_defense) this.data.individual_defense = 0;
  if (!this.data.individual_stamina) this.data.individual_stamina = 0;

  this.determineMetadata();
};

Pokemon.prototype.update = function (data) {
  this.data = data;
  this.determineMetadata();
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
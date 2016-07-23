var Pokemon = function (data) {
  this.data     = data;
  this.metadata = {};
  this.changes  = [];
  this.initialize();
};

Pokemon.prototype.determineMetadata = function () {
  
  // set variables
  var aiv = this.data.individual_attack;
  var div = this.data.individual_defense;
  var siv = this.data.individual_stamina;
  
  this.metadata.piv = 45 / (aiv + div + siv);
};

Pokemon.prototype.initialize = function () {

  // add missing values
  if (!this.data.individual_attack)  this.data.individual_attack  = 0;
  if (!this.data.individual_defense) this.data.individual_defense = 0;
  if (!this.data.individual_stamina) this.data.individual_stamina = 0;

  this.determineMetadata();
};

Pokemon.prototype.update = function (data) {
};

Pokemon.prototype.getChanges = function () {
  return this.changes;
};

module.exports = Pokemon;
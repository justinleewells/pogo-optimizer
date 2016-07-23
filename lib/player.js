var _   = require('lodash');
var fs  = require('fs');
var jsf = require('jsonfile');

/**
 * Object Definition
 */

var Player = function (username) {
  this.username = username;
  this.data     = null;
  this.metadata = {
    isNew: false
  };
};

/**
 * Prototypes
 */

Player.prototype.load = function (data) {
  if (fs.existsSync(__dirname + '/../data/save/' + this.username)) {
    this.data = jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/player-data.json');
    this.update(data);
  } else {
    this.isNew = true;
    this.data  = data;
  }
};

Player.prototype.save = function () {
  if (!fs.existsSync(__dirname + '/../data/save/' + this.username)) fs.mkdirSync(__dirname + '/../data/save/' + this.username);
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/player-data.json', this.data, {spaces: 2});
};

Player.prototype.update = function (data) {
  this.data = data;
};

Player.prototype.toJSON = function () {
  return {
    data: this.data,
    metadata: this.metadata
  };
};

module.exports = Player;
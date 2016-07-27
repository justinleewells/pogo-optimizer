var _   = require('lodash');
var fs  = require('fs');
var jsf = require('jsonfile');

/**
 * Object Definition
 */

var Player = function (username) {
  this.username = username;
  this.data     = null;
  this.settings = null;
};

/**
 * Prototypes
 */

Player.prototype.load = function (data) {
  if (fs.existsSync(__dirname + '/../data/save/' + this.username)) {
    this.data = jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/player-data.json');
    this.settings = jsf.readFileSync(__dirname + '/../data/save/' + this.username + '/player-settings.json');
    this.update(data);
  } else {
    this.data = data;
    this.settings = {
      spreadsheet: {
        color:  {
          iv:   false,
          move: false
        },
        display: {
          move_1:       true,
          move_2:       false,
          move_energy:  false,
          move_dps:     false,
          level:        true,
          cp:           true,
          hp:           true,
          atk:          false,
          def:          false,
          iva:          true,
          ivd:          true,
          ivs:          true,
          dps:          false,
          piv:          true,
          pcp:          true
        }
      }
    };
  }
};

Player.prototype.save = function () {
  if (!fs.existsSync(__dirname + '/../data/save/' + this.username)) fs.mkdirSync(__dirname + '/../data/save/' + this.username);
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/player-data.json', this.data, {spaces: 2});
  jsf.writeFileSync(__dirname + '/../data/save/' + this.username + '/player-settings.json', this.settings, {spaces: 2});
};

Player.prototype.update = function (data) {
  this.data = data;
};

Player.prototype.toJSON = function () {
  return {
    data: this.data,
    settings: this.settings
  };
};

module.exports = Player;
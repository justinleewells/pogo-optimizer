var _ = require('lodash');
var jsf = require('jsonfile');
var data = require('../data/raw_data');

var arr = [];

function formatType(str) {
  var spl = str.split('_');
  return spl[2];
}

var index = 0;
_.forEach(data, function (d) {
  var pokemon = d.Pokemon;
  if (pokemon !== undefined) {

    var tmp = {};
    var spl = pokemon.UniqueID.split('_');

    tmp.id = parseInt(spl[0].replace('V', ''));

    var name = '';
    for (var i = 2; i < spl.length; i++) {
      if (i !== 2) name += '_';
      name += spl[i];
    }
    tmp.name = name;

    tmp.type1 = formatType(pokemon.Type1);
    if (pokemon.Type2) tmp.type2 = formatType(pokemon.Type2);

    tmp.stats = {
      stamina: pokemon.Stats.BaseStamina,
      attack:  pokemon.Stats.BaseAttack,
      defense: pokemon.Stats.BaseDefense
    };

    if (pokemon.CandyToEvolve) tmp.candy = pokemon.CandyToEvolve;
    tmp.family = 'FAMILY_';
    tmp.moves1 = [];
    tmp.moves2 = [];

    arr.push(tmp);
    index++;
  }
});

jsf.writeFileSync(__dirname + '/out/pokemon.json', arr, {spaces: 2});
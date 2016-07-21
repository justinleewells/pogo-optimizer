var _ = require('lodash');
var jsf = require('jsonfile');
var raw = require('../data/raw_data.json');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var moves = _.reduce(raw, function (result, entry) {
  if (entry.Move !== undefined) result.push(entry.Move);
  return result;
}, []);

moves = _.map(moves, function (entry) {
  var tmp = {};
  var info = entry.UniqueID.split('_');
  tmp.id = parseInt(info[0].replace('V', ''));
  var type = entry.Type.split('_');
  tmp.type = capitalizeFirstLetter(type[type.length-1].toLowerCase());
  var name = '';
  for (var i = 2; i < info.length; i++) {
	if (i !== 2) name += ' ';
	name += capitalizeFirstLetter(info[i].toLowerCase());
  }
  tmp.name = name;
  return tmp;
});

var data = {
  "100": "X Scissor",
  "101": "Flame Charge",
  "102": "Flame Burst",
  "103": "Fire Blast",
  "104": "Brine",
  "105": "Water Pulse",
  "106": "Scald",
  "107": "Hydro Pump",
  "108": "Psychic",
  "109": "Psystrike",
  "111": "Icy Wind",
  "114": "Giga Drain",
  "115": "Fire Punch",
  "116": "Solar Beam",
  "117": "Leaf Blade",
  "118": "Power Whip",
  "121": "Air Cutter",
  "122": "Hurricane",
  "123": "Brick Break",
  "125": "Swift",
  "126": "Horn Attack",
  "127": "Stomp",
  "129": "Hyper Fang",
  "131": "Body Slam",
  "132": "Rest",
  "133": "Struggle",
  "134": "Scald Blastoise",
  "135": "Hydro Pump Blastoise",
  "136": "Wrap Green",
  "137": "Wrap Pink",
  "200": "Fury Cutter",
  "201": "Bug Bite",
  "202": "Bite",
  "203": "Sucker Punch",
  "204": "Dragon Breath",
  "205": "Thunder Shock",
  "206": "Spark",
  "207": "Low Kick",
  "208": "Karate Chop",
  "209": "Ember",
  "210": "Wing Attack",
  "211": "Peck",
  "212": "Lick",
  "213": "Shadow Claw",
  "214": "Vine Whip",
  "215": "Razor Leaf",
  "216": "Mud Shot",
  "217": "Ice Shard",
  "218": "Frost Breath",
  "219": "Quick Attack",
  "220": "Scratch",
  "221": "Tackle",
  "222": "Pound",
  "223": "Cut",
  "224": "Poison Jab",
  "225": "Acid",
  "226": "Psycho Cut",
  "227": "Rock Throw",
  "228": "Metal Claw",
  "229": "Bullet Punch",
  "230": "Water Gun",
  "231": "Splash",
  "232": "Water Gun Blastoise",
  "233": "Mud Slap",
  "234": "Zen Headbutt",
  "235": "Confusion",
  "236": "Poison Sting",
  "237": "Bubble",
  "238": "Feint Attack",
  "239": "Steel Wing",
  "240": "Fire Fang",
  "241": "Rock Smash",
  "013": "Wrap",
  "014": "Hyper Beam",
  "016": "Dark Pulse",
  "018": "Sludge",
  "020": "Vice Grip",
  "021": "Flame Wheel",
  "022": "Megahorn",
  "024": "Flamethrower",
  "026": "Dig",
  "028": "Cross Chop",
  "030": "Psybeam",
  "031": "Earthquake",
  "032": "Stone Edge",
  "033": "Ice Punch",
  "034": "Heart Stamp",
  "035": "Discharge",
  "036": "Flash Cannon",
  "038": "Drill Peck",
  "039": "Ice Beam",
  "040": "Blizzard",
  "042": "Heat Wave",
  "045": "Aerial Ace",
  "046": "Drill Run",
  "047": "Petal Blizzard",
  "048": "Mega Drain",
  "049": "Bug Buzz",
  "050": "Poison Fang",
  "051": "Night Slash",
  "053": "Bubble Beam",
  "054": "Submission",
  "056": "Low Sweep",
  "057": "Aqua Jet",
  "058": "Aqua Tail",
  "059": "Seed Bomb",
  "060": "Psyshock",
  "062": "Ancient Power",
  "063": "Rock Tomb",
  "064": "Rock Slide",
  "065": "Power Gem",
  "066": "Shadow Sneak",
  "067": "Shadow Punch",
  "069": "Ominous Wind",
  "070": "Shadow Ball",
  "072": "Magnet Bomb",
  "074": "Iron Head",
  "075": "Parabolic Charge",
  "077": "Thunder Punch",
  "078": "Thunder",
  "079": "Thunderbolt",
  "080": "Twister",
  "082": "Dragon Pulse",
  "083": "Dragon Claw",
  "084": "Disarming Voice",
  "085": "Draining Kiss",
  "086": "Dazzling Gleam",
  "087": "Moonblast",
  "088": "Play Rough",
  "089": "Cross Poison",
  "090": "Sludge Bomb",
  "091": "Sludge Wave",
  "092": "Gunk Shot",
  "094": "Bone Club",
  "095": "Bulldoze",
  "096": "Mud Bomb",
  "099": "Signal Beam"
};

_.forEach(data, function (name, key) {
  if (_.find(moves, {name: name}) == undefined) {
	moves.push({
	  id: parseInt(key),
	  name: name
	});
  }
});

jsf.writeFile('../data/moves.json', moves, function (err) {
  if (err) console.log(err);
});
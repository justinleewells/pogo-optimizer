var PokemonListContainer = React.createClass({
  loadPokemonFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        this.setSortType(this.state.sort, data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  customSorts: {
    // Alias or create custom sort orders here, e.g.
    //   species: ['pokemon_id', 'nickname +']
  },
  defaultSecondarySorts: ['nickname +', 'power_quotient +'],
  setSortType: function(type, data) {
    var state = {}, seenProps = {}, sortProps;

    state.sortReverse = data
      ? this.state.sortReverse
      : this.state.sort === type
        ? !this.state.sortReverse
        : false;
    state.sort = type;
    state.data = data || this.state.data;

    sortProps = this.customSorts[type] || type;

    if ('string' === typeof sortProps) {
      sortProps = [sortProps];
    }

    // Concat the sortProps with the defaults, then iterate backwards over the
    // array to splice out duplicate properties in the case that passed props
    // are in the defaults
    sortProps = sortProps.concat(this.defaultSecondarySorts);
    sortProps.reverse();
    for (var i = sortProps.length - 1, seenProp; i >= 0; i--) {
      seenProp = sortProps[i].split(' ')[0];
      if (seenProps[seenProp]) { sortProps.splice(i, 1); }
      seenProps[seenProp] = 1;
    }
    sortProps.reverse();

    state.data.sort(makeSort(sortProps, state.sortReverse));
    this.setState(state);
  },
  getInitialState: function() {
    return {data: [], sort: 'power_quotient', sortReverse: false};
  },
  componentDidMount: function() {
    this.loadPokemonFromServer();
    setInterval(this.loadPokemonFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div id="pokemonListContainer">
        <PokemonList data={this.state.data} sort={this.state.sort} sortReverse={this.state.sortReverse} setSortType={this.setSortType} />
      </div>
    );
  }
});

var PokemonList = React.createClass({
  render: function() {
    var pokemonNodes = this.props.data.map(function(pokemon) {
      return (
        <tr key={pokemon.id}>
          <td>
            <h4 className="ui image header">
              <img className="ui mini rounded image" src={'assets/img/icons/' + pokemon.pokedex_id + '.png'} />
              <div className="content name">
                {pokemon.nickname || humanizePokemonId(pokemon.pokemon_id)}
                <div className="sub header">
                  {(Math.round(pokemon.weight_kg * 100) / 100) + "kg, " + (Math.round(pokemon.height_m * 100) / 100) + "m"}
                </div>
                <div className="sub header">
                  {pokemon.move_1 + "/" + pokemon.move_2}
                </div>
              </div>
            </h4>
          </td>
          <td className={"stat " + pokemon.pokemon_id}>{humanizePokemonId(pokemon.pokemon_id)}</td>
          <td className={"stat " + pokemon.type_1}>{pokemon.type_1}</td>
          <td className={"stat " + pokemon.type_2}>{pokemon.type_2}</td>
          <td className="stat">{pokemon.cp}</td>
          <td className="stat">{pokemon.stamina_max}</td>
          <td className="stat atk">{pokemon.individual_attack}</td>
          <td className="stat def">{pokemon.individual_defense}</td>
          <td className="stat sta">{pokemon.individual_stamina}</td>
          <td className="stat">{Math.round(100 * pokemon.power_quotient) + "%"}</td>
        </tr>
      );
    });

    var thClass = function (prop, extra) {
      var cssClasses = (extra || '').split(' ');

      if (prop === this.props.sort) {
        cssClasses.push('active');
        if (this.props.sortReverse) cssClasses.push('reverseSort');
      }

      return cssClasses.join(' ');
    }.bind(this);

    return (
      <div className="ui container">
        <h1 id="title">Pokemon GO Optimizer</h1>
        <table className="ui celled table">
          <thead>
            <tr>
              <th className={thClass('nickname')} onClick={() => this.props.setSortType('nickname')}>Pokemon</th>
              <th className={thClass('pokemon_id', 'stat')} onClick={() => this.props.setSortType('pokemon_id')}>Species</th>
              <th className={thClass('type_1', 'stat')} onClick={() => this.props.setSortType('type_1')}>Type 1</th>
              <th className={thClass('type_2', 'stat')} onClick={() => this.props.setSortType('type_2')}>Type 2</th>
              <th className={thClass('cp', 'stat')} onClick={() => this.props.setSortType('cp')}>CP</th>
              <th className={thClass('stamina_max', 'stat')} onClick={() => this.props.setSortType('stamina_max')}>HP</th>
              <th className={thClass('individual_attack', 'stat atk')} onClick={() => this.props.setSortType('individual_attack')}>ATK</th>
              <th className={thClass('individual_defense', 'stat def')} onClick={() => this.props.setSortType('individual_defense')}>DEF</th>
              <th className={thClass('individual_stamina', 'stat sta')} onClick={() => this.props.setSortType('individual_stamina')}>STA</th>
              <th className={thClass('power_quotient', 'stat')} onClick={() => this.props.setSortType('power_quotient')}>Perfect</th>
            </tr>
          </thead>
          <tbody>
            {pokemonNodes}
          </tbody>
        </table>
      </div>
    );
  }
});


/**
 * Creates a sort function for an array of objects by a property or list of
 * properties in descending order of priority.
 *
 * Appending a space and + or - to the property name will result in the property
 * ignoring the reverse param and always sorting in ascending or descending order.
 *
 * @param {string|string[]} props Any number of property names and optional forced sort (+ or -)
 * @param {boolean} reverse Reverse the sort?  Default `false`
 */
function makeSort (props, reverse) {
  props = 'string' === typeof props ? [props] : props;

  function sortOn (i, a, b) {
    var propArray = props[i++].split(' ')
      , prop = propArray[0]
      , forcedDir = propArray[1]
      , asc = '+' === forcedDir || reverse && '-' !== forcedDir
      , result;

    if (a[prop] == b[prop]) {
      return props[i] ? sortOn(i, a, b) : 0;
    }

    // default result is descending, if it's been determined that we should
    // sort 'asc', flip the result.
    result = a[prop] < b[prop] ? 1 : -1;
    return asc ? result * -1 : result;
  }

  return function (a, b) {
    return sortOn(0, a, b);
  }
}


/**
 * Reformats a system pokemon ID to title-like string
 *
 * @param {string} id A pokemon ID
 */
function humanizePokemonId (id) {
  return (id || '').split('_').map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join(' ');
}


ReactDOM.render(
  <PokemonListContainer url="/api/pokemon" pollInterval={2000} />,
  document.getElementById('content')
);

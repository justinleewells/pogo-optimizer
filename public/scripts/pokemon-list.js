var PokemonListContainer = React.createClass({
  loadPokemonFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setSortType(this.state.sort, data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  setSortType: function(type, data) {
    this.setState({sort: type});

    data = data || this.state.data;
    if (this.state.sort === 'perfect') {
      data.sort(function (a, b) {
        if (a.power_quotient > b.power_quotient) {
          return -1;
        }
        if (a.power_quotient < b.power_quotient) {
          return 1;
        }
        return 0;
      });
    }
    else if (this.state.sort === 'species') {
      data.sort(function (a, b) {
        if (a.id == b.id) {
          if (a.power_quotient > b.power_quotient) {
            return -1;
          }
          if (a.power_quotient < b.power_quotient) {
            return 1;
          }
          return 0;
        }
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
    }
    else if (this.state.sort === 'cp') {
      data.sort(function (a, b) {
        if (a.cp > b.cp) {
          return -1;
        }
        if (a.cp < b.cp) {
          return 1;
        }
        return 0;
      });
    }

    this.setState({data: data});
  },
  getInitialState: function() {
    return {data: [], sort: 'perfect'};
  },
  componentDidMount: function() {
    this.loadPokemonFromServer();
    setInterval(this.loadPokemonFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div id="pokemonListContainer">
        <PokemonList data={this.state.data} setSortType={this.setSortType} />
      </div>
    );
  }
});

var PokemonList = React.createClass({
  render: function() {
    var pokemonNodes = this.props.data.map(function(pokemon) {
      return (
        <tr>
          <td>
            <h4 className="ui image header">
              <img className="ui mini rounded image" src={'assets/img/icons/' + pokemon.id + '.png'} />
              <div className="content name">
                {pokemon.nickname || pokemon.pokemon_type.toLowerCase()}
                <div className="sub header">
                  {(Math.round(pokemon.weight_kg * 100) / 100) + "kg, " + (Math.round(pokemon.height_m * 100) / 100) + "m"}
                </div>
                <div className="sub header">
                  {pokemon.move_1 + "/" + pokemon.move_2}
                </div>
              </div>
            </h4>
          </td>
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
    return (
      <div className="ui container">
        <h1 id="title">Pokemon GO Optimizer</h1>
        <button className="ui button white" onClick={() => this.props.setSortType('perfect')}>
          Perfect
        </button>
        <button className="ui button white" onClick={() => this.props.setSortType('species')}>
          Species
        </button>
        <button className="ui button white" onClick={() => this.props.setSortType('cp')}>
          CP
        </button>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Pokemon</th>
              <th className="stat">Type 1</th>
              <th className="stat">Type 2</th>
              <th className="stat">CP</th>
              <th className="stat">HP</th>
              <th className="stat atk">ATK</th>
              <th className="stat def">DEF</th>
              <th className="stat sta">STA</th>
              <th className="stat">Perfect</th>
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

ReactDOM.render(
  <PokemonListContainer url="/api/pokemon" pollInterval={2000} />,
  document.getElementById('content')
);
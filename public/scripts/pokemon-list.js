var PokemonListContainer = React.createClass({
  loadPokemonFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        data.sort(function (a, b) {
          if (a.power_quotient > b.power_quotient) {
            return -1;
          }
          if (a.power_quotient < b.power_quotient) {
            return 1;
          }
          return 0;
        });
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadPokemonFromServer();
    setInterval(this.loadPokemonFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div id="pokemonListContainer">
        <PokemonList data={this.state.data} />
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
              </div>
            </h4>
          </td>
          <td className={"stat " + pokemon.type_1}>{pokemon.type_1}</td>
          <td className={"stat " + pokemon.type_2}>{pokemon.type_2}</td>
          <td className="stat">{pokemon.cp}</td>
          <td className="stat">{pokemon.stamina_max}</td>
          <td className="stat">{pokemon.individual_attack}</td>
          <td className="stat">{pokemon.individual_defense}</td>
          <td className="stat">{pokemon.individual_stamina}</td>
          <td className="stat">{Math.round(100 * pokemon.power_quotient) + "%"}</td>
        </tr>
      );
    });
    return (
      <div id="pokemonList">
        <h1 id="title">Pokemon GO Optimizer</h1>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Pokemon</th>
              <th>Type 1</th>
              <th>Type 2</th>
              <th className="stat">CP</th>
              <th className="stat">HP</th>
              <th className="stat">ATK</th>
              <th className="stat">DEF</th>
              <th className="stat">STA</th>
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
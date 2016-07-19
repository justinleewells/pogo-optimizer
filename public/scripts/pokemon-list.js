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
        // <div className="pokemonEntry">
        //   <div  className="portrait" style={{backgroundImage: 'url(assets/img/icons/' + pokemon.id + '.png)'}} />
        //   <span className="name">{pokemon.nickname || pokemon.pokemon_type.toLowerCase()}</span>
        //   <span className="cell iv attack">{pokemon.individual_attack}</span>
        //   <span className="cell iv stamina">{pokemon.individual_stamina}</span>
        //   <span className="cell iv defense">{pokemon.individual_defense}</span>
        //   <span className="cell quotient">{Math.round(100 * pokemon.power_quotient) + "%"}</span>
        // </div>
        <tr>
          <td>
            <h4 className="ui image header">
              <img className="ui mini rounded image" src={'assets/img/icons/' + pokemon.id + '.png'} />
              <div className="content name">
                {pokemon.nickname || pokemon.pokemon_type.toLowerCase()}
              </div>
            </h4>
          </td>
          <td>{pokemon.individual_attack}</td>
          <td>{pokemon.individual_defense}</td>
          <td>{pokemon.individual_stamina}</td>
          <td>{Math.round(100 * pokemon.power_quotient) + "%"}</td>
        </tr>
      );
    });
    return (
      <div id="pokemonList">
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Pokemon</th>
              <th>Attack</th>
              <th>Defense</th>
              <th>Stamina</th>
              <th>Quotient</th>
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
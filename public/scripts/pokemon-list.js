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
      <div className="pokemonListContainer">
        <PokemonList data={this.state.data} />
      </div>
    );
  }
});

var PokemonList = React.createClass({
  render: function() {
    var pokemonNodes = this.props.data.map(function(pokemon) {
      return (
        <div>
          <img class="pokemonPortrait" src={"assets/img/icons/" + pokemon.id + ".png"} />
          <span class="iv attack">{pokemon.individual_attack}</span>
          <span class="iv stamina">{pokemon.individual_stamina}</span>
          <span class="iv defense">{pokemon.individual_defense}</span>
          <span class="powerQuotient">{Math.round(100 * pokemon.power_quotient)}</span>
        </div>
      );
    });
    return (
      <div className="pokemonList">
        {pokemonNodes}
      </div>
    );
  }
});

ReactDOM.render(
  <PokemonListContainer url="/api/pokemon" pollInterval={2000} />,
  document.getElementById('content')
);
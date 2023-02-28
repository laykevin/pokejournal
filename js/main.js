var $pokemonName = document.querySelector('#poke-name');
var $pokemonNameForm = document.querySelector('#poke-name-form');
var $spriteBox = document.querySelector('.box-sprites');
$pokemonNameForm.addEventListener('submit', storePokeData);

function storePokeData(event) {
  event.preventDefault();
  var pokeData = {};
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + $pokemonName.value.toLowerCase());
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    if (xhr.status !== 200) {
      $pokemonName.setCustomValidity("That Pokemon doesn't exist!");
      $pokemonName.reportValidity();
      return;
    }
    pokeData.sprites = xhr.response.sprites;
    pokeData.name = xhr.response.species.name;
    pokeData.entryId = data.nextEntryId;
    data.nextEntryId++;
    data.entries.push(pokeData);
    $pokemonNameForm.reset();
    $spriteBox.appendChild(renderPokemon(pokeData));
  });
  xhr.send();

}

function renderPokemon(pokemon) {
  var $sprite = document.createElement('img');
  $sprite.className = 'sprite';
  $sprite.src = pokemon.sprites.front_default;
  $spriteBox.appendChild($sprite);
  return $sprite;
}

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.entries.length; i++) {
    renderPokemon(data.entries[i]);
  }
});

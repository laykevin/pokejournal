var $addPokemon = document.querySelector('.add-button');
var $pokemonName = document.querySelector('#poke-name');
var $pokemonNameForm = document.querySelector('#poke-name-form');
$addPokemon.addEventListener('click', storePokeData);
var pokeData = {};
function storePokeData(event) {
  event.preventDefault();
  getPokeData($pokemonName.value);
  pokeData.entryId = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(pokeData);
  $pokemonNameForm.reset();
}

function getPokeData(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + name);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokeData.sprites = xhr.response.sprites;
    pokeData.name = xhr.response.species.name;
  });
  xhr.send();
}

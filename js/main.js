var $pokemonName = document.querySelector('#poke-name');
var $pokemonNameForm = document.querySelector('#poke-name-form');
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
    data.entries.unshift(pokeData);
    $pokemonNameForm.reset();
  });
  xhr.send();

}

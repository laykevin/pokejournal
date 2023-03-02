var $billsPC = document.querySelector('#pc');
var $myParty = document.querySelector('#party');
var $pokemonName = document.querySelector('#poke-name');
var $pokemonNameForm = document.querySelector('#poke-name-form');
var $spriteBox = document.querySelector('.box-sprites');
var $partyPicures = document.querySelector('.party-row');
var $modal = document.querySelector('#modal');
var $officialArt = document.querySelector('.official-art');
var $editingName = document.querySelector('.poke-name');
var $xButton = document.querySelector('.fa-circle-xmark');
var $boxView = document.querySelector('#box-view');
var $partyView = document.querySelector('#party-view');

function viewSwap(view) {
  if (view === 'box-view') {
    $boxView.className = '';
    $partyView.className = 'hidden';
  }
  if (view === 'party-view') {
    $boxView.className = 'hidden';
    $partyView.className = '';
  }
  data.view = view;
}

$billsPC.addEventListener('click', function (event) {
  event.preventDefault();
  viewSwap('box-view');
});
$myParty.addEventListener('click', function (event) {
  event.preventDefault();
  viewSwap('party-view');
});

$pokemonNameForm.addEventListener('submit', storePokeData);
function storePokeData(event) {
  event.preventDefault();
  var pokeData = {
    nickname: '',
    moves: ''
  };
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
  $sprite.setAttribute('data-entry-id', pokemon.entryId);
  $sprite.src = pokemon.sprites.front_default;
  $spriteBox.appendChild($sprite);
  return $sprite;
}

function renderParty(pokemon) {
  var $partyImg = document.createElement('img');
  $partyImg.className = 'party-img';
  $partyImg.setAttribute('data-entry-id', pokemon.entryId);
  $partyImg.src = pokemon.sprites.other['official-artwork'].front_default;
  $partyPicures.appendChild($partyImg);
  return $partyImg;
}

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.entries.length; i++) {
    renderPokemon(data.entries[i]);
  }
  for (var p = 0; p < data.partyEntries.length; p++) {
    renderParty(data.partyEntries[p]);
  }
});

var $editingForm = document.querySelector('#editing-form');
var $nickName = document.querySelector('#nickname');
var $nature = document.querySelector('#nature');
var $gender = document.querySelector('#gender');
var $moves = document.querySelector('#moves');
$spriteBox.addEventListener('click', showModal);
function showModal(event) {
  if (event.target.className === 'sprite') {
    $modal.className = 'modal';
    for (var i = 0; i < data.entries.length; i++) {
      if (event.target.getAttribute('data-entry-id') === data.entries[i].entryId.toString()) {
        data.editing = data.entries[i];
        $officialArt.src = data.entries[i].sprites.other['official-artwork'].front_default;
        $officialArt.alt = data.editing.name;
        $editingName.textContent = data.entries[i].name.charAt(0).toUpperCase() + data.entries[i].name.slice(1);
        $nickName.value = data.editing.nickname;
        $nature.value = data.editing.nature;
        $gender.value = data.editing.gender;
        $moves.value = data.editing.moves;
      }
    }
  }
}

$editingForm.addEventListener('submit', function (event) {
  event.preventDefault();
  data.editing.nickname = $nickName.value;
  data.editing.nature = $nature.value;
  data.editing.gender = $gender.value;
  data.editing.moves = $moves.value;
  $modal.className = 'modal hidden';
  data.editing = null;
});

$xButton.addEventListener('click', function (event) {
  $modal.className = 'modal hidden';
});

var $deleteModal = document.querySelector('#delete-modal');
var $releaseButton = document.querySelector('#release');
var $cancelButton = document.querySelector('#cancel');
var $confirmButton = document.querySelector('#confirm');
var $withdrawButton = document.querySelector('#withdraw');
$releaseButton.addEventListener('click', function (event) {
  $deleteModal.className = 'modal';
});
$cancelButton.addEventListener('click', function (event) {
  $deleteModal.className = 'modal hidden';
});
$confirmButton.addEventListener('click', deletePokemon);
function deletePokemon(event) {
  for (var d = 0; d < data.entries.length; d++) {
    if (data.editing.entryId === data.entries[d].entryId) {
      data.entries.splice(d, 1);
      var $removeSprite = document.querySelector('[data-entry-id="' + data.editing.entryId.toString() + '"]');
      $removeSprite.remove();
      $deleteModal.className = 'modal hidden';
      $modal.className = 'modal hidden';
    }
  }
}
$withdrawButton.addEventListener('click', function (event) {
  if (data.partyEntries.length === 6) {
    return;
  }
  deletePokemon();
  data.partyEntries.push(data.editing);
  renderParty(data.editing);
  if (data.partyEntries.length === 6) {
    viewSwap('party-view');
  }
});

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
  var $partyCard = document.createElement('div');
  var $partyImg = document.createElement('img');
  var $partyCardName = document.createElement('h2');
  $partyCard.appendChild($partyImg);
  $partyCard.appendChild($partyCardName);
  $partyCardName.className = 'text-center name-margin';
  $partyCard.className = 'party-card';
  $partyCardName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  $partyImg.className = 'party-img';
  $partyImg.setAttribute('data-entry-id', pokemon.entryId);
  $partyImg.src = pokemon.sprites.other['official-artwork'].front_default;
  $partyPicures.appendChild($partyCard);
  return $partyImg;
}

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.entries.length; i++) {
    renderPokemon(data.entries[i]);
  }
  for (var p = 0; p < data.partyEntries.length; p++) {
    renderParty(data.partyEntries[p]);
  }
  viewSwap(data.view);
});

var $editingForm = document.querySelector('#editing-form');
var $nickName = document.querySelector('#nickname');
var $nature = document.querySelector('#nature');
var $gender = document.querySelector('#gender');
var $moves = document.querySelector('#moves');

function showModal(event) {
  if (event.target.className === 'sprite') {
    $modal.className = 'modal';
    for (var i = 0; i < data.entries.length; i++) {
      if (event.target.getAttribute('data-entry-id') === data.entries[i].entryId.toString()) {
        data.editing = data.entries[i];
        $officialArt.src = data.editing.sprites.other['official-artwork'].front_default;
        $officialArt.alt = data.editing.name;
        $editingName.textContent = data.editing.name.charAt(0).toUpperCase() + data.editing.name.slice(1);
        $nickName.value = data.editing.nickname;
        $nature.value = data.editing.nature;
        $gender.value = data.editing.gender;
        $moves.value = data.editing.moves;
        return;
      }
    }
  }
}

function showModalParty(event) {
  if (event.target.className === 'party-img') {
    $modal.className = 'modal';
    for (var g = 0; g < data.partyEntries.length; g++) {
      if (event.target.getAttribute('data-entry-id') === data.partyEntries[g].entryId.toString()) {
        data.editing = data.partyEntries[g];
        $officialArt.src = data.editing.sprites.other['official-artwork'].front_default;
        $officialArt.alt = data.editing.name;
        $editingName.textContent = data.editing.name.charAt(0).toUpperCase() + data.editing.name.slice(1);
        $nickName.value = data.editing.nickname;
        $nature.value = data.editing.nature;
        $gender.value = data.editing.gender;
        $moves.value = data.editing.moves;
        return;
      }
    }
  }
}

$spriteBox.addEventListener('click', function (event) {
  showModal(event);
  $depositButton.className = 'withdraw hidden';
  $withdrawButton.className = 'withdraw';
});
$partyPicures.addEventListener('click', function (event) {
  showModalParty(event);
  $depositButton.className = 'withdraw';
  $withdrawButton.className = 'withdraw hidden';
});
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
var $depositButton = document.querySelector('#deposit');
$releaseButton.addEventListener('click', function (event) {
  $deleteModal.className = 'modal';
});
$cancelButton.addEventListener('click', function (event) {
  $deleteModal.className = 'modal hidden';
});
$confirmButton.addEventListener('click', deletePokemon);
function deletePokemon(event) {
  for (var q = 0; q < data.partyEntries.length; q++) {
    if (data.editing.entryId === data.partyEntries[q].entryId) {
      data.partyEntries.splice(q, 1);
      var $removeImg = document.querySelector('[data-entry-id="' + data.editing.entryId.toString() + '"]');
      $removeImg.closest('.party-card').remove();
      $deleteModal.className = 'modal hidden';
      $modal.className = 'modal hidden';
      if (data.partyEntries.length === 0) {
        viewSwap('box-view');
      }
      return;
    }
  }
  for (var d = 0; d < data.entries.length; d++) {
    if (data.editing.entryId === data.entries[d].entryId) {
      data.entries.splice(d, 1);
      var $removeSprite = document.querySelector('[data-entry-id="' + data.editing.entryId.toString() + '"]');
      $removeSprite.remove();
      $deleteModal.className = 'modal hidden';
      $modal.className = 'modal hidden';
      return;
    }
  }
}
$withdrawButton.addEventListener('click', function (event) {
  if (data.partyEntries.length === 6) {
    return;
  }
  deletePokemon(event);
  data.partyEntries.push(data.editing);
  renderParty(data.editing);
  if (data.partyEntries.length === 6) {
    viewSwap('party-view');
  }
});
$depositButton.addEventListener('click', function (event) {
  for (var r = 0; r < data.partyEntries.length; r++) {
    if (data.editing.entryId === data.partyEntries[r].entryId) {
      data.partyEntries.splice(r, 1);
      var $removeImg = document.querySelector('[data-entry-id="' + data.editing.entryId.toString() + '"]');
      $removeImg.closest('.party-card').remove();
      $modal.className = 'modal hidden';
      data.entries.push(data.editing);
      renderPokemon(data.editing);
      if (data.partyEntries.length === 0) {
        viewSwap('box-view');
      }
      return;
    }
  }
});

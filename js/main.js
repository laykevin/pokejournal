var $billsPC = document.querySelector('#pc');
var $myParty = document.querySelector('#party');
var $pokemonName = document.querySelector('#poke-name');
var $pokemonNameForm = document.querySelector('#poke-name-form');
var $spriteBox = document.querySelector('.box-sprites');
var $partyPicures = document.querySelector('.party-row');
var $modal = document.querySelector('#modal');
var $glassModal = document.querySelector('#glass-modal');
var $modalContainer = document.querySelector('.modal-container');
var $officialArt = document.querySelector('.official-art');
var $editingName = document.querySelector('.poke-name');
var $pokedexNumber = document.querySelector('.pokedex-number');
var $xButton = document.querySelector('.fa-circle-xmark');
var $boxView = document.querySelector('#box-view');
var $partyView = document.querySelector('#party-view');

function viewSwap(view) {
  if (view === 'box-view') {
    $boxView.className = 'fadein';
    $partyView.className = 'hidden';
    $billsPC.className = 'underline';
    $myParty.className = '';
  }
  if (view === 'party-view') {
    $boxView.className = 'hidden';
    $partyView.className = 'fadein';
    $billsPC.className = '';
    $myParty.className = 'underline';
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
    move1: '',
    move2: '',
    move3: '',
    move4: '',
    ball: 'poke-ball',
    shiny: false
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
    pokeData.movesList = xhr.response.moves;
    pokeData.sprites = xhr.response.sprites;
    pokeData.name = xhr.response.species.name;
    pokeData.abilities = xhr.response.abilities;
    pokeData.types = xhr.response.types;
    pokeData.pokedexId = xhr.response.id;
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
  $sprite.alt = pokemon.name;
  $spriteBox.appendChild($sprite);
  if (pokemon.shiny) {
    $sprite.src = pokemon.sprites.front_shiny || pokemon.sprites.front_default;
  } else {
    $sprite.src = pokemon.sprites.front_default;
  }
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
  if (pokemon.nickname === '') {
    $partyCardName.textContent = titleCase(pokemon.name);
  } else {
    $partyCardName.textContent = pokemon.nickname.charAt(0).toUpperCase() + pokemon.nickname.slice(1);
  }
  $partyImg.className = 'party-img';
  $partyImg.setAttribute('data-entry-id', pokemon.entryId);
  $partyImg.alt = pokemon.name;
  $partyPicures.appendChild($partyCard);
  if (pokemon.shiny) {
    $partyImg.src = pokemon.sprites.other['official-artwork'].front_shiny;
  } else {
    $partyImg.src = pokemon.sprites.other['official-artwork'].front_default;
  }
  return $partyImg;
}

document.addEventListener('DOMContentLoaded', function (event) {
  renderAll();
  viewSwap(data.view);
});

function renderAll() {
  $spriteBox.innerHTML = '';
  $partyPicures.innerHTML = '';
  for (var i = 0; i < data.entries.length; i++) {
    renderPokemon(data.entries[i]);
  }
  for (var p = 0; p < data.partyEntries.length; p++) {
    renderParty(data.partyEntries[p]);
  }
}

var $editingForm = document.querySelector('#editing-form');
var $nickName = document.querySelector('#nickname');
var $nature = document.querySelector('#nature');
var $gender = document.querySelector('#gender');
var $ability = document.querySelector('#ability');
var $move1 = document.querySelector('#move1');
var $move2 = document.querySelector('#move2');
var $move3 = document.querySelector('#move3');
var $move4 = document.querySelector('#move4');

var initialShinyState = true;
function showModal(event) {
  if (event.target.className === 'sprite') {
    $modal.className = 'modal';
    for (var i = 0; i < data.entries.length; i++) {
      if (event.target.getAttribute('data-entry-id') === data.entries[i].entryId.toString()) {
        data.editing = data.entries[i];
        $glassModal.className = '';
        lastClickedBall = data.editing.ball;
        $ballButton.className = lastClickedBall;
        $ballPopover.classList.add('hidden');
        renderAbilities();
        renderMoves();
        $officialArt.alt = data.editing.name;
        $pokedexNumber.textContent = '#' + data.editing.pokedexId + ' ';
        $editingName.textContent = titleCase(data.editing.name);
        $nickName.value = data.editing.nickname;
        $nature.value = data.editing.nature;
        $gender.value = data.editing.gender;
        $ability.value = data.editing.ability;
        $move1.value = data.editing.move1;
        $move2.value = data.editing.move2;
        $move3.value = data.editing.move3;
        $move4.value = data.editing.move4;
        $ballButton.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/' + data.editing.ball + '.png';
        initialShinyState = data.editing.shiny;
        renderType();
        setTimeout(function () { $glassModal.className = 'hidden'; }, 850);
        if (data.editing.shiny) {
          $officialArt.src = data.editing.sprites.other['official-artwork'].front_shiny;
          $shinyButton.classList.add('yellow');
        } else {
          $officialArt.src = data.editing.sprites.other['official-artwork'].front_default;
          $shinyButton.classList.remove('yellow');
        }
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
        $glassModal.className = '';
        lastClickedBall = data.editing.ball;
        $ballButton.className = lastClickedBall;
        $ballPopover.classList.add('hidden');
        renderAbilities();
        renderMoves();
        $officialArt.alt = data.editing.name;
        $pokedexNumber.textContent = '#' + data.editing.pokedexId + ' ';
        $editingName.textContent = titleCase(data.editing.name);
        $nickName.value = data.editing.nickname;
        $nature.value = data.editing.nature;
        $gender.value = data.editing.gender;
        $ability.value = data.editing.ability;
        $move1.value = data.editing.move1;
        $move2.value = data.editing.move2;
        $move3.value = data.editing.move3;
        $move4.value = data.editing.move4;
        $ballButton.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/' + data.editing.ball + '.png';
        initialShinyState = data.editing.shiny;
        renderType();
        setTimeout(function () { $glassModal.className = 'hidden'; }, 850);
        if (data.editing.shiny) {
          $officialArt.src = data.editing.sprites.other['official-artwork'].front_shiny;
          $shinyButton.classList.add('yellow');
        } else {
          $officialArt.src = data.editing.sprites.other['official-artwork'].front_default;
          $shinyButton.classList.remove('yellow');
        }
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
  $glassModal.className = '';
  data.editing.nickname = $nickName.value;
  data.editing.nature = $nature.value;
  data.editing.gender = $gender.value;
  data.editing.ability = $ability.value;
  data.editing.move1 = $move1.value;
  data.editing.move2 = $move2.value;
  data.editing.move3 = $move3.value;
  data.editing.move4 = $move4.value;
  data.editing.ball = lastClickedBall;
  $modal.classList.add('fadeout');
  setTimeout(function () { $modal.className = 'modal hidden'; $glassModal.className = 'hidden'; }, 750);
  renderAll();
});

$xButton.addEventListener('click', function (event) {
  $glassModal.className = '';
  $modal.classList.add('fadeout');
  setTimeout(function () { $modal.className = 'modal hidden'; $glassModal.className = 'hidden'; }, 750);
  data.editing.shiny = initialShinyState;
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
      $deleteModal.classList.add('fadeout');
      setTimeout(function () { $deleteModal.className = 'modal hidden'; }, 750);
      $modal.classList.add('fadeout');
      setTimeout(function () { $modal.className = 'modal hidden'; }, 750);
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
      $deleteModal.classList.add('fadeout');
      setTimeout(function () { $deleteModal.className = 'modal hidden'; }, 750);
      $modal.classList.add('fadeout');
      setTimeout(function () { $modal.className = 'modal hidden'; }, 750);
      return;
    }
  }
}
$withdrawButton.addEventListener('click', function (event) {
  data.editing.shiny = initialShinyState;
  if (data.partyEntries.length === 6) {
    showToast('<i class="fa-solid fa-circle-exclamation fa-lg"></i>' + ' ' + 'Your party is full!');
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
  data.editing.shiny = initialShinyState;
  for (var r = 0; r < data.partyEntries.length; r++) {
    if (data.editing.entryId === data.partyEntries[r].entryId) {
      data.partyEntries.splice(r, 1);
      var $removeImg = document.querySelector('[data-entry-id="' + data.editing.entryId.toString() + '"]');
      $removeImg.closest('.party-card').remove();
      $modal.classList.add('fadeout');
      setTimeout(function () { $modal.className = 'modal hidden'; }, 750);
      data.entries.push(data.editing);
      renderPokemon(data.editing);
      if (data.partyEntries.length === 0) {
        viewSwap('box-view');
      }
      return;
    }
  }
});
var lastClickedBall = 'poke-ball';
var $shinyButton = document.querySelector('.fa-star');
var $ballButton = document.querySelector('#ball');
var $ballPopover = document.querySelector('#ball-popover');
var $cancelBall = document.querySelector('#cancel-ball');
$shinyButton.addEventListener('click', function (event) {
  if (data.editing.shiny) {
    data.editing.shiny = false;
    $officialArt.src = data.editing.sprites.other['official-artwork'].front_default;
    $shinyButton.classList.remove('yellow');
  } else {
    data.editing.shiny = true;
    $officialArt.src = data.editing.sprites.other['official-artwork'].front_shiny;
    $shinyButton.classList.add('yellow');
  }
});
$ballButton.addEventListener('click', function (event) {
  $cancelBall.src = event.target.src;
  $cancelBall.className = event.target.className;
  $ballPopover.classList.remove('hidden');
});
$ballPopover.addEventListener('click', function (event) {
  if (event.target.tagName === 'IMG') {
    $ballButton.src = event.target.src;
    $ballButton.className = event.target.className;
    lastClickedBall = event.target.className;
    $ballPopover.classList.add('fadeout');
    setTimeout(function () { $ballPopover.className = 'hidden'; }, 750);
  }
});

var $toastBox = document.querySelector('#toast-box');
function showToast(message) {
  var $toast = document.createElement('div');
  $toast.classList.add('toast');
  $toast.innerHTML = message;
  $toastBox.appendChild($toast);
  setTimeout(function () {
    $toast.remove();
  }, 1250);
}

var $typesContainer = document.querySelector('#types-container');
function renderType() {
  $typesContainer.innerHTML = '';
  for (var t = 0; t < data.editing.types.length; t++) {
    var $type = document.createElement('span');
    $type.classList.add('type');
    $type.classList.add(data.editing.types[t].type.name);
    $type.textContent = data.editing.types[t].type.name.charAt(0).toUpperCase() + data.editing.types[t].type.name.slice(1);
    $typesContainer.appendChild($type);
  }
  $modalContainer.className = 'modal-container';
  $modalContainer.classList.add(data.editing.types[0].type.name + '1');
}

function renderAbilities() {
  $ability.innerHTML = '';
  for (var a = 0; a < data.editing.abilities.length; a++) {
    var $abilityOption = document.createElement('option');
    $abilityOption.value = data.editing.abilities[a].ability.name;
    $abilityOption.textContent = titleCase(data.editing.abilities[a].ability.name);
    $ability.appendChild($abilityOption);
  }
}

var move1 = '';
var move2 = '';
var move3 = '';
var move4 = '';

function moveCheck(value) {
  return value === move1 || value === move2 || value === move3 || value === move4;
}

function movesData() {
  return [
    { el: $move1, arg: 1, setMoveName: newName => { move1 = newName; }, currentMove: data.editing.move1 },
    { el: $move2, arg: 2, setMoveName: newName => { move2 = newName; }, currentMove: data.editing.move2 },
    { el: $move3, arg: 3, setMoveName: newName => { move3 = newName; }, currentMove: data.editing.move3 },
    { el: $move4, arg: 4, setMoveName: newName => { move4 = newName; }, currentMove: data.editing.move4 }
  ];
}

function renderMoves() {
  movesData().forEach(move => {
    move.el.innerHTML = '';
    move.setMoveName(move.currentMove);
  });
  for (var m = 0; m < data.editing.movesList.length; m++) {
    var moveName = data.editing.movesList[m].move.name;
    for (var i = 0; i < 4; i++) {
      var $moveOption = document.createElement('option');
      $moveOption.value = moveName;
      $moveOption.className = moveCheck(moveName) ? 'moveslist hidden' : 'moveslist';
      $moveOption.textContent = titleCase(moveName);
      switch (i) {
        case 0: $move1.appendChild($moveOption); break;
        case 1: $move2.appendChild($moveOption); break;
        case 2: $move3.appendChild($moveOption); break;
        case 3: $move4.appendChild($moveOption); break;
        default: $move1.appendChild($moveOption);
      }
    }
  }
}

movesData().forEach(move => {
  move.el.addEventListener('change', event => {
    move.setMoveName(event.target.value);
    updateMoveList(move.arg);
  });
});

function updateMoveList(moveSlot) {
  var $showMove = document.querySelectorAll('.moveslist');
  for (var z = 0; z < $showMove.length; z++) {
    if (moveCheck($showMove.item(z).value)) {
      $showMove.item(z).className = ('moveslist hidden');
    } else {
      $showMove.item(z).classList.remove('hidden');
    }
  }
  for (let i = 1; i < 5; i++) {
    if (moveSlot !== i) {
      var $removeMove = document.querySelector('#move' + i.toString() + ' > [value="' + event.target.value + '"]');
      $removeMove.classList.add('hidden');
    }
  }
}

function titleCase(string) {
  var hyphenSplit = string.split('-');
  var splitArray = [];
  for (var h = 0; h < hyphenSplit.length; h++) {
    splitArray.push(hyphenSplit[h].charAt(0).toUpperCase() + hyphenSplit[h].slice(1));
  }
  var finished = splitArray.join(' ');
  return finished;
}

/* exported data */
var data = {
  view: 'box-view',
  entries: [],
  partyEntries: [],
  editing: null,
  nextEntryId: 1
};

var localStorageKey = 'poke-ajax-local-storage';

window.addEventListener('beforeunload', function () {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
});

window.addEventListener('pagehide', function () {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
});

var storedDataJSON = localStorage.getItem(localStorageKey);
if (storedDataJSON !== null) {
  data = JSON.parse(storedDataJSON);
}

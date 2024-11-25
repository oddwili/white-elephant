const WhiteElephant = (function () {
  'use strict';

  const localStorageKey = 'namedraw';
  let undrawnNames = [];
  let drawnNames = [];
  let expires = null;
  const undrawnNamesListElement = document.getElementById('names-list');
  const drawnNamesListElement = document.getElementById('drawn-names-list');
  
  function setupGame() {
    const game = localStorage.getItem(localStorageKey);

    if (!game) {
      updateLocalStorage();
    } else if (new Date().getTime() > game.expires) {
      clearCurrentGame();
    } else {
      const currentGame = JSON.parse(game);
      undrawnNames = currentGame.undrawnNames;
      drawnNames = currentGame.drawnNames;
      expires = currentGame.expires;
    }

    document.getElementById('add-name-button').addEventListener('click', WhiteElephant.addName);
    document.getElementById('draw-button').addEventListener('click', WhiteElephant.drawName);
    document.getElementById('clear-button').addEventListener('click', WhiteElephant.clearCurrentGame);
  }
  
  function updateLocalStorage() {
    const now = new Date();
    const updatedGame = {
      undrawnNames,
      drawnNames,
      expires: new Date(now.getTime() + 43200000),
    }
    localStorage.setItem(localStorageKey, JSON.stringify(updatedGame))
  }
  
  function updateUndrawnNamesList() {
    if (!undrawnNamesListElement) {
      console.error('cannot find names-list in DOM')
      return;
    }
    undrawnNamesListElement.innerHTML = '';
  
    undrawnNames.forEach((name, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${name}`;
      undrawnNamesListElement.appendChild(li);
    });
  
    updateLocalStorage();
  }
  
  function updateDrawnNamesList() {
    if (!drawnNamesListElement) {
      console.error('cannot find names-list in DOM')
      return;
    }
    drawnNamesListElement.innerHTML = '';
  
    drawnNames.forEach((name, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${name}`;
      drawnNamesListElement.appendChild(li);
    });
  }
  
  function drawName() {
    if (undrawnNames.length === 0) {
      alert("No undrawn names available!");
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * undrawnNames.length);
    const drawnName = undrawnNames[randomIndex];
  
    undrawnNames.splice(randomIndex, 1);
    drawnNames.push(drawnName);
  
    updateUndrawnNamesList();
    updateDrawnNamesList();
  
    const resultElement = document.getElementById('result');
    resultElement.textContent = `🎉 The winner is: ${drawnName}`;
  }
  
  function addName() {
    const nameInput = document.getElementById('add-name-input');
    const name = nameInput.value.trim();
  
    if (name === '') {
      alert("Please enter a valid name.");
      return;
    }
  
    undrawnNames.push(name);
    nameInput.value = '';
    updateUndrawnNamesList();
  }

  function clearCurrentGame() {
    localStorage.removeItem(localStorageKey);
    undrawnNames = [];
    drawnNames = [];
    expires = null;
    undrawnNamesListElement.innerHTML = '';
    updateLocalStorage(); // TODO: BUG - never creates a new game
  }

  return {
    addName: addName,
    drawName: drawName,
    setupGame: setupGame,
    clearCurrentGame,
  }
})();

window.onload = () => {
  try {
    WhiteElephant.setupGame();
  } catch (error) {
    console.error(error);
  }
}
window.onload = () => {
  try {
    const currentGame = localStorage.getItem('namedraw');
    if (!currentGame) {
      localStorage.setItem('namedraw', '[undrawn][drawn]');
    } else {
      setupGame();
    }
  } catch (error) {
    console.error(error);
  }
}
let undrawnNames = [];
let drawnNames = [];

function setupGame() {
  const names = localStorage.getItem('namedraw');
  const regex = /\[(undrawn|drawn)\]/g;
  const twoArrays = names.split(regex);
  
  undrawnNames = twoArrays[2].split(',');
  drawnNames = twoArrays[4].split(',');

  updateDrawnNamesList();
  updateNamesList();
}

function updateLocalStorage() {
  localStorage.setItem('namedraw', `[undrawn]${undrawnNames.toString()}[drawn]${drawnNames.toString()}`)
}


function updateNamesList() {
  const undrawnNamesListElement = document.getElementById('names-list');
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
  const drawnNamesListElement = document.getElementById('drawn-names-list');
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

  updateNamesList();
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
  updateNamesList();
}

document.getElementById('add-name-button').addEventListener('click', addName);
document.getElementById('draw-button').addEventListener('click', drawName);

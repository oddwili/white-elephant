// Initialize two arrays for undrawn and drawn names
let undrawnNames = [];
let drawnNames = [];

// Function to update the names list (undrawn names)
function updateNamesList() {
  const undrawnNamesListElement = document.getElementById('names-list');
  undrawnNamesListElement.innerHTML = ''; // Clear the list

  // Add each undrawn name as a list item
  undrawnNames.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${name}`;
    undrawnNamesListElement.appendChild(li);
  });
}

// Function to update the drawn names list
function updateDrawnNamesList() {
  const drawnNamesListElement = document.getElementById('drawn-names-list');
  drawnNamesListElement.innerHTML = ''; // Clear the list

  // Add each drawn name as a list item
  drawnNames.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${name}`;
    drawnNamesListElement.appendChild(li);
  });
}

// Function to draw a name randomly from the undrawn names
function drawName() {
  if (undrawnNames.length === 0) {
    alert("No undrawn names available!");
    return;
  }
  
  // Get a random index
  const randomIndex = Math.floor(Math.random() * undrawnNames.length);
  const drawnName = undrawnNames[randomIndex];

  // Move the name from undrawn to drawn
  undrawnNames.splice(randomIndex, 1); // Remove the name from the undrawn array
  drawnNames.push(drawnName); // Add the name to the drawn array

  // Update the lists in the UI
  updateNamesList();
  updateDrawnNamesList();

  // Display the drawn name
  const resultElement = document.getElementById('result');
  resultElement.textContent = `🎉 The winner is: ${drawnName}`;
}

// Function to add a name to the undrawn names list
function addName() {
  const nameInput = document.getElementById('add-name-input');
  const name = nameInput.value.trim();

  if (name === '') {
    alert("Please enter a valid name.");
    return;
  }

  undrawnNames.push(name); // Add the name to the undrawn names array
  nameInput.value = ''; // Clear the input field
  updateNamesList(); // Update the undrawn names list UI
}

// Event listeners for buttons
document.getElementById('add-name-button').addEventListener('click', addName);
document.getElementById('draw-button').addEventListener('click', drawName);

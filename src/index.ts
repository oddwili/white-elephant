const WhiteElephant = (function () {
  "use strict";

  const localStorageKey = "namedraw";
  let undrawnNames: string[] = [];
  let drawnNames: string[] = [];
  let expires: Date | null = null;
  let undrawnNamesListElement;
  let drawnNamesListElement;

  function setupGame() {
    const game = localStorage.getItem(localStorageKey);

    if (!game) {
      updateLocalStorage();
    } else if (new Date().getTime() > JSON.parse(game).expires) {
      clearCurrentGame();
    } else {
      const currentGame = JSON.parse(game);
      undrawnNames = currentGame.undrawnNames;
      drawnNames = currentGame.drawnNames;
      expires = currentGame.expires;
    }

    document
      .getElementById("add-name-button")
      .addEventListener("click", addName);
    document.getElementById("draw-button").addEventListener("click", drawName);
    document
      .getElementById("clear-button")
      .addEventListener("click", clearCurrentGame);

    undrawnNamesListElement = document.getElementById("undrawn-names-list");
    drawnNamesListElement = document.getElementById("drawn-names-list");

    updateUndrawnNamesList();
    updateDrawnNamesList();
  }

  function updateLocalStorage() {
    const now = new Date();
    const updatedGame = {
      undrawnNames,
      drawnNames,
      expires: new Date(now.getTime() + 43200000),
    };
    localStorage.setItem(localStorageKey, JSON.stringify(updatedGame));
  }

  function updateUndrawnNamesList() {
    if (!undrawnNamesListElement) {
      console.error("cannot find names-list in DOM");
      return;
    }
    undrawnNamesListElement.innerHTML = "";
    generateNameListItem(undrawnNames, undrawnNamesListElement);
    updateLocalStorage();
  }

  function updateDrawnNamesList() {
    if (!drawnNamesListElement) {
      console.error("cannot find names-list in DOM");
      return;
    }
    drawnNamesListElement.innerHTML = "";
    generateNameListItem(drawnNames, drawnNamesListElement);
    updateLocalStorage();
  }

  function generateNameListItem(names, listElement) {
    names.forEach((name, index) => {
      const li = document.createElement("li");
      li.classList.add("name-list-item");
      const text = document.createElement("p");
      text.textContent = name;

      const editButton = document.createElement("button");
      editButton.addEventListener("click", editName);
      editButton.classList.add("edit-button");
      const editSVG = document.createElement("object");
      editSVG.setAttribute("type", "image/svg+xml");
      editSVG.setAttribute("data", "./assets/erase.svg");
      editSVG.classList.add("edit-svg");
      editButton.appendChild(editSVG);

      const deleteButton = document.createElement("button");
      deleteButton.addEventListener("click", deleteName);
      deleteButton.classList.add("delete-button");
      const deleteSVG = document.createElement("object");
      deleteSVG.setAttribute("type", "image/svg+xml");
      deleteSVG.setAttribute("data", "./assets/trash.svg");
      deleteSVG.classList.add("delete-svg");
      deleteButton.appendChild(deleteSVG);

      li.appendChild(editButton);
      li.appendChild(text);
      li.appendChild(deleteButton);
      listElement.appendChild(li);
    });
  }

  function editName(event: MouseEvent) {
    const editButton = event.target as HTMLButtonElement;
    const itemNode = editButton.parentNode;
    const listNode = itemNode.parentElement;
    const isUndrawnList = listNode.id.includes("undrawn");
    const foundNameEl = Object.values(itemNode.children).find(
      (child) => child.tagName === "P",
    );
    const foundName = foundNameEl.textContent;

    let namesArray = isUndrawnList ? undrawnNames : drawnNames;
    const editInputElement = document.createElement("input");
    editInputElement.setAttribute("type", "text");
    editInputElement.setAttribute("value", foundName);
    itemNode.appendChild(editInputElement);
    const editSaveButton = document.createElement("button");
    editSaveButton.textContent = "Save Edit";
    const cancelEditButton = document.createElement("button");
    cancelEditButton.classList.add("secondary");
    cancelEditButton.textContent = "Cancel Edit";

    function saveAndCloseEdits() {
      const newNameValue = editInputElement.value.trim();

      if (newNameValue === "") {
        console.error("New name value is empty");
        return;
      }
      const nameToUpdateIndex = namesArray.findIndex(
        (name) => name === foundName,
      );
      namesArray.splice(nameToUpdateIndex, 1, newNameValue);
      closeEditing();

      if (isUndrawnList) {
        updateUndrawnNamesList();
      } else {
        updateDrawnNamesList();
      }
    }

    function closeEditing() {
      itemNode.removeChild(editInputElement);
      itemNode.removeChild(editSaveButton);
      itemNode.removeChild(cancelEditButton);
    }

    editSaveButton.addEventListener("click", saveAndCloseEdits);
    cancelEditButton.addEventListener("click", closeEditing);
    itemNode.appendChild(editSaveButton);
    itemNode.appendChild(cancelEditButton);
  }

  function deleteName(event: MouseEvent) {
    const deleteButton = event.target as HTMLButtonElement;
    const itemNode = deleteButton.parentNode;
    const listNode = itemNode.parentElement;
    const isUndrawnList = listNode.id.includes("undrawn");
    const foundNameEl = Object.values(itemNode.children).find(
      (child) => child.tagName === "P",
    );
    const foundName = foundNameEl.textContent;

    let namesArray = isUndrawnList ? undrawnNames : drawnNames;
    const nameToDeleteIndex = namesArray.findIndex(
      (name) => name === foundName,
    );
    namesArray.splice(nameToDeleteIndex, 1);

    if (isUndrawnList) {
      updateUndrawnNamesList();
    } else {
      updateDrawnNamesList();
    }
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

    const resultElement = document.getElementById("result");
    resultElement.textContent = `${drawnName}`;
  }

  function addName() {
    const nameInput = document.getElementById(
      "add-name-input",
    ) as HTMLInputElement;
    const name = nameInput.value.trim();

    if (name === "") {
      alert("Please enter a valid name.");
      return;
    }

    undrawnNames.push(name);
    nameInput.value = "";
    updateUndrawnNamesList();
  }

  function clearCurrentGame() {
    localStorage.removeItem(localStorageKey);
    undrawnNames = [];
    drawnNames = [];
    expires = null;
    undrawnNamesListElement.innerHTML = "";
    drawnNamesListElement.innerHTML = "";
    updateLocalStorage();
  }

  return {
    setupGame,
  };
})();

window.onload = () => {
  try {
    WhiteElephant.setupGame();
  } catch (error) {
    console.error(error);
  }
};

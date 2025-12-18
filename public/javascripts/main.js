let entries = [];

// DOM elements
const form = document.getElementById('entry-form');
const entriesContainer = document.getElementById('entries');
const filterButtons = document.querySelectorAll('.filters button');
const introOverlay = document.getElementById('intro-overlay');
const enterButton = document.getElementById('enter-site');


enterButton.addEventListener('click', () => {
  introOverlay.classList.add('fade-out');

  setTimeout(() => {
    introOverlay.style.display = 'none';
  }, 500);
});


function updateList() {
    
  entriesContainer.innerHTML = '';

  for (let i = 0; i < entries.length; i++) {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');
    entryDiv.style.color = entries[i].stringColor || 'red';

    // string line
    const stringDiv = document.createElement('div');
    stringDiv.classList.add('string');

    // message text
    const textP = document.createElement('p');
    textP.innerText = entries[i].text;

    entryDiv.appendChild(stringDiv);
    entryDiv.appendChild(textP);

    // optional song
    if (entries[i].song) {
      const songSpan = document.createElement('span');
      songSpan.classList.add('song');
      songSpan.innerText = ' ' + entries[i].song;
      entryDiv.appendChild(songSpan);
    }

    entriesContainer.appendChild(entryDiv);

    
  }
}

// filter to get all entries 
async function getEntries(tag = '') {
  let url = '/entries';
  if (tag) {
    url += `?tag=${tag}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  console.log('entries:', data);

  entries = data;
  updateList();
}

// initial load
getEntries();

// submission form function
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const entryData = Object.fromEntries(formData.entries());

  if (!entryData.text.trim()) return;

  addEntry(entryData);

  form.reset();
});

// adding a new entry
async function addEntry(entryData) {
  const response = await fetch('/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entryData)
  });

  const data = await response.json();
  console.log('added entry:', data);

  getEntries();
}

// filter entries by their tag
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tag = button.dataset.tag;
    getEntries(tag);
  });
});




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

function getSpotifyEmbedUrl(url) {
    if (!url) return null;
  
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    if (!match) return null;
  
    return `https://open.spotify.com/embed/track/${match[1]}`;
  }

function updateList() {
    
  entriesContainer.innerHTML = '';

  for (let i = 0; i < entries.length; i++) {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');
    entryDiv.style.color = entries[i].stringColor || 'red';
    
    if (entries[i].song) {
        entryDiv.classList.add('has-song');
      }

 // delete button
 const deleteButton = document.createElement('button');
 deleteButton.classList.add('delete-btn');
 deleteButton.innerText = '×';
 deleteButton.addEventListener('click', (e) => {
   e.stopPropagation();
   deleteEntry(entries[i]._id);

 });

    // string line
    const stringDiv = document.createElement('div');
    stringDiv.classList.add('string');

    // message text
    const textP = document.createElement('p');
    textP.innerText = entries[i].text;

    entryDiv.appendChild(deleteButton);
    entryDiv.appendChild(stringDiv);
    entryDiv.appendChild(textP);


  

    //spofity link (chatGPT helped me!)
    if (entries[i].song) {
        const embedUrl = getSpotifyEmbedUrl(entries[i].song);
  
        if (embedUrl) {
          const iframe = document.createElement('iframe');
          iframe.src = embedUrl;
          iframe.width = '100%';
          iframe.height = '80';
          iframe.frameBorder = '0';
          iframe.allow =
            'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  
            const songWrap = document.createElement('div');
            songWrap.classList.add('song-embed');
            
            songWrap.appendChild(iframe);
            entryDiv.appendChild(songWrap);
            
        }
      }
  
      entriesContainer.appendChild(entryDiv);
    }
  }
  

// filter to get all entries 
async function getEntries(tag = '') {
  let url = '/api/entries';
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
  const response = await fetch('/api/entries', {
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
// deleting an entry
async function deleteEntry(id) {
  const response = await fetch(`/api/entries/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    console.error('Failed to delete entry');
    return;
  }

  getEntries();
}

  
// filter entries by their tag
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tag = button.dataset.tag;
    getEntries(tag);
  });
});


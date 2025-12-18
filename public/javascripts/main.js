let entries = [];
let newestEntryId = null;


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

//  this controls the string colors
const colorMap = {
  red: '#8E3B46',
  gold: '#c89b5c',
  gray: '#7a6a73'
};

//spotify option to enter link function
function getSpotifyEmbedUrl(url) {
  if (!url) return null;

  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  if (!match) return null;

  return `https://open.spotify.com/embed/track/${match[1]}`;
}

// updating the entries
function updateList() {

  entriesContainer.innerHTML = '';

  for (let i = 0; i < entries.length; i++) {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');
    const stringColor = colorMap[entries[i].stringColor] || colorMap.red;
    entryDiv.style.color = stringColor;

    
    if (entries[i].song) {
      entryDiv.classList.add('has-song');
    }
    if (entries[i]._id === newestEntryId) {
      entryDiv.classList.add('new-entry');
    }


    // delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerText = '×';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteEntry(entries[i]._id);

    });
// svg for the string movement (used chat for help!)
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("yarn");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "60");
    svg.setAttribute("viewBox", "0 0 20 60");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M10 0 C 8 15, 12 30, 10 60");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");

    path.style.filter = "url(#yarnNoise)";

    svg.appendChild(path);
    entryDiv.appendChild(svg);

//animation for the yarn/string wiggle (perlin noise)
    let t = Math.random() * 10;

    function wiggleYarn() {
      t += 0.02;

      const x1 = 8 + Math.sin(t) * 2;
      const x2 = 12 + Math.cos(t * 0.9) * 2;

      path.setAttribute(
        "d",
        `M10 0 C ${x1} 18, ${x2} 36, 10 60`
      );

      requestAnimationFrame(wiggleYarn);
    }

    wiggleYarn();


    // message text
    const textP = document.createElement('p');
    textP.innerText = entries[i].text;
    textP.style.color = '#853c1c';


    entryDiv.appendChild(deleteButton);
    entryDiv.appendChild(textP);


    //spofity song to appear (chatGPT helped me!)
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
  // mark this as newest
  newestEntryId = data._id;

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


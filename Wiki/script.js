// DO NOT DELETE OR EDIT
// Fetch and display wikis from a static JSON file hosted on GitHub
function fetchWikis() {
    const wikiList = document.getElementById('wiki-list');
    wikiList.innerHTML = '';

    fetch('https://raw.githubusercontent.com/scratch-coding-hut/Scratch-Coding-Hut.github.io/main/wikis.json')
        .then(response => response.json())
        .then(wikis => {
            wikis.forEach((wiki, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${wiki.title}</strong>
                    <button onclick="viewWiki(${index})">📝 View</button>
                `;
                wikiList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading wikis:', error);
            wikiList.innerHTML = 'Error loading wikis.';
        });
}

// View a specific wiki’s content
function viewWiki(index) {
    fetch('https://raw.githubusercontent.com/scratch-coding-hut/Scratch-Coding-Hut.github.io/main/wikis.json')
        .then(response => response.json())
        .then(wikis => {
            const wiki = wikis[index];
            const viewer = document.getElementById('wiki-viewer');
            viewer.innerHTML = `
                <h2>${wiki.title}</h2>
                <div>${wiki.content}</div>
            `;
        });
}

// Call fetchWikis when the page loads
window.onload = fetchWikis;

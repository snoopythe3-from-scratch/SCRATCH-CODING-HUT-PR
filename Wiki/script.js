// DO NOT DELETE OR EDIT
/* Frontend JS (script.js) */
const API_URL = 'https://your-railway-app-name.up.railway.app/api/wikis';

async function fetchWikis() {
    const res = await fetch(API_URL);
    const wikis = await res.json();
    const wikiList = document.getElementById('wiki-list');
    wikiList.innerHTML = '';

    wikis.forEach(wiki => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <h3>${wiki.title}</h3>
                <div>${wiki.content}</div>
            </div>
            <button onclick="editWiki('${wiki.title}', '${wiki.content}')">Edit</button>
            <button onclick="deleteWiki('${wiki.title}')">Delete</button>
        `;
        wikiList.appendChild(li);
    });
}

async function addOrEditWiki() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const res = await fetch(`${API_URL}/${title}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    if (res.ok) fetchWikis();
}

async function editWiki(title, content) {
    document.getElementById('title').value = title;
    document.getElementById('content').value = content;
}

async function deleteWiki(title) {
    const res = await fetch(`${API_URL}/${title}`, { method: 'DELETE' });
    if (res.ok) fetchWikis();
}

fetchWikis();

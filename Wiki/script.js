// DO NOT DELETE OR EDIT
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_fh1xWlHdVJVjhHr-ZUy2sKWy9jilUHM",
  authDomain: "wiki-storage-51c29.firebaseapp.com",
  projectId: "wiki-storage-51c29",
  storageBucket: "wiki-storage-51c29.firebasestorage.app",
  messagingSenderId: "607647989206",
  appId: "1:607647989206:web:e838a6fe33fe5fc47b3877",
  measurementId: "G-MS4Y95QN1M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch and display all wikis
async function fetchWikis() {
  const wikiList = document.getElementById('wiki-list');
  wikiList.innerHTML = '';

  const snapshot = await db.collection('wikis').get();
  snapshot.forEach(doc => {
    const wiki = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${wiki.title}</strong>
      <button onclick="viewWiki('${doc.id}')">📝 View</button>
      <button onclick="editWiki('${doc.id}', '${wiki.title}')">
        <img src="images.png" width="20" alt="Edit">
      </button>
      <button onclick="deleteWiki('${doc.id}')">
        <img src="delete-page.png" width="20" alt="Delete">
      </button>
    `;
    wikiList.appendChild(li);
  });
}

// Create a new wiki
async function createWiki() {
  const title = prompt('Enter wiki title:');
  const content = prompt('Enter HTML/CSS/JS content for this wiki:');

  if (title && content) {
    await db.collection('wikis').add({ title, content });
    fetchWikis();
  }
}

// Edit an existing wiki
async function editWiki(id, title) {
  const content = prompt('Edit HTML/CSS/JS content:', '');

  if (content) {
    await db.collection('wikis').doc(id).update({ title, content });
    fetchWikis();
  }
}

// Delete a wiki
async function deleteWiki(id) {
  if (confirm('Are you sure you want to delete this wiki?')) {
    await db.collection('wikis').doc(id).delete();
    fetchWikis();
  }
}

// View a wiki’s content
async function viewWiki(id) {
  const doc = await db.collection('wikis').doc(id).get();
  const wiki = doc.data();

  const viewer = document.getElementById('wiki-viewer');
  viewer.innerHTML = `
    <h2>${wiki.title}</h2>
    <div>${wiki.content}</div>
  `;

  // Execute any inline scripts in the content
  const scriptTags = viewer.querySelectorAll('script');
  scriptTags.forEach(script => {
    const newScript = document.createElement('script');
    newScript.textContent = script.textContent;
    document.body.appendChild(newScript);
    script.remove();
  });
}

// Initial fetch
fetchWikis();

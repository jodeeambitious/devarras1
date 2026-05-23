window.onload = function() {
    const savedTheme = localStorage.getItem('userTheme') || 'cyan';
    setTheme(savedTheme);
    displayLinks();
    
    updateClock();
    setInterval(updateClock, 1000);

    // Event listener for the Extension Grab Tab feature
    document.getElementById('grabTabBtn').addEventListener('click', grabCurrentTab);
};

function updateClock() {
    const now = new Date();
    document.getElementById('cyberClock').textContent = now.toLocaleTimeString();
}

// Magic Feature: Pulls the active web address directly from your browser tab
function grabCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs || !tabs[0]) return;
        
        const activeTab = tabs[0];
        let title = activeTab.title || "Saved Link";
        let url = activeTab.url;

        // Clean up messy window titles if they are too long
        if (title.length > 25) {
            title = title.substring(0, 22) + "...";
        }

        saveLinkToMemory(title, url);
    });
}

function addManualLink() {
    const nameInput = document.getElementById('siteName');
    const urlInput = document.getElementById('siteUrl');
    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (!name || !url) {
        alert("Fill out the manual fields or use 'Grab Current Tab', bro!");
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    saveLinkToMemory(name, url);
    nameInput.value = '';
    urlInput.value = '';
}

function saveLinkToMemory(name, url) {
    const links = JSON.parse(localStorage.getItem('myLinks')) || [];
    links.push({ name: name, url: url });
    localStorage.setItem('myLinks', JSON.stringify(links));
    displayLinks();
}

function displayLinks(filterText = '') {
    const container = document.getElementById('linkContainer');
    container.innerHTML = '';
    const links = JSON.parse(localStorage.getItem('myLinks')) || [];
    document.getElementById('linkCounter').textContent = `Total Saved: ${links.length} links`;

    links.forEach((item, index) => {
        if (filterText && !item.name.toLowerCase().includes(filterText.toLowerCase())) {
            return;
        }
        const card = document.createElement('div');
        card.className = 'link-card';
        card.innerHTML = `
            <a href="${item.url}" target="_blank" title="${item.url}">${item.name}</a>
            <button class="delete-btn" id="del-${index}">✕</button>
        `;
        container.appendChild(card);
        
        document.getElementById(`del-${index}`).addEventListener('click', () => deleteLink(index));
    });
}

function deleteLink(index) {
    const links = JSON.parse(localStorage.getItem('myLinks')) || [];
    links.splice(index, 1);
    localStorage.setItem('myLinks', JSON.stringify(links));
    displayLinks(document.getElementById('searchBox').value);
}

window.filterLinks = function() {
    const searchVal = document.getElementById('searchBox').value;
    displayLinks(searchVal);
}

window.setTheme = function(theme) {
    const root = document.documentElement;
    localStorage.setItem('userTheme', theme);
    if (theme === 'cyan') {
        root.style.setProperty('--accent', '#00ffcc');
        root.style.setProperty('--accent-glow', 'rgba(0, 255, 204, 0.3)');
    } else if (theme === 'red') {
        root.style.setProperty('--accent', '#ff0055');
        root.style.setProperty('--accent-glow', 'rgba(255, 0, 85, 0.3)');
    } else if (theme === 'green') {
        root.style.setProperty('--accent', '#39ff14');
        root.style.setProperty('--accent-glow', 'rgba(57, 255, 20, 0.3)');
    }
}

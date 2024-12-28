// Time and date update function
function updateTime() {
	const timeElement = document.getElementById('time');
	const dateElement = document.getElementById('date');
	const now = new Date();

	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	timeElement.textContent = `${hours}:${minutes}:${seconds}`;

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}

// Initialize clock
setInterval(updateTime, 500);
updateTime();

// Search functionality
document.getElementById('search-btn').addEventListener('click', (e) => {
	e.preventDefault();
	const query = document.getElementById('search-input').value;
	window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
});

//triggers pop-up when add button is clicked
document.getElementById("add-link").addEventListener("click",(e)=>{
	e.preventDefault()
	if (document.getElementById("overlay").style.display === "flex") {
		document.getElementById("overlay").style.display = "none"
	} else {
		document.getElementById("overlay").style.display = "flex"
	}
})

//Pop-up submit button
document.getElementById("submit-link").addEventListener("click",async (e)=>{
	e.preventDefault()
	document.getElementById("overlay").style.display = "none"
	const name = String(document.getElementById("link-name").value).trim()
	const url = String(document.getElementById("link-url").value).trim()
	console.log(name,url)
	 if(!name||!url) {
		return null
	}
	//let icon = url + "/favicon.ico"
	const oldLinks = JSON.parse(localStorage.getItem('quickLinks'))
	console.log(oldLinks)
	if (oldLinks) {
		oldLinks.push({name:name,url:url})
		console.log(oldLinks);
		localStorage.setItem( "quickLinks",JSON.stringify(oldLinks))
	} else {
		const quickLinks = [{name:name,url:url}]
		console.log(quickLinks);
		localStorage.setItem( "quickLinks",JSON.stringify(quickLinks)) 
	}

	// Refresh Quick links
	loadQuickLinks();
})
// Load quick links from local storage
function loadQuickLinks() {
	const linksContainer = document.getElementById('links-container');
	linksContainer.innerHTML=''
	const result = localStorage.getItem('quickLinks');
		const quickLinks = JSON.parse(result) || [];
		console.log(result,quickLinks);
		quickLinks.map((link) => {
			if(link){
				const linkBox = document.createElement('div');
				linkBox.classList.add('link-box');
				linkBox.innerHTML = `<a class="link-icon" href="${link.url}" target="_blank"><img class="link-img" src="${link.url}/favicon" alt="${link.name}"></a><p class="link-text">${link.name}</p>`;
				linksContainer.appendChild(linkBox);
			}
		});
}


// Load quick links on load
loadQuickLinks();

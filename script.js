// Time and date update function
function updateTime() {
	const timeElement = document.getElementById('time');
	const noonElement = document.getElementById('noon');
	const dateElement = document.getElementById('date');
	const now = new Date();
	let hrs=now.getHours()
	let pm = false
	if (hrs>12){
		hrs = hrs-12;
		pm = true
	}
	const hours = String(hrs).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	timeElement.textContent = `${hours}:${minutes}:${seconds}`;
	noonElement.textContent = ` ${pm?"PM":"AM"}`;
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}

// Initialize clock
setInterval(updateTime, 500);
updateTime();

// Load quick links on load
loadQuickLinks();

// Search functionality
document.getElementById('search-btn').addEventListener('click', (e) => {
	e.preventDefault();
	let query = document.getElementById('search-input').value;
	window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
});

//
document.getElementById('search-input').addEventListener('keypress', (e) => {
	e.preventDefault();
	let query = document.getElementById('search-input');
	if (e.key === 'Enter') {
		window.open(`https://www.google.com/search?q=${encodeURIComponent(query.value)}`);
	} else {
		query.value = query.value + e.key;
	}
})

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
			linkBox.innerHTML = `<a class="link-icon" href="${link.url}" target="_blank">
				<img class="link-img" src="${link.url}/favicon" alt="${link.name}">
				</a><p class="link-text">${link.name}</p>
				<button class="menu-btn" id="menu-btn"><svg width="12" height="12" viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="40%" width="32" height="32" rx="15.5" fill="white"/>
				<rect x="" width="32" height="32" rx="15.5"  fill="white"/>
				<rect x="80%" width="32" height="32" rx="15.5"  fill="white"/>
				</svg></button>`;
			linksContainer.appendChild(linkBox);
		}
	});
	linksContainer.innerHTML += `<div class="link-box">
<a class="link-icon" id="add-link">
<img src="assets/add-icon.svg" width="16" height="16" alt="add-icon">
</a>
<p class="link-text">Add</p>
</div>`
}



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
document.getElementById('search-btn').addEventListener('click', () => {
	const query = document.getElementById('search-input').value;
	window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
});


document.getElementById("add-link").addEventListener("click",(e)=>{
	e.preventDefault()
	if (document.getElementById("overlay").style.display === "flex") {
		document.getElementById("overlay").style.display = "none"
	} else {
		document.getElementById("overlay").style.display = "flex"
	}
})
document.getElementById("submit-link").addEventListener("click",async (e)=>{
	document.getElementById("overlay").style.display = "none"
	const name = String(document.getElementById("link-name").value).trim()
	const url = String(document.getElementById("link-url").value).trim()
	console.log(name,url)
	 if(!name||!url) {
		return null
	}
	icon = url+"/favicon.ico"
	const oldLinks = JSON.parse(localStorage.getItem('quickLinks'))
		const quickLinks = [{name:name,url:url}, ...oldLinks]
		console.log(quickLinks);
		localStorage.setItem( "quickLinks",JSON.stringify(quickLinks)) 
		
	loadQuickLinks();
})
// Load quick links from local storage
function loadQuickLinks() {
const links = localStorage.getItem('quickLinks')
// here it can be empty, but I added some shortcuts as default
if(!links) {
	localStorage.setItem('quickLinks',JSON.stringify([
		{name:"GitHub",url:"https://github.com/",icon:"./assets/ntpicon_.png"},
		{name:"Project IDX",url:"https://idx.google.com/",icon:"./assets/ntpicon_ (1).png"},
		{name:"Gmail",url:"https://mail.google.com/mail/u/0/#inbox",icon:"./assets/ntpicon_ (2).png"},
		{name:"Phind AI",url:"https://www.phind.com/",icon:"./assets/ntpicon_ (3).png"},
		{name:"YouTube",url:"https://www.youtube.com/",icon:"./assets/ntpicon_ (4).png"},
	]))
}
	const linksContainer = document.getElementById('links-container');
	linksContainer.innerHTML=''
	const result = localStorage.getItem('quickLinks');
		const quickLinks = JSON.parse(result) || [];
		console.log(result,quickLinks);
		quickLinks.map((link) => {
			if(link.name){
				const linkBox = document.createElement('div');
				linkBox.classList.add('link-box');
				linkBox.innerHTML = `<a href="${link.url}" target="_blank"><img src="${link.icon}" alt="${link.name}"></a>`;
				linksContainer.appendChild(linkBox);
			}
		});
}


// Load quick links on popup open
loadQuickLinks();

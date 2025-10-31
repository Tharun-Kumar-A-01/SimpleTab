const linksDiv = document.getElementById('links-container');
const paginationDiv = document.getElementById('pagination');
const add_link = document.getElementById("add-link");
const formElement = document.getElementById("overlay");

// Parameters for pagination
const LINKS_PER_PAGE = 4;
let currentPage = 1;

// triggers pop-up when add button is clicked
add_link.addEventListener("click", (e) => {
	e.preventDefault();

	// This if...else is to toggle the overlay and button states when the + button is clicked
	if (document.getElementById("overlay").style.display === "flex") {
		// this is the actual form
		document.getElementById("overlay").style.display = "none";
		// this is the dark background that elevates the overlay from the ui
		document.getElementById("overlay-bg").style.display = "none";
		// this is the cancel button that appears when the overlay appears.
		// i only thought this could be done simpler. will change this in future
		document.getElementById("cancel-btn").style.display = "none";
	} else {
		document.getElementById("overlay").style.display = "flex";
		document.getElementById("overlay-bg").style.display = "block";
		document.getElementById("cancel-btn").style.display = "flex";
	}
});

// Time and date update function
function updateTime() {

	// First selecting the elements needed to update the time into.
	const timeElement = document.getElementById('time');
	const noonElement = document.getElementById('noon');
	const dateElement = document.getElementById('date');

	const now = new Date();
	let hrs = now.getHours();
	let pm = false;

	// if statement to check the AM or PM
	if (hrs > 12) {
		hrs = hrs - 12;
		pm = true;
	}

	// we make a string of hours, mins, seconds seperately and then we padd it with 2 digits
	// 5 shows as 05 likewise
	const hours = String(hrs).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	// Writes Time
	timeElement.textContent = `${hours}:${minutes}:${seconds}`;
	noonElement.textContent = ` ${pm ? "PM" : "AM"}`;

	// Writes Date
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}

// Update clock for every 500ms
setInterval(updateTime, 500);

// Initializes clock
updateTime();

// Search functionality
document.getElementById('search-btn').addEventListener('click', (e) => {
	e.preventDefault();

	let query = document.getElementById('search-input').value;
	// Using google as default search engine.
	// i will make the changing search engines in settings option in future
	window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
});

// Searches on pressing ENTER
document.getElementById('search-input').addEventListener('keypress', (e) => {
	e.preventDefault();

	let query = document.getElementById('search-input');
	if (e.key === 'Enter') {
		window.open(`https://www.google.com/search?q=${encodeURIComponent(query.value)}`);
	} else {
		query.value = query.value + e.key;
	}
});

// fetches icon with url and converts it into base64 for offline purpose
async function imageToBase64 (url_given) {
	const url = new URL(url_given);

	// fetch icon with duckduckgo
	// note : if youre developing please replace the img.src value from link.icon to directly fetch the icon
	// because cors will restrict the fetch, if you think you can use {mode:"no-cors"} it also fails as for 
	// security purpose the browser will not let you read the response body.
	const response = await fetch(`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`,{mode:"no-cors"});
	
	// converting the data into a blob
	const blob = await response.blob();
	
	return new Promise((onSuccess, onError) => {
		try {
			const reader = new FileReader() ;
			// return the base64 string on success
			reader.onload = function(){ onSuccess(this.result) } ;
			// this is the actual part that converts blob into base64
			reader.readAsDataURL(blob) ;
		} catch(e) {
			console.log(e);  // error logging
		}
	});
};

// Listens the submit event on the overlay form
formElement.onsubmit = async function (e) {
	e.preventDefault();

	formElement.style.display = "none";
	document.getElementById("overlay-bg").style.display = "none";

	const name = String(document.getElementById("link-name").value).trim();
	const url = String(document.getElementById("link-url").value).trim();

	// console.log(name,url)		// Just for debugging purpose

	if (!name || !url) {
		return null;
	}

	// Get links from local storage
	const oldLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');

	// console.log(oldLinks)		// Also for debugging purpose

	// Writing to Local storage
	if (oldLinks) {
		oldLinks.push({ name: name, url: url, icon: "" });
		// console.log(oldLinks);
		localStorage.setItem("quickLinks", JSON.stringify(oldLinks));
	} else {
		const quickLinks = [{ name: name, url: url, icon: "" }];
		// console.log(quickLinks);
		localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
	}

	// Refresh Quick links
	renderLinks();
}

document.getElementById("cancel-btn").addEventListener("click", (e) => {
	e.preventDefault();

	// functionality for clicking cancel button
	if (document.getElementById("overlay").style.display === "flex") {
		document.getElementById("overlay").style.display = "none";
		document.getElementById("overlay-bg").style.display = "none";
		document.getElementById("cancel-btn").style.display = "none";
	}
})

// Renders Link boxes
async function renderLinks(page = 1) {
	// Get links from local storage
	const links = JSON.parse(localStorage.getItem('quickLinks'));

	// if the icon property is null, fetch the icon, convert it to base64 and store the string in icon
	links.forEach((link,index) => {
		if(link.icon === "") {
			imageToBase64(link.url).then((base64) => {
				if (base64) {
					links[index].icon = base64;
					localStorage.setItem('quickLinks', JSON.stringify(links));
				}
			});
		}
	})

	const totalPages = Math.ceil(links.length / LINKS_PER_PAGE);

	// this handles the edge case if the renderLinks > total pages
	currentPage = Math.min(page, totalPages || 1);

	// used to find the start index for the given page
	const start = (currentPage - 1) * LINKS_PER_PAGE;
	// then slice the links with "start" as starting index
	const paginatedLinks = links.slice(start, start + LINKS_PER_PAGE);

	linksDiv.innerHTML = '';
	
	paginatedLinks.forEach((link,index) => {
		const a = document.createElement('a');
		a.href = link.url;
		a.target = '_blank';
		a.innerText = link.name;
		a.className = 'link-a-tag'

		const image = document.createElement('img');
		image.src = link.icon;
		image.alt = link.name;
		image.className = 'link-icon';
		a.appendChild(image);

		const div = document.createElement('div');
		div.className = 'link-box';
		div.appendChild(a);

		linksDiv.appendChild(div);


	})
	// Refresh page numbers
	renderPagination(totalPages);


}

// Renders page numbers
function renderPagination(totalPages) {
	paginationDiv.innerHTML = '';

	// Displaying page numbers for pagination
	for (let i = 1; i <= totalPages; i++) {
		const btn = document.createElement('button');
		btn.textContent = i;

		// classes for styling
		if (currentPage === i) {
			let className = "current-page-btn";
			btn.classList.add(className);
		}
		btn.classList.add("page-btn");

		// Renders specific page on clicking
		btn.onclick = () => renderLinks(i);
		paginationDiv.appendChild(btn);
	}
}

// Load Quick Links
renderLinks();

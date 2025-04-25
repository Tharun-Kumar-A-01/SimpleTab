const linksDiv = document.getElementById('links-container');
const paginationDiv = document.getElementById('pagination');
const add_link = document.getElementById("add-link");

// Parameters for pagination
const LINKS_PER_PAGE = 4;
let currentPage = 1;

// triggers pop-up when add button is clicked
add_link.addEventListener("click", (e) => {
	e.preventDefault();

	if (document.getElementById("overlay").style.display === "flex") {

		document.getElementById("overlay").style.display = "none";
		document.getElementById("overlay-bg").style.display = "none";

	} else {

		document.getElementById("overlay").style.display = "flex";
		document.getElementById("overlay-bg").style.display = "block";

	}
});

// Time and date update function
function updateTime() {

	const timeElement = document.getElementById('time');
	const noonElement = document.getElementById('noon');
	const dateElement = document.getElementById('date');

	const now = new Date();
	let hrs = now.getHours();
	let pm = false;

	if (hrs > 12) {
		hrs = hrs - 12;
		pm = true;
	}

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

//Update clock for every 500ms
setInterval(updateTime, 500);

// Initializes clock
updateTime();

// Search functionality
document.getElementById('search-btn').addEventListener('click', (e) => {
	e.preventDefault();

	let query = document.getElementById('search-input').value;
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


//Pop-up submit button
document.getElementById("submit-link").addEventListener("click", async (e) => {
	e.preventDefault();

	document.getElementById("overlay").style.display = "none";
	document.getElementById("overlay-bg").style.display = "none";

	const name = String(document.getElementById("link-name").value).trim();
	const url = String(document.getElementById("link-url").value).trim();

	// console.log(name,url)		// Just for debugging purpose

	if (!name || !url) {
		return null;
	}

	const oldLinks = JSON.parse(localStorage.getItem('quickLinks'));

	// console.log(oldLinks)		// Also for debugging purpose

	// Writing to Local storage
	if (oldLinks) {
		oldLinks.push({ name: name, url: url });
		// console.log(oldLinks);
		localStorage.setItem("quickLinks", JSON.stringify(oldLinks));
	} else {
		const quickLinks = [{ name: name, url: url }];
		// console.log(quickLinks);
		localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
	}

	// Refresh Quick links
	renderLinks();
});

// Renders Link boxes
function renderLinks(page = 1) {
	const links = getLinks();
	const totalPages = Math.ceil(links.length / LINKS_PER_PAGE);
	currentPage = Math.min(page, totalPages || 1);
	const start = (currentPage - 1) * LINKS_PER_PAGE;
	const paginatedLinks = links.slice(start, start + LINKS_PER_PAGE);

	linksDiv.innerHTML = paginatedLinks.map(link =>
		`<div class="link-box"><a href="${link.url}" target="_blank">${link.name}</a></div>`
	).join('') || '';

	// Refresh page numbers
	renderPagination(totalPages);
}

// Renders page numbers
function renderPagination(totalPages) {
	paginationDiv.innerHTML = '';

	for (let i = 1; i <= totalPages; i++) {
		const btn = document.createElement('button');
		btn.textContent = i;

		// Added classes for styling
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

// Reads from Local storage
function getLinks() {
	return JSON.parse(localStorage.getItem('quickLinks') || '[]');
}

// Load Quick Links
renderLinks();

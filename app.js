document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  document.getElementById("modeToggle").textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
});

async function searchWikipedia() {
  const query = document.getElementById("searchQuery").value.trim();
  const resultsDiv = document.getElementById("results");
  const loaderDiv = document.getElementById("loader");

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a topic.</p>";
    return;
  }

  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&origin=*`;

  resultsDiv.innerHTML = "";
  loaderDiv.style.display = "block";

  try {
    const response = await fetch(url);
    const data = await response.json();
    loaderDiv.style.display = "none";

    const results = data.query.search;

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No results found. Try another topic.</p>";
      return;
    }

    for (const result of results) {
      const pageUrl = `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, "_")}`;
      const snippet = result.snippet.replace(/<\/?[^>]+(>|$)/g, "");

      const itemDiv = document.createElement("div");
      itemDiv.className = "result-item";
      itemDiv.innerHTML = `
        <h2>${result.title}</h2>
        <p>${snippet}...</p>
        <a href="${pageUrl}" target="_blank">Read More</a>
      `;

      resultsDiv.appendChild(itemDiv);
    }
  } catch (error) {
    loaderDiv.style.display = "none";
    resultsDiv.innerHTML = "<p>Error fetching results. Please try again later.</p>";
    console.error(error);
  }
}

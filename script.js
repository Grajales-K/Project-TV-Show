
const episodesStates = { all: [], searchTerm: "" }; // Initial state for episodes
let showStates = { all: [], searchTerm: "" }; // Initial state for shows
const dataCache = {}; // Cache for fetched data

// Fetch data with caching
async function fetchWithCache(url) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading, please wait....</p>";
  try {
    if (dataCache[url]) {
      rootElem.innerHTML = "";; // Clear message if data is cached
      return dataCache[url];
    }
    const response = await fetch(url);
    if (!response.ok) {
      rootElem.innerHTML = `<p>Failed to fetch data from ${url}</p>`;
    }
    const data = await response.json();
    dataCache[url] = data;
    rootElem.innerHTML = "";
    return data;
  } catch (error) {
    rootElem.innerHTML = `<p>An error occurred: ${error.message}</p>`;
  }
}

// Setup function
async function setup() {
  try {
    const shows = await fetchWithCache("https://api.tvmaze.com/shows");
    if (shows) {
      showStates = shows;
      makePageForShows(showStates);
      selectShowDropDown(showStates);
      showSearchBox(showStates);
      episodeDropVisible(false);
      showDropVisible(true);
      episodeCounterVisible(false)
      
    }
  } catch (error) {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = `<p>Error fetching shows: ${error}</p>`;
    console.error("Error fetching shows:", error);
  }
}

// Populate show dropdown
function selectShowDropDown(showList) {
  const selectList = document.getElementById("selectS");
  selectList.innerHTML = ""; // Clear existing options

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "allShows";
  defaultOption.textContent = "All Shows";
  selectList.append(defaultOption);

  showList.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  for (show of showList) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selectList.append(option);
  }
  selectList.addEventListener("change", async (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "allShows") {
      makePageForShows(showStates);
    } else {
      try {
        const episodes = await fetchWithCache(
          `https://api.tvmaze.com/shows/${selectedValue}/episodes`
        );
        if (episodes) {
          makePageForEpisodes(episodes)
          episodeCounter(episodes.length, episodes.length)
          episodeSearchBox(episodes); // Render episodes
          selectDropDownEpisodes(episodes); // Populate episode dropdown
          backToShowsButton(true);
          episodeDropVisible(true);
          showDropVisible(false);
          episodeCounterVisible(true)
          
  
        }
      } catch (error) {
        const rootElem = document.getElementById("root");
        rootElem.innerHTML = `<p>Error fetching episodes: ${error}</p>`;
      }
    }
  });
}

// Populate episode dropdown
function selectDropDownEpisodes(episodeList) {
  const selectList = document.getElementById("selectE");
  selectList.innerHTML = ""; // Clear existing options

  const defaultOption = document.createElement("option");
  defaultOption.value = "allEpisodes";
  defaultOption.textContent = "All Episodes";
  selectList.append(defaultOption);

  for (episode of episodeList) {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")} - ${episode.name} `;
    selectList.append(option);
  }
  selectList.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "allEpisodes") {
      makePageForEpisodes(episodeList); // Render all episodes
      episodeCounter(episodeList.length, episodeList.length)
    } else {
      const selectedEpisode = episodeList.find(
        (episode) => episode.id == selectedValue
      );
      makePageForEpisodes([selectedEpisode]); // Render selected episode
      episodeCounter(1, episodeList.length)
    }
  });
}

// Update episode counter
function episodeCounter(filteredCount, totalCount) {
  const countElement = document.getElementById("episodeCount");
  countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
}

function episodeSearchBox(stateList) {
  const searchBox = document.getElementById("search");
  searchBox.value = "";
  searchBox.addEventListener("input", (event) => {
    const searchTerm = event.target.value; //Update the searchTerm in state
    const filteredElements = stateList.filter(
      (element) =>
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    makePageForEpisodes(filteredElements);
    episodeCounter(filteredElements.length, stateList.length);
  });
}

// Create search functionality
function showSearchBox(stateList) {
  const searchBox = document.getElementById("search");
  searchBox.value = "";
  searchBox.addEventListener("input", (event) => {
    const searchTerm = event.target.value; //Update the searchTerm in state
    const filteredElements = stateList.filter(
    (element) => element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.genres.some((genre) =>
      genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    //element.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    makePageForShows(filteredElements);
  });
}

// Create show card
function makePageForShows(showsList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; //clearing textContent

  const showsContainer = document.createElement("div");
  showsContainer.className = "episodes-container";

  for (const show of showsList) {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    showCard.innerHTML = `
    <div>
    <img src="${show.image.medium}" alt="${show.name}">
    </div>
    <div>
    <h2>${show.name}</h2>
    <p>Genres: ${show.genres}</p>
    <p>Status: ${show.status}</p>
    <p>Rating: ${show.rating.average}</p>
    <p>Runtime: ${show.runtime} minutes</p>
    <p>Summary: ${show.summary}</p>
    </div>
    `;
    
    const showTitle = showCard.querySelector("h2"); // Select the h2 element
    showTitle.addEventListener("click", async() => {
       try {
        const episodes = await fetchWithCache(
          `https://api.tvmaze.com/shows/${show.id}/episodes`
        );
        if (episodes) {
          makePageForEpisodes(episodes)
          episodeSearchBox(episodes); // Render episodes
          selectDropDownEpisodes(episodes); // Populate episode dropdown
          backToShowsButton(true);
          episodeDropVisible(true);
          showDropVisible(false);
          episodeCounterVisible(true);
          
      
        }
      } catch (error) {
        const rootElem = document.getElementById("root");
        rootElem.innerHTML = `<p>Error fetching episodes: ${error}</p>`;
      }
    });
    
    showsContainer.append(showCard);
  }

  rootElem.append(showsContainer);
}

// Create episode cards
function makePageForEpisodes(episodesList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; //clearing textContent

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  for (const episode of episodesList) {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card"; 

    episodeCard.innerHTML = `
    <h2>${episode.name} (S${String(episode.season).padStart(2, "0")}E${String(
      episode.number).padStart(2, "0")})</h2>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <p>${episode.summary}</p>
    `;
    // each episode can open in new window for more detail (from the source website)
    episodeCard.addEventListener("click", () => {
      window.open(episode.url, "_blank");
    });
    // Append the episode card to the container
    episodesContainer.append(episodeCard);
  }
  // Append the container card to the root
  rootElem.append(episodesContainer);
}

function backToShowsButton(status) {
  const backToShowsButton = document.getElementById("back-to-shows");
  backToShowsButton.style.display = status ? "block" : "none";
  backToShowsButton.addEventListener("click", () => {
    setup();
  });
}

function episodeDropVisible(status) {
  const episodeListVisible = document.getElementById("selectE");
  episodeListVisible.style.display = status ? "block" : "none";
}
function showDropVisible(status) {
  const showListVisible = document.getElementById("selectS");
  showListVisible.style.display = status ? "block" : "none";
}
function episodeCounterVisible(status) {
  const counterVisible = document.getElementById("episodeCount");
  counterVisible.style.display = status ? "block" : "none";
}


// Call the setup function when the page loads
window.onload = setup;

function setup() {
  const allEpisodes = getAllEpisodes();
  let searchTerm = "";  // Initial searchTerm state
  const states = {allEpisodes, searchTerm};
  render(states); //Initial render
  createSearchTerm(states);  //Setup search functionality
}

function render(stateList) { 
    //Filter episodes based on the searchTerm (case-insensitive)
    const filteredEpisode = stateList.allEpisodes.filter((episode) => 
        (episode.name.toLowerCase().includes(stateList.searchTerm.toLowerCase())
        || 
        episode.summary.toLowerCase().includes(stateList.searchTerm.toLowerCase()))
    );
    makePageForEpisodes(filteredEpisode);
    episodeCounter(filteredEpisode.length,stateList.allEpisodes.length);
}

function createSearchTerm(stateList) {
    const searchBox = document.getElementById("search");
    searchBox.addEventListener("input", (event) => {  // Add an event listener to check user input
        stateList.searchTerm = event.target.value;  //Update the searchTerm in state
        render(stateList);    //Re-render with the updated state
    })
}
// Function to update how many episodes are displayed
function episodeCounter(filteredCount, totalCount) { 
  const countElement = document.getElementById("episodeCount");
  countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
}

function makePageForEpisodes(episodesList) {
  // Get the root element from the DOM where the episodes will be displayed
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``;  //clearing textContent

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Loop through each episode in the episodesList
  for(const episode of episodesList) {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card"; // add class for card for styling

    episodeCard.innerHTML =`
    <h2>${episode.name} (S${String(episode.number).padStart(2, "0")}E${String(episode.season).padStart(2, "0")})</h2>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <p>${episode.summary}</p>
    `;  
    // each episode can open in new window for more detail (from the source website)
    episodeCard.addEventListener("click", () => {
      window.open(episode.url, "_blank"); 
    });
  // Append the episode card to the container
  episodesContainer.append(episodeCard);
  };
  // Append the container card to the root
  rootElem.append(episodesContainer);
}

// Call the setup function when the page loads
window.onload = setup;

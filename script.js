function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodesList){
  const rootElem = document.getElementById("root");
  rootElem.textContent =`Got ${episodesList.length} episodes(s) `
  episodesList.forEach((episode) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = `S${episode.season}E${episode.number}: ${episode.name}`;
    rootElem.appendChild(paragraph);


  });
}

// Call the setup function when the page loads
window.onload = setup;

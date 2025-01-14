function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodesList) {
  // Get the root element from the DOM where the episodes will be displayed
  const rootElem = document.getElementById("root");

  // Display the total number of episodes at the top of the page
  rootElem.textContent = `Got ${episodesList.length} episode(s)`;

  // Loop through each episode in the episodesList
  episodesList.forEach((episode) => {
    // Create a paragraph element to display the season, episode number, and name
    const paragraph = document.createElement("p");
    paragraph.textContent = `S${episode.season}E${episode.number}: ${episode.name}`;
    rootElem.appendChild(paragraph); // Attach the paragraph to the root element

    // Create an image element to display the episode's image
    const image = document.createElement("img");
    image.src = episode.image.medium; // Set the image source to the medium-sized episode image
    rootElem.appendChild(image); // Attach the image to the root element
  });
}


// Call the setup function when the page loads
window.onload = setup;

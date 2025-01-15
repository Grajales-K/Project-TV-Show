function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// function ShowSeasonAndEpisodes (episode){
//   const {season, number} = episodes;

// }

//level 100
function makePageForEpisodes(episodesList) {
  // Get the root element from the DOM where the episodes will be displayed
  const rootElem = document.getElementById("root");

  // Display the total number of episodes at the top of the page
  // episodesContainer.textContent = `Got ${episodesList.length} episode(s)`;

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Loop through each episode in the episodesList
  episodesList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card"; // add class for card for styling

    // Create a paragraph element to display the season, episode number, and name
    const title = document.createElement("h2");
    // destructuring to add padString
    title.textContent = `S${episode.season
      .toString()
      .padStart(2, 0)}E${episode.number.toString().padStart(2, 0)}: ${
      episode.name
    }`;
    episodeCard.appendChild(title); // Attach the paragraph to the root element

    // Create an image element to display the episode's image
    const image = document.createElement("img");
    image.src = episode.image.medium; // Set the image source to the medium-sized episode image
    episodeCard.appendChild(image); // Attach the image to the root element

    // Create a new paragraph element to display the episode's summary
    const summaryParagraph = document.createElement("p");
    // Set the inner HTML of the paragraph to the episode's summary
    // Using `innerHTML` allows rendering of any HTML tags included in the summary (e.g., <b>, <i>)
    summaryParagraph.innerHTML = episode.summary;
    // Append the paragraph to the root element to make it visible on the page
    episodeCard.appendChild(summaryParagraph);
    episodeCard.addEventListener("click", () => {
      window.open(episode.url, "_blank");
    });
    episodesContainer.appendChild(episodeCard);
  });
  rootElem.appendChild(episodesContainer);
}

// Call the setup function when the page loads
window.onload = setup;

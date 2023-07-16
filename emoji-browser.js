// Move the welcome text to the top after the page is loaded
window.addEventListener("load", function () {
  const welcomeText = document.querySelector(".welcome-text");
  welcomeText.classList.add("top");
});

// Fetch emoji details from the API
async function fetchEmojiDetails() {
  try {
    const response = await fetch("https://emojihub.yurace.pro/api/all");
    if (!response.ok) {
      throw new Error("Failed to fetch emoji details");
    }
    const data = await response.json();
    return data.map((emoji) => ({
      ...emoji,
    }));
  } catch (error) {
    console.error(error);
  }
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text) {
  const elem = document.createElement("textarea");
  elem.innerHTML = text;
  return elem.value;
}

// Display emojis with their details
async function displayEmojis(page = 1) {
  const emojiListElement = document.getElementById("emoji-list");
  emojiListElement.innerHTML = "";

  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const selectedCategory = document.getElementById("category-select").value;

  const emojiDetails = await fetchEmojiDetails();
  const filteredEmojis = emojiDetails.filter((emoji) => {
    const emojiCategory = emoji.category.toLowerCase();
    return (
      (selectedCategory === "" || emojiCategory === selectedCategory) &&
      emoji.name.toLowerCase().includes(searchTerm)
    );
  });

  const emojisPerPage = 10;
  const startIndex = (page - 1) * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const paginatedEmojis = filteredEmojis.slice(startIndex, endIndex);

  paginatedEmojis.forEach((emoji) => {
    const emojiCard = document.createElement("div");
    emojiCard.classList.add("emoji-card");
    emojiCard.addEventListener("click", () => {
      console.log(`Selected emoji: ${emoji.name}`);
    });

    const emojiSymbol = document.createElement("span");
    emojiSymbol.classList.add("emoji-htmlCode");
    emojiSymbol.innerHTML = emoji.htmlCode;

    const emojiName = document.createElement("p");
    emojiName.classList.add("emoji-name", "hidden");
    emojiName.textContent = `Name: ${emoji.name}`;

    const emojiCategory = document.createElement("p");
    emojiCategory.classList.add("emoji-category", "hidden");
    emojiCategory.textContent = `Category: ${emoji.category}`;

    const emojiGroup = document.createElement("p");
    emojiGroup.textContent = `Group: ${emoji.group}`;

    const emojiHTMLCode = document.createElement("p");
    emojiGroup.textContent = `HTML Code: ${emoji.htmlCode}`;
    console.log(emojiGroup.textContent);
    console.log(emoji.htmlCode);

    emojiCard.appendChild(emojiSymbol);
    emojiCard.appendChild(emojiName);
    emojiCard.appendChild(emojiCategory);
    emojiCard.appendChild(emojiGroup);
    emojiCard.appendChild(emojiHTMLCode);
    emojiListElement.appendChild(emojiCard);
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmojis.length / emojisPerPage);
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  // Calculate start and end page numbers
  let startPage, endPage;
  // Calculate start and end page numbers dynamically
  const maxVisiblePages = 5;
  if (totalPages <= maxVisiblePages) {
    // If total pages is less than or equal to maxVisiblePages, display all page numbers
    startPage = 1;
    endPage = totalPages;
  } else {
    if (page <= Math.ceil(maxVisiblePages / 2)) {
      // If current page is closer to the start, display first maxVisiblePages page numbers
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (page >= totalPages - Math.floor(maxVisiblePages / 2)) {
      // If current page is closer to the end, display last maxVisiblePages page numbers
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      // Display a range of page numbers around the current page
      startPage = page - Math.floor(maxVisiblePages / 2);
      endPage = page + Math.ceil(maxVisiblePages / 2) - 1;
    }
  }
  if (page > 1) {
    const prevButton = document.createElement("button");
    prevButton.classList.add("arrow");
    prevButton.textContent = "<";
    prevButton.addEventListener("click", () => {
      displayEmojis(page - 1);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageNumberButton = document.createElement("button");
    pageNumberButton.textContent = i;
    pageNumberButton.addEventListener("click", () => {
      displayEmojis(i);
    });

    if (i === page) {
      pageNumberButton.classList.add("active");
    }

    paginationContainer.appendChild(pageNumberButton);
  }

  // Next arrow button
  if (page < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.classList.add("arrow");
    nextButton.textContent = ">";
    nextButton.addEventListener("click", () => {
      displayEmojis(page + 1);
    });
    paginationContainer.appendChild(nextButton);
  }
}

// Search input event listener
document.getElementById("search-input").addEventListener("input", () => {
  displayEmojis();
});

// Category select change event listener
document.getElementById("category-select").addEventListener("change", () => {
  displayEmojis();
});

// Initial display of emojis on page load
displayEmojis();

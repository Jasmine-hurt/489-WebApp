const recentDecks = [
    { name: "Recent Deck 1", link: "/deck/Deck1" },
    { name: "Recent Deck 2", link: "/deck/Deck2" },
    { name: "Recent Deck 3", link: "/deck/Deck3" }
    ];

const deckContainer = document.getElementById('recent-decks-container');

if (recentDecks.length)
    {
    recentDecks.forEach(deck => {
        const deckHtml = `
        <div class="col-sm-3">
            <a href="${deck.link}">
            <div class="card shadow rounded-3 border-0">
                <div class="card-body text-center">
                <h5 class="card-title">${deck.name}</h5>
                <p class="card-text">Flashcard Deck : ${deck.cardCount} cards</p>
                </div>
            </div>
            </a>
        </div>
        `;
        deckContainer.innerHTML += deckHtml;
    });
}

const recentGuides = [
    { name: "Recent Guide 1", link: "/deck/1" },
    { name: "Recent Guide 2", link: "/deck/2" },
    { name: "Recent Guide 3", link: "/deck/3" }
    ];

const guideContainer = document.getElementById('recent-guides-container');

if (recentGuides.length)
    {
    recentGuides.forEach(guide => {
        const guideHtml = `
        <div class="col-sm-3">
            <a href="${guide.link}">
            <div class="card shadow rounded-3 border-0">
                <div class="card-body text-center">
                <h5 class="card-title">${guide.name}</h5>
                </div>
            </div>
            </a>
        </div>
        `;
        guideContainer.innerHTML += guideHtml;
    });
}
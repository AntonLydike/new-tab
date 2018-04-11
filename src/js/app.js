
// default settings:
let settings = {
  color: {
    nav: 'white black-text',
    footer: 'white black-text'
  },
  clock: {
    interval: 1000, // update every second
    enabled: true
  },
  search: {
    enabled: true,
    engine: "DuckDuckGo",
    query: "https://duckduckgo.com/?q=%s",
    logo: "https://duckduckgo.com/assets/logo_homepage.normal.v107.svg"
  },
  favorites: {
    enabled: true,
    list: []
  },
  weather: {
    apikey: '2aa77b12818bc184f972804b4963b3dd', // yeah, I don't care that this is public, I'll generate a new one soon
    enabled: true,
    interval: 60 * 10, // every ten minutes
    location: {
      lat: '48.363722',
      lon: '10.886076'
    }
  },
  wallpaper: "/src/images/wallpaper.jpg"
}


function init() {
  // set wallpaper
  // set_wallpaper(settings.wallpaper);

  let data, url = settings.wallpaper;

  const clock = new DigitalClock(document.querySelector('.clock-container'), settings.clock);

  const searchbar = new SearchBar(document.querySelector('.search-bar'), settings.search);

  const weather = new OpenWeatherWidget(document.querySelector('.weather-container'), settings.weather);

  chrome.topSites.get((list) => {
    settings.favorites.list = list;

    const favorites = new FavoriteSites(document.querySelector('.favorites-list'), settings.favorites);
  })


  $('nav').addClass(settings.color.nav);
  $('footer').addClass(settings.color.footer);

  $(".side-nav-opener").sideNav();

  $('body').addClass('loaded');
}

init()

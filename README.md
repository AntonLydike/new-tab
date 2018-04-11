# New-Tab

A simple but feature-rich new tab replacement for chrome(ium).

## features

A quick overview over features that I plan on adding to this extension.

 - [x] Clock
 - [x] Search bar
 - [x] Favorites
 - [x] Weather
 - [ ] Settings
 - [ ] Bookmarks
 - [ ] Notepad
 - [ ] Wallpaper

## Explanation of requirements

 - `Favorites`: I want to display your favorite sites (their root urls get leaked to Googles favicon service ([heres a tutorial on that](https://www.labnol.org/internet/get-favicon-image-of-websites-with-google/4404/))
 - `Bookmarks`: I want to display bookmarks. Their root urls get leaked too (hopefully I'll find a fix for that, PR's welcome)
 - `Geolocation`: Used for the weather api, leaked to [OpenWeatherMap.org](https://openweathermap.org)
 - `Storage`: Because I want to store your settings in chromes synced storage (across devices)

## Dependencies

This Package uses the [Materializecss](https://materializecss.com) Library, which in turn depends on jQuery (sadly).

Other than that, I embedded the Roboto font and Googles Icon font.

I use the following APIs

 - [OpenWeatherMap.org](https://openweathermap.org) for weather
 - Googles Icon service (https://www.google.com/s2/favicons?domain=www.domain.com)

## Project Design

I separated each "widget" into a separate, stand-alone file, only exposing a ES6 Class Interface outward.

My stiling can be found in the style.css [starting at this line](/src/css/style.css#L40).

### DigitalClock
[Code](/src/js/clock.js)

Usage:
````js
const node = document.querySelector('.clock-container');
const clock = new DigitalClock(node, {
  interval: 1000, // update every second
  enabled: true
})
````

Where `node` points to a HTML structure like this:
````html
  <div class="clock-container">
    <div class="clock-hours"></div>
    <div class="clock-minutes"></div>
    <div class="clock-seconds"></div>
  </div>
````

### SearchBar
[Code](/src/js/search-bar.js)

Usage:
````js
const node = document.querySelector('.search-bar');
const searchbar = new SearchBar(node, {
  enabled: true,
  engine: "DuckDuckGo",
  query: "https://duckduckgo.com/?q=%s",
  logo: "https://duckduckgo.com/assets/logo_homepage.normal.v107.svg"
})
````

Where `node` points to a HTML structure like this:
````html
<div class="search-bar">
  <div class="search-logo">
    <img/>
  </div>
  <div class="search-input white z-depth-1">
    <div class="input-field">
      <input type="text" id="search-input-field">
      <label for="search-input-field">Search the web!</label>
    </div>
  </div>
</div>
````

Settings:
 - `enabled: <boolean>`: if false, `node` will be hidden.
 - `engine: <string>`: A String identifying the search engine, may be displayed.
 - `query: <string>`: The URL which will be opened, `%s` will be replaced by the search term.
 - `logo: <string>`: URL to the logo of the search engine.


### FavoriteSites
[Code](/src/js/favorite-sites.js)

Usage:
````js
const node = document.querySelector('.favorites-list');
const favorites = new FavoriteSites(node, {
 enabled: true,
 list: [{title: "Amazon", url: "https://amazon.com"}]
})
````

Where `node` points to an (empty) HTML node.

Settings:
- `enabled: <boolean>`: if false, `node` will be hidden.
- `list: [{title: <string>, url: <string>}]`: A list containing the favorite sites (`title` and `url`).

Each item in the list will have this structure:
````html
<a href="{{url}}" title="{{title}}" class="favorites-item z-depth-1">
  <img src="{{favicon_url}}"/>
  <span class="favorites-label">{{title}}</span>
</a>
````

### OpenWeatherWidget
[Code](/src/js/weather.js)

Usage:
````js
const node = document.querySelector('.weather-container');
const weather = new OpenWeatherWidget(node, {
  apikey: '<your open-weather-map api key>',
  enabled: true,
  interval: 60 * 10, // every ten minutes
  location: {
    lat: '48.363722',
    lon: '10.886076'
  }
})
````

Where `node` points to an (empty) HTML node.

Settings:
 - `enabled: <boolean>`: if false, `node` will be hidden.
 - `apikey: <string>`: Your OpenWeatherMap API-Key.
 - `interval: <int>`: How often (minutes) the API will be polled for new data.
 - `location: {lat: <string>, lon: <string>}`: Latitude and longitude of desired location.

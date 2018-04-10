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

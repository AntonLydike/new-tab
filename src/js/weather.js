(()=>{
  function replaceMulti (text, map) {
    return String(text).replace(
      new RegExp(Object.keys(map).join("|"),"gi"),
      (k) => map[k]
    );
  }
  function escapeHTML (html) {
    return replaceMulti(html, {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&#34;',
    });
  }
  function escapeQuotes (text) {
    return replaceMulti(text, {
      "'": '&#39;',
      '"': '&#34;',
      '`': '&#96;',
    });
  }

  function angleToHTML (angle) {
    if (angle === undefined || typeof angle !== 'number' || isNaN(angle)) return "";

    return `<div class="compass-container"><div class="compass-needle" style="transform: rotate(${angle - 90 - 180}deg);">&#x27a4;</div></div>`;
  }

  function getEpoch() {
    return Math.round(((new Date()).getTime() / 1000));
  }

  class OpenWeatherWidget {
    constructor(node, {enabled, apikey, interval, location}) {
      if (enabled === false) {
        node.style.display = 'none';
      }

      this.node = node;
      this.apikey = apikey;
      this.interval = interval;
      this.query = "http://api.openweathermap.org/data/2.5/weather?lat={{lat}}&lon={{lon}}&appid=" + this.apikey;

      if (location === undefined ||
        location.lat === undefined ||
        location.lon === undefined ) {
        this.getLocation().then(this.initUpdates())
      } else {
        this.lat = location.lat;
        this.lon = location.lon;
        this.initUpdates();
      }
    }

    update() {
      if (parseInt(localStorage.getItem('weather:time'), 10) + this.interval >= getEpoch()) {
        try {
          this.data = JSON.parse(localStorage.getItem('weather:data'));
        } catch(e) {
          console.error("Malformed local storage, discarding...");
          localStorage.removeItem('weather:time');
          localStorage.removeItem('weather:data');
          return this.update();
        }

        this.displayCurrent();
        return;
      } else {
        this.getWeatherData().then(() => {
          this.displayCurrent();
        })
      }

    }

    initUpdates() {
      this.update();

      this.intervalID = setInterval(() => {
        this.update();
      }, 1000 * 60); // every sixty seconds
    }

    displayCurrent() {
      this.node.innerHTML = `${this.getLocationString()} ${this.getIcon()} ${this.getTemp()} ${this.getCompass()}</span>`;
    }

    getLocationString() {
      return '<div class="weather-location">' + escapeHTML(this.data ? this.data.name : 'unknown') + '</div>';
    }

    getTemp() {
      return '<div class="weather-temp">' + escapeHTML(this.data ? parseFloat((this.data.main.temp - 273.15).toFixed(1), 10) : '?') + '°C</div>';
    }

    getCompass() {
      return angleToHTML(this.data ? this.data.wind.deg : undefined) + `<span class="wind-speed">${escapeHTML(parseFloat((this.data.wind.speed * 3.6).toFixed(1),10))} km/h</div>`
    }

    getIcon() {
      if (this.data === undefined ||
         this.data.weather === undefined ||
         this.data.weather.length == 0 ||
         this.data.weather[0].icon === undefined) {
        return '<span class="error red-text">Error loading weather icon</span>';
      }

      let icon = this.data.weather[0].icon;

      return `<img src="http://openweathermap.org/img/w/${escapeQuotes(icon)}.png" class="weather-icon"/>`;
    }

    getLocation() {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition((loc) => {
          if (loc === undefined || loc.coords === undefined || loc.coords.latitude === undefined) {
            rej("Couldn't get location!");
          }

          this.lat = loc.coords.latitude;
          this.lon = loc.coords.longitude;

          res({lat: this.lat, lon: this.lon});
        }, (err) => {rej(err)});
      })
    }

    getWeatherData() {
      let query = replaceMulti(this.query, {'{{lat}}': this.lat, '{{lon}}': this.lon});

      console.log("fetching new weather data");

      return fetch(query).then(result => result.json()).then((data) => {
        this.data = data;
        localStorage.setItem('weather:data', JSON.stringify(data));
        localStorage.setItem('weather:time', getEpoch());
      });
    }
  }

window.OpenWeatherWidget = OpenWeatherWidget;
})()

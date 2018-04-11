(()=>{
let defaults = {
  selectors: {
    hour:'.clock-hours',
    minute:'.clock-minutes',
    second:'.clock-seconds'
  },
  interval: 1000
}


class DigitalClock {
  constructor(node, {interval, selectors, enabled} = {}) {
    if (enabled === false) {
      node.style.display = 'none';
    }

    if (selectors !== undefined) {
      this.selectors = {
        hour: selectors.hour || defaults.selectors.hour,
        minute: selectors.hour || defaults.selectors.minute,
        second: selectors.hour || defaults.selectors.second
      }
    } else {
      // clone defaults
      this.selectors = JSON.parse(JSON.stringify(defaults.selectors));
    }

    this.node = node;
    this.interval = interval || defaults.interval;

    // shortcut
    this._e = (sel) => this.node.querySelector(sel);

    // start the clock
    this.start();
  }

  tick() {
    let time = new Date();
    this.setHour(time.getHours());
    this.setMinute(time.getMinutes());
    this.setSecond(time.getSeconds());
  }

  pause() {
    clearInterval(this.intervalID);
  }

  start() {
    this.tick();
    this.intervalID = setInterval(() => {
      this.tick();
    }, this.interval);
  }

  setHour(h) {
    this._e(this.selectors.hour).innerText = ("0" + h).slice(-2);
  }
  setMinute(m) {
    this._e(this.selectors.minute).innerText = ("0" + m).slice(-2);
  }
  setSecond(s) {
    let elm = this._e(this.selectors.second);
    if (elm === null) return;
    elm.innerText = ("0" + s).slice(-2);
  }
}

window.DigitalClock = DigitalClock;

})()

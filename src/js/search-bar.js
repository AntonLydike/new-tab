(()=>{
class SearchBar {
  constructor(node, {enabled, engine, query, logo} = {}) {
    if (enabled === false) {
      node.style.display = 'none';
    }

    this.node = node;
    this.engine = engine;
    this.query = query;

    this._e = (sel) => this.node.querySelector(sel);

    if (logo !== undefined) {
      this.logo = logo;
      this.displayLogo();
    }

    this.attachListener()
  }

  go() {
    let searchterm = encodeURIComponent(this.getValue())
    let url = this.query.replace("%s", searchterm);
    window.location.replace(url);
  }

  getValue() {
    return this._e('input[type="text"]').value;
  }

  attachListener() {
    this._e('input[type="text"]').addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        this.go();
      }
    })
  }

  // displays logo and stores it in cache
  displayLogo() {
    let url = this.logo, localData;
    if ((localData = localStorage.getItem('search-bar:image:' + url)) != null) {
      this._e('img').src = lcoalData;
    } else {
      let img = this._e('img');
      // convert image to base64 upon loading
      img.addEventListener('load', (e) => {
        let canv = document.createElement('canvas'),
            ctx  = canv.getContext("2d");

        canv.height = img.naturalHeight || img.height;
        canv.width  = img.naturalWidth || img.width;
        ctx.drawImage(img, 0, 0);

        try {
          let data = canv.toDataURL('image/png');
          localStorage.setItem('search-bar:image:' + url, data);
        } catch (e) {
          console.log("Couldn't cache image...");
        }
      });

      img.src = url;
    }
  }
}

window.SearchBar = SearchBar;

})()

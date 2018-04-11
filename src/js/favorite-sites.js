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
  function urlRoot (url) {
    return (/(https?:\/\/[^/]+)/).exec(url)[1];
  }

  class FavoriteSites {
    constructor(node, {enabled, list} = {}) {
      if (enabled === false) {
        node.style.display = 'none';
      }

      this.node = node;
      this.list = list;

      this.displayList();
    }

    displayList() {
      this.list.forEach((item) => {
        this.node.appendChild(this.createListItem(item));
      })
    }

    createListItem({title, url}) {
      let root = document.createElement("a");
      root.href = url;
      root.title = title;
      root.classList.add("favorites-item");
      root.classList.add("z-depth-1");
      root.innerHTML = `<img src="${escapeQuotes(this.getFaviconUrl(url))}"/><span class="favorites-label">${escapeHTML(title)}</span>`;
      // hide image when not found
      root.querySelector('img').onerror = function () {this.style.display = 'none'};
      return root;
    }

    getFaviconUrl(url) {
      // check for local domains
      if (url.indexOf("192.168") > -1) {
        return url + '/favicon.ico';
      } else {
        return "https://www.google.com/s2/favicons?domain=" + urlRoot(url);
      }
    }
  }

window.FavoriteSites = FavoriteSites;
})()

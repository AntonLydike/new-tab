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
  function uniqid() {
    return (new Date()).getTime().toString(36) + performance.now().toString(36).replace('.','');
  }

  class Notepad {
    constructor(node, {enabled, notes, addCallback, updateCallback, removeCallback} = {}) {
      if (enabled === false) {
        node.style.display = 'none';
      }

      this.node = node;
      this.notes = notes;
      this.__addCallback = addCallback;
      this.__updateCallback = updateCallback;
      this.__removeCallback = removeCallback;

      this.node.innerHTML = `<div class="note-control z-depth-1 white"><input type="text" id="note-text" placeholder="New note"/></div><div class="note-list"></div>`;

      this.__n = {
        input: node.querySelector('input'),
        list: node.querySelector('.note-list')
      }

      this.__n.input.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
          let text = e.target.value.trim();

          if (text == "") return;

          let note = this.newNote(text);
          this.notes.push(note);
          this.__addCallback({text, id: note.id});
          e.target.value = "";
        }
      })

      notes.forEach((data) => {
        this.noteFromData(data);
      })
    }

    noteFromData(data) {
      data.node = this.newNote(data.text, data.id).node;
    }

    newNote(text, id) {
      if (id === undefined) {
        id = uniqid();
      }

      let note = document.createElement('div');
      note.classList.add('note-list-item');
      note.classList.add('z-depth-1');
      note.innerHTML = `<input type="text" class="note-item-input" value="${escapeQuotes(text)}"/><i class="material-icons red-text">delete</i>`;

      note.querySelector('input').addEventListener('focus', (e) => {
        note.classList.add('focused');
      });
      note.querySelector('input').addEventListener('blur', (e) => {
        note.classList.remove('focused');

        let newVal = e.target.value;

        if (newVal == "") {
          this.removeNote(id);
        } else {
          this.updateNote(id, newVal);
        }

      });
      note.querySelector('input').addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
          note.querySelector('input').blur();
        }
      });

      note.querySelector('i.material-icons').addEventListener('click', (e) => {
        this.removeNote(id);
      });

      this.__n.list.appendChild(note);

      return {node: note, id};
    }

    updateNote(id, text) {
      this.__updateCallback({id, text});
    }

    removeNote(id, doCallback = true) {
      let note = this.getNote(id);

      if (id === undefined) return;

      note.node.classList.add("removed");

      setTimeout(() => {
        this.__n.list.removeChild(note.node);
      }, 500);

      if (doCallback === true) {
        this.__removeCallback({id});
      }
    }

    getNote(id) {
      return this.notes.find(x => x.id == id);
    }

    externalUpdate({id, text}) {
      let n = this.getNote(id);

      if (n === undefined) {
        n = this.newNote(text, id);
        this.notes.push(n);
      } else {
        n.node.querySelector('input').value = text;
      }
    }
  }

  window.Notepad = Notepad;

})()

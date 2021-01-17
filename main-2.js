// Wrap all our content in an IIFE to avoid leaks
(function () {

// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const h = require('react-hyperscript');
const ReactDOM = require('react-dom');

// Model singleton
function createStore() {
  return {
    // DEV: We use keys instead of array index as we want to associate it loosely (e.g. different shortcuts)
    locations: [
      {key: '1', name: 'Room 1',  },
      {key: '2', name: 'Room 2',  },
      {key: '3', name: 'Room 3',  },
      {key: '4', name: 'Room 4',  },
      {key: '5', name: 'Hallway', },
      {key: '6', name: 'Kitchen', },
      {key: '7', name: 'Bathroom',},
      {key: '8', name: '',        },
      {key: '9', name: '',        },
      {key: '0', name: '',        },
    ],
    images: Array(44).fill(true).map((_, i) => {
      let img = {key: i.toString(), src: `big-photos/${i}.jpg`, locationKey: null};
      if (i === 3) { img.locationKey = '1'; }
      if (i === 5) { img.locationKey = '2'; }
      if (i === 7) { img.locationKey = '3'; }
      if (i === 20) { img.locationKey = '4'; }
      return img;
    }),
    currentImageIndex: 0,
    getLocationKeys: function () {
      return this.locations.map((location) => location.key);
    },
    getCurrentImage: function () {
      return this.images[this.currentImageIndex];
    },

    previousImage: function () {
      this.currentImageIndex = this.currentImageIndex - 1;
      if (this.currentImageIndex < 0) { this.currentImageIndex = this.images.length - 1; }
    },
    nextImage: function () {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    },
    goToFirstLocationImage: function (locationKey) {
      let firstLocationImageIndex = this.images.findIndex((img) => img.locationKey === locationKey);
      if (firstLocationImageIndex !== -1) {
        this.currentImageIndex = firstLocationImageIndex;
      }
    },
    goToImage: function (index) {
      assert(index >= 0 && index < this.images.length, `Index ${index} out of \`this.images\` range`);
      assert(!isNaN(index), `Index is NaN`);
      this.currentImageIndex = index;
    },
    setLocationForCurrentImage: function (locationKey) {
      let locationKeys = this.getLocationKeys();
      assert(locationKeys.includes(locationKey), `Location ${locationKey} isn't within locations`);
      this.getCurrentImage().locationKey = locationKey;
      this.nextImage();
    },
    setLocationName: function (locationKey, name) {
      let location = this.locations.find((location) => location.key === locationKey);
      location.name = name;
    },

    resetStore: function () {
      Store = createStore();
    },
    rr /* run and render */: function (method, /* args */) {
      // Run our logic
      let args = [].slice.call(arguments, 1);
      this[method].apply(this, args);
      render();

      // Serialize and save our state
      localStorage.stateBackup = JSON.stringify({
        locations: this.locations,
        images: this.images,
        version: 'v1',
        timestamp: Date.now(),
      });
    }
  };
}
let Store = createStore();
window.Store = Store;

// Load in our saved state
// TODO: Figure out how to identify different sets of content
// TODO: Set up ability for user to clear their own cache
if (localStorage.stateBackup) {
  let _loadedState = JSON.parse(localStorage.stateBackup);
  Store.locations = _loadedState.locations;
  Store.images = _loadedState.images;
  Store.currentImageIndex = _loadedState.images.findIndex((img) => img.locationKey === null);
  if (Store.currentImageIndex === -1) { Store.currentImageIndex = 0; }

  console.info('Loaded state from `localStorage`. To delete backup, run: `delete localStorage.stateBackup; Store.rr(\'resetStore\');`');
}

// Define our main page load hook
function main() {
  let reactContainer = document.getElementById('react-content');
  if (!reactContainer) { throw new Error('Unable to find #react-content'); }

  //- TODO: Should use `this.props` instead of `Store` for content
  ReactDOM.render(
    h('.container', [
      h('.row', [
        h('.col-12', [
          h('h1', 'real-estate-layout-tool'),
          h('p', 'We\'ll create a blueprint layout with grouped images, at up to 10 locations, in 3 steps'),
          //- ol
          //-   li Upload and categorize image with location
          //-   li Upload blueprint image from external tool
          //-   li Associate locations with blueprint image
          h('.mb-3', [
            h('.progress', {style: {height: '1.5rem'}}, [
              h('.progress-bar', {role: 'progressbar', style: {width: '33%'}}, '1 - Categorize images'),
              //- TODO: Build better `.muted` for progressbar
              h('.progress-bar', {role: 'progressbar', style: {width: '33%', backgroundColor: 'transparent', color: 'black', opacity: '40%'}}, '2 - Upload blueprint'),
              h('.progress-bar', {role: 'progressbar', style: {width: '34%', backgroundColor: 'transparent', color: 'black', opacity: '40%'}}, '3 - Assocate blueprint'),
            ])
          ])
        ])
      ]),
      h('.row', [
        h('.col-12', [
          h('h3', 'Associate uploaded images with locations')
        ])
      ]),
      h('.row', [
        h('.col-12',
          (() => {
            function createInput(location) {
              return h('.col-2', {key: location.key}, [
                h('.input-group', [
                  h('.input-group-prepend', [
                    h('span', {
                      className: `input-group-text location-${location.key}-bg`,
                      role: 'button',
                      onClick: () => { Store.rr('setLocationForCurrentImage', location.key); },
                    }, location.key),
                  ]),
                  h('input.form-control', {
                    type: 'text', value: location.name,
                    onFocus: (evt) => { Store.rr('goToFirstLocationImage', location.key); },
                    onChange: (evt) => { Store.rr('setLocationName', location.key, evt.target.value); },
                    'aria-label': `Location name ${location.key}`
                  }),
                ])
              ]);
            }
            assert(Store.locations.length === 10, `Expected 10 locations but received ${Store.locations.length}`);
            return [
              h('.row.mb-3',
                Store.locations.slice(0, 5).map(createInput)
              ),
              h('.row.mb-3',
                Store.locations.slice(5, 10).map(createInput)
              )
            ];
          })()
        )
      ]),
      h('.row', [
        h('.col-6', [
          h('div', 'Type or press location number to categorize image'),
          h('p', [
            h('img.img-fluid', {src: Store.getCurrentImage().src, alt: 'Actively selected photo'})
          ]),

          h('p', [
            'or ',
            h('button.btn.btn-secondary', {onClick: () => { Store.rr('nextImage'); }}, 'skip to next image'),
            h('span.text-muted', ' (shortcut: s)'),
          ])
        ])
      ]),
      h('.row',
        Store.images.map((img, i) => {
          return h('.col-1.mb-1', [
            //- DEV: We use a `div` as `::before` doesn't seem to work great with `img`
            h('div', {
              key: i,
              className: classnames({
                'selected-image': i === Store.currentImageIndex,
              }, img.locationKey ? `location-img location-${img.locationKey}-img` : '')
            }, [
              h('img.img-fluid', {
                src: img.src,
                role: 'button',
                alt:`Photo ${i} thumbnail`,
                onClick: () => { Store.rr('goToImage', i); }
              })
            ])
          ]);
        })
      ),
      h('.row', [
        h('.col-12', [
          h('.text-right', [
            h('p', [
              h('button.btn.btn-primary', 'Continue'),
              h('br'),
              h('em.text-muted.small', `Uncategorized images (${
                Store.images.filter((img) => !img.locationKey).length
              }) will be omitted`),
            ])
          ])
        ])
      ]),
    ]),
    reactContainer
  );
}
// DEV: We could use `DOMContentLoaded` hook but our script location is good enough
main();
// Alias `main` to `render`
let render = main;

// View hooks
// When a key is pressed
// TODO: When move to another window, unbind (prob do via `componentDidMount` and `componentWillUnmount` mechanisms)
window.addEventListener('keydown', (evt) => {
  // If the event is for an input, then stop
  // https://github.com/ccampbell/mousetrap/blob/1.6.5/mousetrap.js#L973-L1001
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(evt.target.tagName)) {
    return;
  }

  // Compare to known shortcuts
  // Location numbers
  if (Store.getLocationKeys().includes(evt.key)) {
    Store.rr('setLocationForCurrentImage', evt.key);
  // Skipping shortcut
  } else if (evt.key === 's') {
    Store.rr('nextImage');
  // Arrow keys
  } else if (evt.key === 'ArrowLeft') {
    Store.rr('previousImage');
  } else if (evt.key === 'ArrowRight') {
    Store.rr('nextImage');
  }
});

// End of IIFE
}());

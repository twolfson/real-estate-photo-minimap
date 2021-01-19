// Load in our dependencies
const assert = require('assert');
const config = require('./config');
let demoData = require('../../data/demo.json');

// Reset data in development
// DEV: `if` check is to prevent this from ever leaking into production
// if (config.persistData) {
//   localStorage.stateBackup =  JSON.stringify({state: require('../../backups/1376-natoma-with-sort-and-new-names.json')});
// }

// Model singleton
// DEV: Inspired by Redux but not explicitly Redux due to learning overhead
// DEV: state is a separate variable for easy/quick reference
let state = {
  // DEV: We use keys instead of array index as we want to associate it loosely (e.g. different shortcuts)
  locations: [
    {key: '1', name: 'Room 1',   },
    {key: '2', name: 'Room 2',   },
    {key: '3', name: 'Room 3',   },
    {key: '4', name: 'Room 4',   },
    {key: '5', name: 'Hallway',  },
    {key: '6', name: 'Kitchen',  },
    {key: '7', name: 'Bathroom', },
    {key: '8', name: '',         },
    {key: '9', name: '',         },
    {key: '0', name: '',         },
  ],
  images: demoData.map((src, i) => {
    let img = {key: i.toString(), src: src, locationKey: null};
    return img;
  }),
  currentImageIndex: 0,
};
let Store = {
  // Allow external context to set render callback
  _renderFn: null,

  // Re-expose state for quick access publicly
  state: state,
  // TODO: Ditch `get` methods once migrated to `setState` model
  get locations() {
    return this.state.locations;
  },
  get images() {
    return this.state.images;
  },
  get currentImageIndex() {
    return this.state.currentImageIndex;
  },

  // Define our helper methods
  getLocationKeys: function () {
    return state.locations.map((location) => location.key);
  },
  getCurrentImage: function () {
    return state.images[state.currentImageIndex];
  },

  previousImage: function () {
    state.currentImageIndex = state.currentImageIndex - 1;
    if (state.currentImageIndex < 0) { state.currentImageIndex = state.images.length - 1; }
  },
  nextImage: function () {
    state.currentImageIndex = (state.currentImageIndex + 1) % state.images.length;
  },
  goToFirstLocationImage: function (locationKey) {
    let firstLocationImageIndex = state.images.findIndex((img) => img.locationKey === locationKey);
    if (firstLocationImageIndex !== -1) {
      state.currentImageIndex = firstLocationImageIndex;
    }
  },
  goToImage: function (index) {
    assert(index >= 0 && index < state.images.length, `Index ${index} out of \`state.images\` range`);
    assert(!isNaN(index), `Index is NaN`);
    state.currentImageIndex = index;
  },
  setLocationForCurrentImage: function (locationKey) {
    let locationKeys = this.getLocationKeys();
    assert(locationKeys.includes(locationKey), `Location ${locationKey} isn't within locations`);
    this.getCurrentImage().locationKey = locationKey;
    this.nextImage();
  },
  setLocationName: function (locationKey, name) {
    let location = state.locations.find((location) => location.key === locationKey);
    location.name = name;
  },

  rr /* run and render */: function (method, /* args */) {
    // Run our logic
    let args = [].slice.call(arguments, 1);
    this[method].apply(this, args);
    assert(this._renderFn, 'Store._renderFn was never set');
    this._renderFn();

    // Serialize and save our state
    if (config.persistData) {
      localStorage.stateBackup = JSON.stringify({
        state: this.state,
        version: 'v1',
        timestamp: Date.now(),
      });
    }
  }
};
window.Store = Store; // Expose for debugging/practicality

// Load in our saved state
// TODO: Use distinct key for each minimap (part of CRUD build)
// TODO: Set up ability for user to clear their own cache (would be deletion in CRUD)
if (config.persistData && localStorage.stateBackup) {
  let _loadedState = JSON.parse(localStorage.stateBackup).state;
  Store.locations = _loadedState.locations;
  Store.images = _loadedState.images;
  Store.currentImageIndex = _loadedState.images.findIndex((img) => img.locationKey === null);
  if (Store.currentImageIndex === -1) { Store.currentImageIndex = 0; }

  // eslint-disable-next-line no-console
  console.info('Loaded state from `localStorage`. ' +
    'To delete backup, run: `delete localStorage.stateBackup; window.refresh()`');
}

// Expose our store
module.exports = Store;

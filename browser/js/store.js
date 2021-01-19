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
// DEV: state and actions are separate variables for easy/quick reference
// DEV: Consider `actions` as setters and `Store` as container for getters
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

let actions = {
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
    let locationKeys = helpers.getLocationKeys();
    assert(locationKeys.includes(locationKey), `Location ${locationKey} isn't within locations`);
    helpers.getCurrentImage().locationKey = locationKey;
    actions.nextImage();
  },
  setLocationName: function (locationKey, name) {
    let location = state.locations.find((location) => location.key === locationKey);
    location.name = name;
  }
};

// Define our helper methods
let helpers = {
  get locations() {
    return state.locations;
  },
  get images() {
    return state.images;
  },
  get currentImageIndex() {
    return state.currentImageIndex;
  },
  getLocationKeys: function () {
    return state.locations.map((location) => location.key);
  },
  _getCurrentImage: function () {
    return state.images[state.currentImageIndex];
  },
  // TODO: Add in freezing for this data
  getCurrentImage: function () { return helpers._getCurrentImage(); },
};

let Store = {
  // Allow external context to set render callback
  _renderFn: null,

  // Re-expose state and actions for quick access publicly
  __state: state,
  __actions: actions,
  __helpers: helpers,

  // Define our helper methods
  // TODO: Ditch helper methods once migrated to `setState` model
  get locations() {
    return state.locations;
  },
  get images() {
    return state.images;
  },
  get currentImageIndex() {
    return state.currentImageIndex;
  },
  getLocationKeys: function () {
    return state.locations.map((location) => location.key);
  },
  _getCurrentImage: function () {
    return state.images[state.currentImageIndex];
  },
  // TODO: Add in freezing for this data
  getCurrentImage: function () { return helpers._getCurrentImage(); },

  // Define our action interfaces
  _renderState: null,
  regenerateRenderState: function () {
    this._renderState = Object.assign({}, state, helpers);
    return this._renderState;
  },
  run: function (method, /* args */) {
    let args = [].slice.call(arguments, 1);
    return actions[method].apply(actions, args);
  },
  rr /* run and render */: function () {
    // Run our logic
    this.run.apply(this, arguments);
    assert(this._renderFn, 'Store._renderFn was never set');
    this._renderFn(this.regenerateRenderState());

    // Serialize and save our state
    if (config.persistData) {
      localStorage.stateBackup = JSON.stringify({
        state: state,
        version: 'v1',
        timestamp: Date.now(),
      });
    }
  }
};
Store.regenerateRenderState();
window.Store = Store; // Expose for debugging/practicality

// Load in our saved state
// TODO: Use distinct key for each minimap (part of CRUD build)
// TODO: Set up ability for user to clear their own cache (would be deletion in CRUD)
if (config.persistData && localStorage.stateBackup) {
  let _loadedState = JSON.parse(localStorage.stateBackup).state;
  state = _loadedState;
  Store.regenerateRenderState();

  // eslint-disable-next-line no-console
  console.info('Loaded state from `localStorage`. ' +
    'To delete backup, run: `delete localStorage.stateBackup; window.refresh()`');
}

// Expose our store
module.exports = Store;

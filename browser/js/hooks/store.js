// Load in our dependencies
const assert = require('assert');
const config = require('../config');
const cloneDeep = require('lodash.clonedeep');
const deepFreeze = require('deep-freeze');
const zustand = require('zustand').default;
let demoData = require('../../../data/demo.json');

// Reset data in development
// DEV: `if` check is to prevent this from ever leaking into production
/* eslint-disable max-len */
// if (config.persistData) {
//   localStorage.stateBackup =  JSON.stringify({state: require('../../backups/1376-natoma-with-sort-and-new-names.json')});
// }
/* eslint-enable max-len */

// Build our initial Zustand store
let _useStore = zustand(function (setState, getState) {
  return {
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
    minimap: null,
    currentImageIndex: 0,

    // Actions
    goToFirstLocationImage: function (locationKey) {
      return setState((state) => {
        let firstLocationImageIndex = state.images.findIndex((img) => img.locationKey === locationKey);
        if (firstLocationImageIndex !== -1) {
          return { currentImageIndex: firstLocationImageIndex };
        }
      });
    },
  /*
  goToImage: function (index) {
    assert(index >= 0 && index < state.images.length, `Index ${index} out of \`state.images\` range`);
    assert(!isNaN(index), `Index is NaN`);
    state.currentImageIndex = index;
  },
  */
    nextImage: function () {
      return setState((state) => {
        return { currentImageIndex: (state.currentImageIndex + 1) % state.images.length };
      });
    },
  /*
  previousImage: function () {
    state.currentImageIndex = state.currentImageIndex - 1;
    if (state.currentImageIndex < 0) { state.currentImageIndex = state.images.length - 1; }
  },
  populateMinimap: function () {
    // If we already have minimap info, then do nothing
    if (state.minimap) {
      return;
    }
    state.minimap = {
      // console.log(JSON.stringify(Store._renderState.minimap.floorplan))
      floorplan: {"corners":{"1":{"x":1023.747,"y":378.46},"2":{"x":1226.947,"y":378.46},"3":{"x":1226.947,"y":174.041},"4":{"x":1023.747,"y":174.041}},"walls":[{"corner1":"4","corner2":"1"},{"corner1":"1","corner2":"2"},{"corner1":"2","corner2":"3"},{"corner1":"3","corner2":"4"}]}, // eslint-disable-line
      textLabels: state.locations.map((location, i) => {
        return {
          // console.log(JSON.stringify(Store._renderState.minimap.textLabels[0]))
          // console.log(JSON.stringify(Store._renderState.minimap.textLabels[1]))
          locationKey: location.key,
          x: (i === 0) ? 1088 : 2023, // cm
          y: (i === 0) ? 250 : (i - 1) * 64 + 16, // cm
        };
      })
    };
  },
  sortImagesByLocationKey: function () {
    // DEV: All browsers except IE stable sort, this is prob good enough -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    state.images.sort((imgA, imgB) => {
      if (imgB.locationKey === imgA.locationKey) { return 0; }
      if (imgA.locationKey === null *//* and thus B isn't null *//*) { return  1; }
      if (imgB.locationKey === null *//* and thus A isn't null *//*) { return -1; }
      if (imgA.locationKey < imgB.locationKey) { return -1; }
      if (imgA.locationKey > imgB.locationKey) { return  1; }
      throw new Error('Unexpected comparison case');
    });
  },
  */
    setLocationForCurrentImage: function (locationKey) {
      return setState((state) => {
        let locationKeys = state.getLocationKeys();
        assert(locationKeys.includes(locationKey), `Location ${locationKey} isn't within locations`);
        state.getCurrentImage().locationKey = locationKey;
        state.nextImage();
      });
    },
    setLocationName: function (locationKey, name) {
      return setState((state) => {
        console.log('wat', state.locations[0]);
        let location = state.locations.find((location) => location.key === locationKey);
        location.name = name;
      });
    },
  /*
  updateMinimap: function (data) {
    Object.assign(state.minimap, data);
  }
  */

    // Helper getters
    getLocationKeys: function () {
      return getState().locations.map((location) => location.key);
    },

    getCurrentImage: function () {
      let state = getState();
      return state.images[state.currentImageIndex];
    },
  };
});
exports.useStore = function () {
  // Proxy Zustand to guarantee no accidental mutations (e.g. `.sort()`)
  let state = _useStore.apply(this, arguments);
  return deepFreeze(cloneDeep(state));
};

/*
let Store = {
  // Allow external context to set render callback
  _renderFn: null,

  // Re-expose state and actions for quick access publicly
  __state: state,
  __actions: actions,
  __helpers: helpers,

  // Define our action interfaces
  _renderState: null,
  regenerateRenderState: function () {
    helperState = Object.assign({}, state, helpers);
    this._renderState = deepFreeze(cloneDeep(helperState));
    return this._renderState;
  },
  run: function (method, *//* args *//*) {
    let args = [].slice.call(arguments, 1);
    assert(actions.hasOwnProperty(method), `Unknown action ${method}`);
    actions[method].apply(actions, args);
    this.regenerateRenderState();
  },
  rr *//* run and render *//*: function () {
    // Run our logic
    this.run.apply(this, arguments);
    assert(this._renderFn, 'Store._renderFn was never set');
    this._renderFn(this._renderState);

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
*/

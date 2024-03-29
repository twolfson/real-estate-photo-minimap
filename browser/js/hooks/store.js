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

// Build our Zustand store
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
    goToImage: function (index) {
      return setState((state) => {
        assert(index >= 0 && index < state.images.length, `Index ${index} out of \`state.images\` range`);
        assert(!isNaN(index), `Index is NaN`);
        state.currentImageIndex = index;
      });
    },
    nextImage: function () {
      return setState((state) => {
        state.currentImageIndex = (state.currentImageIndex + 1) % state.images.length;
      });
    },
    previousImage: function () {
      return setState((state) => {
        state.currentImageIndex = state.currentImageIndex - 1;
        if (state.currentImageIndex < 0) { state.currentImageIndex = state.images.length - 1; }
      });
    },
    _populateMinimap: function (state) {
      // If we already have minimap info, then do nothing
      if (state.minimap) {
        return;
      }
      state.minimap = {
        // console.log(JSON.stringify(state.minimap.floorplan))
        floorplan: {"corners":{"1":{"x":1023.747,"y":378.46},"2":{"x":1226.947,"y":378.46},"3":{"x":1226.947,"y":174.041},"4":{"x":1023.747,"y":174.041}},"walls":[{"corner1":"4","corner2":"1"},{"corner1":"1","corner2":"2"},{"corner1":"2","corner2":"3"},{"corner1":"3","corner2":"4"}]}, // eslint-disable-line
        textLabels: state.locations.map((location, i) => {
          return {
            // console.log(JSON.stringify(state.minimap.textLabels[0]))
            // console.log(JSON.stringify(state.minimap.textLabels[1]))
            locationKey: location.key,
            x: (i === 0) ? 1088 : 2023, // cm
            y: (i === 0) ? 250 : (i - 1) * 64 + 16, // cm
          };
        })
      };
    },
    _sortImagesByLocationKey: function (state) {
      // DEV: All browsers except IE stable sort, this is prob good enough -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      state.images.sort((imgA, imgB) => {
        if (imgB.locationKey === imgA.locationKey) { return 0; }
        if (imgA.locationKey === null /* and thus B isn't null */) { return  1; }
        if (imgB.locationKey === null /* and thus A isn't null */) { return -1; }
        if (imgA.locationKey < imgB.locationKey) { return -1; }
        if (imgA.locationKey > imgB.locationKey) { return  1; }
        throw new Error('Unexpected comparison case');
      });
    },
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
        let location = state.locations.find((location) => location.key === locationKey);
        location.name = name;
      });
    },
    updateMinimap: function (data) {
      return setState((state) => {
        Object.assign(state.minimap, data);
      });
    },

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

// Persistence bindings
// Serialize and save our state
if (config.persistData) {
  _useStore.subscribe(function (state) {
    localStorage.stateBackup = JSON.stringify({
      state: state,
      version: 'v1',
      timestamp: Date.now(),
    });
  });
}

// Load in our saved state
// TODO: Use distinct key for each minimap (part of CRUD build)
// TODO: Set up ability for user to clear their own cache (would be deletion in CRUD)
if (config.persistData && localStorage.stateBackup) {
  let _loadedState = JSON.parse(localStorage.stateBackup).state;
  _useStore.setState(_loadedState);

  // eslint-disable-next-line no-console
  console.info('Loaded state from `localStorage`. ' +
    'To delete backup, run: `delete localStorage.stateBackup; window.refresh()`');
}

// Perform our exports
exports.useStore = function () {
  // Proxy Zustand to guarantee no accidental mutations (e.g. `.sort()`)
  // DEV: This would appear if we updated a value async from the `render` call
  //   but also can update state without hitting `hooks/store` which is a code smell
  //   See: https://github.com/twolfson/real-estate-photo-minimap/blob/c5b41c0b67cbb4260e96d586f907d78df3cf987b/browser/js/pages/CategorizePhotos.jsx#L11-L13
  let state = _useStore.apply(this, arguments);
  return deepFreeze(cloneDeep(state));
};
exports._useUnfrozenStore = _useStore;

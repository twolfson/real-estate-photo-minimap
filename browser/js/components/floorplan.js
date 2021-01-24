// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');

// A lot of the content in this file is copy/paste/modify from `example` in `blueprint3d
// https://github.com/twolfson/blueprint3d/tree/90d33027ab67c456acd769cfeb38bbdee42e092d/example

// DEV: We tried loading SCSS via fancy `import` call but ran into issues, going for simpler way
const locationColorsScss = require('fs').readFileSync(__dirname + '/../../css/_location-colors.scss', 'utf8');
let data = {};
for (match of locationColorsScss.matchAll(/\$(location-\d+-bg): ([^;]+);/g)) { data[match[1]] = match[2]; }
for (match of locationColorsScss.matchAll(/\$(location-\d+-fg): ([^;]+);/g)) { data[match[1]] = match[2]; }
assert.strictEqual(Object.keys(data).length, 20, 'Missing keys imported from `locationColorsScss`');

// Vendor dependencies
// https://github.com/twolfson/blueprint3d/blob/90d33027ab67c456acd769cfeb38bbdee42e092d/example/index.html#L10-L15
window.THREE = require('three.js');
window.$ = require('blueprint3d/example/js/jquery.js');
void require('blueprint3d/example/js/blueprint3d.js');

// Helper functions
const bootstrapIcon = (svgStr, style) => {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16',
    fill: 'currentColor', viewBox: '0 0 16 16',
    style: style || null,
  }, [
    h('path', {fillRule: "evenodd", d: svgStr}),
  ]);
};

// Define our component
class Floorplan extends React.Component {
  render() {
    return h('#floorplanner', {
      style: {position: 'absolute', height: '100%', width: '100%'},
    }, [
      h('canvas#floorplanner-canvas'),
      h('#floorplanner-controls', [
        h('div', [
          h('button#move.btn.btn-sm.btn-outline-secondary.mb-1.text-left', {
            style: {minWidth: '120px'}
          }, [
            // https://icons.getbootstrap.com/icons/arrows-move/
            bootstrapIcon('M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z'),
            '\xA0\xA0Move'
          ]),
        ]),
        h('div', [
          h('button#draw.btn.btn-sm.btn-outline-secondary.mb-1.text-left', {
            style: {minWidth: '120px'}
          }, [
            // https://icons.getbootstrap.com/icons/pencil-fill/
            bootstrapIcon(
              'M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z',
              {marginTop: '-2px'}
            ),
            '\xA0\xA0Draw/split'
          ]),
        ]),
        h('div', [
          h('button#delete.btn.btn-sm.btn-outline-secondary.mb-1.text-left', {
            style: {minWidth: '120px'}
          }, [
            // https://icons.getbootstrap.com/icons/eraser-fill/
            bootstrapIcon('M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z'),
            '\xA0\xA0Delete'
          ]),
        ]),
      ]),
      h('#draw-walls-hint', 'Press the "Esc" key to stop drawing walls'),
    ]);
  }

  componentDidMount() {
    // Create teardown callbacks
    var destroyCallbacks = [];
    this.destroy = () => {
      destroyCallbacks.forEach((fn) => fn());
      destroyCallbacks = null;
      delete this.destroy;
    };

    // Based on: https://github.com/twolfson/blueprint3d/blob/ba841406daeacc294ace175876bf5b36b70845b3/example/js/example.js
    /*
     * Floorplanner controls
     */
    var ViewerFloorplanner = function(blueprint3d) {

      var canvasWrapper = '#floorplanner';

      // buttons
      var move = '#move';
      var remove = '#delete';
      var draw = '#draw';

      var activeStlye = 'btn-primary disabled';

      this.floorplanner = blueprint3d.floorplanner;

      var scope = this;
      function init() {

        $( window ).on('resize', scope.handleWindowResize);
        destroyCallbacks.push(function () {
          $( window ).off('resize', scope.handleWindowResize);
        });
        scope.handleWindowResize();

        // mode buttons
        scope.floorplanner.modeResetCallbacks.add(function(mode) {
          $(draw).removeClass(activeStlye);
          $(remove).removeClass(activeStlye);
          $(move).removeClass(activeStlye);
          if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
              $(move).addClass(activeStlye);
          } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
              $(draw).addClass(activeStlye);
          } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
              $(remove).addClass(activeStlye);
          }

          if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
            $('#draw-walls-hint').show();
            scope.handleWindowResize();
          } else {
            $('#draw-walls-hint').hide();
          }
        });

        $(move).on('click', function(){
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
        });
        $(draw).on('click', function(){
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        });
        $(remove).on('click', function(){
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
        });
        destroyCallbacks.push(function () {
          $(move).off('click');
          $(draw).off('click');
          $(remove).off('click');
        });
      }

      this.updateFloorplanView = function() {
        scope.floorplanner.reset();
      }

      this.handleWindowResize = function() {
        // Disabled: Resizing to full window height
        // $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
        scope.floorplanner.resizeView();
      };

      init();
    };

    // main setup
    var opts = {
      containerElement: 'floorplanner',
      floorplannerElement: 'floorplanner-canvas',
      threeElement: '#viewer',
      threeCanvasElement: 'three-canvas',
      textureDir: 'models/textures/',
      widget: false
    }
    // There is no `destroy` function yet (noted as a README task)
    var blueprint3d = this.blueprint3d = new window.BP3D.Blueprint3d(opts);
    window.blueprint3d = blueprint3d;

    var viewerFloorplanner = this.viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
    viewerFloorplanner.updateFloorplanView();
    viewerFloorplanner.handleWindowResize();
    blueprint3d.model.floorplan.update();

    // This serialization format needs work
    // Load a simple rectangle room
    // blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
    // Another model option: https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/example/js/example.js#L472

    // Load our custom small rectangle
    // console.log(blueprint3d.model.exportSerialized())
    // blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":330.8349999999999,"y":144.77999999999994},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":534.0350000000002,"y":144.77999999999994},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":534.0350000000002,"y":-59.639212402343716},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":330.8349999999999,"y":-59.639212402343716}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
    let floorplanDataStr = '{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":330.8349999999999,"y":144.77999999999994},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":534.0350000000002,"y":144.77999999999994},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":534.0350000000002,"y":-59.639212402343716},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":330.8349999999999,"y":-59.639212402343716}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}';
    let floorplanData = JSON.parse(floorplanDataStr);
    let floorplan = floorplanData.floorplan;

    // Scrub unused data
    floorplan.walls.forEach((wall) => {
      delete wall.frontTexture;
      delete wall.backTexture;
    });
    delete floorplan.wallTextures;
    delete floorplan.floorTextures;
    delete floorplan.newFloorTextures;

    // Shorten UUIDs
    let corners = floorplan.corners;
    let cornerKeyMap = {};
    let newCorners = {};
    let counter = 1;
    for (let oldKey of Object.keys(corners)) {
      let newKey = cornerKeyMap[oldKey] = counter.toString();
      counter += 1;
      newCorners[newKey] = corners[oldKey];
    }
    corners = floorplan.corners = newCorners;
    floorplan.walls.forEach((wall) => {
      if (wall.corner1) { wall.corner1 = cornerKeyMap[wall.corner1]; }
      if (wall.corner2) { wall.corner2 = cornerKeyMap[wall.corner2]; }
    });

    // Shorten length floats (e.g. 32.83499999 -> 32.835)
    for (let corner of Object.values(corners)) {
      corner.x = Math.round(corner.x * 1000)/1000;
      corner.y = Math.round(corner.y * 1000)/1000;
    }
    blueprint3d.model.loadSerialized(JSON.stringify({floorplan: floorplan, items: []}));

    window.floorplanner = blueprint3d.floorplanner; // Exposed for `TextLabel` requirement
    let labels = [
      {text: 'Room 1', background: '#0084ce', color: 'white'}, // Blue
      {text: 'Room 2', background: '#00b7f0', color: 'white'}, // Light blue
      {text: 'Room 3', background: '#95c2cc', color: 'white'}, // Dark green/blue
      {text: 'Room 4', background: '#f5ad03', color: 'white'}, // Orange
      {text: 'Room 5', background: '#e7222c', color: 'white'}, // Red
      {text: 'Room 6', background: '#35d0ac', color: 'white'}, // Light green
      {text: 'Room 7', background: '#07bb12', color: 'white'}, // Dark green
      {text: 'Room 8', background: '#fdf73f', color: 'black'}, // Yellow
      {text: 'Room 9', background: '#701d85', color: 'white'}, // Purple
      {text: 'Building Hallway' /* Long name test */, background: '#fd5fda', color: 'white'}, // Pink
    ];
    // TODO: Use true state
    let trueLabels = Store._renderState.locations;
    labels.forEach((labelData, i) => {
      var x, y;
      if (i === 0) {
        x = 396; // cm
        y = 20; // cm
      } else {
        x = 1330; // cm
        y = (i-1) * 64 - 240; // cm
      }
      if (!trueLabels[i].name) { return; }
      blueprint3d.model.floorplan.newTextLabel(
        x,
        y,
        trueLabels[i].name,
        labelData.background,
        labelData.color);
    });
    blueprint3d.model.floorplan.update();
    blueprint3d.model.floorplan.roomLoadedCallbacks.fire();

    // When anyone interacts with our floorplan (though not on drag)
    let saveState = () => {
      // DEV: It's okay that the data is serialized as a string, as this isolates state contamination with the floorplan
      let floorplanDataStr = blueprint3d.model.exportSerialized();
      let floorplanData = JSON.parse(floorplanDataStr);
      let floorplan = floorplanData.floorplan;

      // Scrub unused data
      floorplan.walls.forEach((wall) => {
        delete wall.frontTexture;
        delete wall.backTexture;
      });
      delete floorplan.wallTextures;
      delete floorplan.floorTextures;
      delete floorplan.newFloorTextures;

      // Shorten UUIDs
      // DEV: We can't mutate our object in place as keys might be the same
      let corners = floorplan.corners;
      let cornerKeyMap = {};
      let newCorners = {};
      let counter = 1;
      for (let oldKey of Object.keys(corners)) {
        let newKey = cornerKeyMap[oldKey] = counter.toString();
        counter += 1;
        newCorners[newKey] = corners[oldKey];
      }
      corners = floorplan.corners = newCorners;
      floorplan.walls.forEach((wall) => {
        if (wall.corner1) { wall.corner1 = cornerKeyMap[wall.corner1]; }
        if (wall.corner2) { wall.corner2 = cornerKeyMap[wall.corner2]; }
      });

      // Shorten length floats (e.g. 32.83499999 -> 32.835)
      for (let corner of Object.values(corners)) {
        corner.x = Math.round(corner.x * 1000)/1000;
        corner.y = Math.round(corner.y * 1000)/1000;
      }

      console.log(JSON.stringify(floorplan));
    };
    $('#' + opts.containerElement).on('mousedown', saveState);
    $('#' + opts.containerElement).on('mouseup', saveState);
    saveState();
  }
  componentWillUnmount() {
    this.destroy();
    delete window.blueprint3d;
    delete this.blueprint3d;
    delete this.viewerFloorplanner;
  }
}
module.exports = Floorplan;

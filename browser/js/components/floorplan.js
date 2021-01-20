// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');

// Vendor dependencies
// TODO: Relocate the entire construction of blueprint3d into its own file
// https://github.com/twolfson/blueprint3d/blob/90d33027ab67c456acd769cfeb38bbdee42e092d/example/index.html#L10-L15
const THREE = require('three.js');
const jQuery = require('blueprint3d/example/js/jquery.js');

const bootstrapIcon = (svgStr, style) => {
  return h('svg', {
    xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
    fill: "currentColor", viewBox: "0 0 16 16",
    style: style || null,
  }, [
    h('path', {'fill-rule': "evenodd", d: svgStr}),
  ]);
};

// Define our component
class Floorplan extends React.Component {
  render() {
    return h('#floorplanner', {
      style: {position: 'relative', height: '300px'},
    }, [
      h('canvas#floorplanner-canvas'),
      h('#floorplanner-controls', [
        h('div', [
          h('button#move.btn.btn-sm.btn-outline-secondary.mb-1.text-left', {
            style: {minWidth: '120px'}
          }, [
            // https://icons.getbootstrap.com/icons/arrows-move/
            bootstrapIcon("M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"),
            '\xA0\xA0Move'
          ]),
        ]),
        h('div', [
          h('button#draw.btn.btn-sm.btn-outline-secondary.mb-1.text-left', {
            style: {minWidth: '120px'}
          }, [
            // https://icons.getbootstrap.com/icons/pencil-fill/
            bootstrapIcon(
              "M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z",
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
            bootstrapIcon("M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"),
            '\xA0\xA0Delete'
          ]),
        ]),
      ]),
      h('#draw-walls-hint', 'Press the "Esc" key to stop drawing walls'),
    ]);
  }

  componentDidMount() {
  }
  componentWillUnmount() {
    // Unmount logic goes here
  }
}
module.exports = Floorplan;

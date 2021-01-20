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

// Define our component
class Floorplan extends React.Component {
  render() {
    return h('#floorplanner', {
      style: {position: 'relative', height: '300px'},
    }, [
      h('canvas#floorplanner-canvas'),
      h('#floorplanner-controls', [
        h('button#move.btn.btn-sm.btn-outline-secondary.mr-1',   'Move walls/corners'),
        h('button#draw.btn.btn-sm.btn-outline-secondary.mr-1',   'Draw/split walls'),
        h('button#delete.btn.btn-sm.btn-outline-secondary.mr-1', 'Delete walls'),
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

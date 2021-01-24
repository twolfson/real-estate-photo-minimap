// Load in our dependencies
const assert = require('assert');
const Floorplan = require('./floorplan');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const Draggable = require('react-draggable');

// Define our component
class MinimapBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dragging: false};
  }

  render() {
    let parentState = this.props.state;
    let locations = parentState.locations;
    // DEV: Id is required for proper `mouseleave` tracking in Floorplan/Blueprint3D
    return h('div#floorplanner', {style: {position: 'relative', height: '300px'}}, [
      h(Floorplan),
    ]);
  }
}
module.exports = MinimapBuilder;

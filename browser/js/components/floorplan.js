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
    return h('div', {
      ref: (containerEl) => { this.containerEl = containerEl; },
      style: {position: 'relative', height: '300px'},
    }, [
      h('h1', 'hi')
    ]);
  }

  componentDidMount() {
    this.containerEl.textContent = 'yoooo';
    setTimeout(() => {
      this.setState({count: 1});
    }, 1000);
  }
  componentWillUnmount() {
    // Unmount logic goes here
  }
}
module.exports = Floorplan;

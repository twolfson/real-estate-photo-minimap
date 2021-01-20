// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const Draggable = require('react-draggable');
const { Resizable, ResizableBox } = require('react-resizable');

// Vendor dependencies
// TODO: Relocate the entire construction of blueprint3d into its own file
// https://github.com/twolfson/blueprint3d/blob/90d33027ab67c456acd769cfeb38bbdee42e092d/example/index.html#L10-L15
const THREE = require('three.js');
const jQuery = require('blueprint3d/example/js/jquery.js');

// Monkey patch resizable to work with draggable
//   https://github.com/STRML/react-resizable/issues/18
//   `div` not required, actually breaks things it seems
let _resizeHandler = Resizable.prototype.resizeHandler;
Resizable.prototype.resizeHandler = function () {
  let resultFn = _resizeHandler.apply(this, arguments);
  return function (e) {
    let result = resultFn.apply(this, arguments);
    e.stopPropagation();
    return result;
  };
};

// Define our component
class MinimapBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  render() {
    return h('div', {
      ref: (containerEl) => { this.containerEl = containerEl; },
      style: {position: 'relative', height: '300px'},
    }, [
      h('h1', 'hi' + this.state.count)
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
module.exports = MinimapBuilder;

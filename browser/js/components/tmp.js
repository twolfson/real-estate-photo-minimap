// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const Draggable = require('react-draggable');
const { Resizable, ResizableBox } = require('react-resizable');

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
    console.log('wat');
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

// Load in our dependencies
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');

// Fancy importing non-JS assets handling for demo
import blueprintSvgSrc from '../../../backups/1376-natoma.svg';

// Define our component
class MinimapBuilder extends React.Component {
  render() {
    return h('div', {...this.props}, [
      h('span', {style: {position: 'absolute'}}, 'Minimap builder goes here'),
      h('img', {src: blueprintSvgSrc, style: {maxHeight: '100%', margin: '0 auto'}})
    ]);
  }
}
module.exports = MinimapBuilder;

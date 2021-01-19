// Load in our dependencies
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');

// Fancy importing non-JS assets handling for demo
import blueprintSvgSrc from '../../../backups/1376-natoma.svg';

// Define our component
class MinimapBuilder extends React.Component {
  render() {
    let state = this.props.state;
    return h('div', {style: {position: 'relative', height: '300px'}}, [
      // h('span', {style: {position: 'absolute'}}, 'Minimap builder goes here'),
      // h('img', {src: blueprintSvgSrc, style: {maxHeight: '100%', margin: '0 auto'}}),
    ].concat(state.locations.filter((location) => location.name).map((location, i) => {
      let left = (i % 5) * 150;
      let top = Math.floor(i / 5) * 150;
      let width = 100;
      let height = 100;
      return h('div', {
        style: {
          // Vertical centering for span, https://css-tricks.com/centering-css-complete-guide/
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',

          border: '3px solid black',
          position: 'absolute', left, top,
          width, height,
        }
      }, [
        h('.d-inline-block.text-center', [
          h(`.d-inline-block.small.p-1.location-${location.key}-bg`, {
          }, location.name)
        ])
      ]);
    })));
  }
}
module.exports = MinimapBuilder;

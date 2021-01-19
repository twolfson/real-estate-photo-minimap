// Load in our dependencies
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const Draggable = require('react-draggable');
const { Resizable } = require('react-resizable');

// Fancy importing non-JS assets handling for demo
import blueprintSvgSrc from '../../../backups/1376-natoma.svg';

// https://github.com/STRML/react-grid-layout/blob/1.2.0/lib/GridItem.jsx#L642-L646
// Wrap in draggable as outer, then resizable as inner
// TODO: Move comment

// Define our component
class MinimapBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dragging: false};
  }

  render() {
    let locations = this.props.state.locations;
    return h('div', {style: {position: 'relative', height: '300px'}}, [
      // h('span', {style: {position: 'absolute'}}, 'Minimap builder goes here'),
      // h('img', {src: blueprintSvgSrc, style: {maxHeight: '100%', margin: '0 auto'}}),
    ].concat(locations.filter((location) => location.name).map((location, i) => {
      let left = (i % 5) * 150;
      let top = Math.floor(i / 5) * 150;
      let width = 100;
      let height = 100;
      return h(Draggable, {
        onStart: () => { this.setState({dragging: true}); },
        onStop: () => { this.setState({dragging: false}); },
      }, [
        h('div', {
          style: {
            // Vertical centering for span, https://css-tricks.com/centering-css-complete-guide/
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',

            // TODO: Bind `cursor: grabbing` on grabbing
            cursor: this.state.dragging ? 'grabbing' : 'grab',
            background: 'white',
            border: '3px solid black',
            position: 'absolute', left, top,
            width, height,
          }
        }, [
          h('.d-inline-block.text-center', [
            h(`.d-inline-block.small.p-1.location-${location.key}-bg`, {
            }, location.name)
          ])
        ])
      ]);
    })));
  }
}
module.exports = MinimapBuilder;

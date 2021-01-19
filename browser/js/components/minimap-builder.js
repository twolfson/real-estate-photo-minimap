// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const Draggable = require('react-draggable');
const { Resizable, ResizableBox } = require('react-resizable');

// Monkey patch resizable to work with draggable
let _resizeHandler = Resizable.prototype.resizeHandler;
Resizable.prototype.resizeHandler = function () {
  let resultFn = _resizeHandler.apply(this, arguments);
  return function (e) {
    let result = resultFn.apply(this, arguments);
    e.stopPropagation();
    return result;
  };
};

// Fancy importing non-JS assets handling for demo
// TODO: Remove SVG demo
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
    let parentState = this.props.state;
    let locations = parentState.locations;
    return h('div', {style: {position: 'relative', height: '300px'}}, [
      // h('span', {style: {position: 'absolute'}}, 'Minimap builder goes here'),
      // h('img', {src: blueprintSvgSrc, style: {maxHeight: '100%', margin: '0 auto'}}),
    ].concat((() => {
      let minimapContent = [];
      parentState.minimapInfo.boxes.forEach((box) => {
        // Generate box content depending on box type
        let content = null;
        if (box.type === 'location') {
          // Resolve our location
          let location = locations.find((location) => location.key === box.locationKey);
          assert(location, `Couldn't find location ${box.locationKey}`);

          // If the location is unused, skip it
          if (!location.name) {
            return;
          }

          // Otherwise, generate content
          content = h('.d-inline-block.text-center', [
            h(`.d-inline-block.small.p-1.location-${location.key}-bg`, {
            }, location.name)
          ]);
        } else {
          throw new Error(`Unexpected box type ${box.type}`);
        }

        // Render our box
        let {left, top, leftOffset, topOffset, width, height} = box;
        minimapContent.push(h(Draggable, {
          bounds: 'parent',
          positionOffset: {x: leftOffset, y: topOffset},
          onStart: () => { this.setState({dragging: true}); },
          onStop: (evt, ui) => {
            this.setState({dragging: false});
            Store.rr('updateMinimapBox', box.key, {leftOffset: ui.x, topOffset: ui.y});
          },
        }, [
          h(ResizableBox, {
            height, width,
            style: {
              // Vertical centering for span, https://css-tricks.com/centering-css-complete-guide/
              // TODO: Relocate all content to classes
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',

              cursor: this.state.dragging ? 'grabbing' : 'grab',
              background: 'white',
              border: '3px solid black',
              position: 'absolute', left, top,
            }
          }, [
            content
          ])
        ]));
      });
      return minimapContent;
    })()));
  }
}
module.exports = MinimapBuilder;

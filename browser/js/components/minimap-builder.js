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
      h('img', {src: blueprintSvgSrc, style: {position: 'absolute', maxHeight: '100%', margin: '0 auto'}}),
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
        let {left, top, width, height} = box;
        minimapContent.push(h(Draggable, {
          bounds: 'parent',
          position: {x: left, y: top},
          onStart: () => { this.setState({dragging: true}); },
          onDrag: (evt, data) => {
            // TODO: Move box to its own class and use temporary state until `onStop`
            //   Currently this is hammering `localStorage` -- also bad for UX
            Store.rr('updateMinimapBox', box.key, {left: data.x, top: data.y});
          },
          onStop: () => { this.setState({dragging: false}); },
        }, [
          h(ResizableBox, {
            height, width,
            onResizeStop: (evt, data) => {
              let {width, height} = data.size;
              Store.rr('updateMinimapBox', box.key, {width, height});
            },
            style: {
              // Vertical centering for span, https://css-tricks.com/centering-css-complete-guide/
              // TODO: Relocate all content to classes
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',

              cursor: this.state.dragging ? 'grabbing' : 'grab',
              background: 'white',
              border: '3px solid black',
              position: 'absolute',
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

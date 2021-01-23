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
    return h('div', {style: {position: 'relative', height: '300px'}}, [
      h(Floorplan),
      (() => {
        let minimapContent = [];
        parentState.minimapInfo.boxes.forEach((box, i) => {
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
          // https://github.com/STRML/react-grid-layout/blob/1.2.0/lib/GridItem.jsx#L642-L646
          // TODO: Create `MinimapBox` class as we're currently setting grabbing state on the whole builder
          // TODO: If we add more handles, then we need to figure out updating left/top appropriately
          let {left, top} = box;
          // let left, top;
          // if (i === 0) {
          //   left = 534;
          //   top = 131;
          // } else {
          //   left = 1005;
          //   top = 10 + (i-1) * 32;
          // }
          // Store.run('updateMinimapBox', box.key, {left, top});
          minimapContent.push(h(Draggable, {
            key: i,
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
            h('div', {
              style: {
                cursor: this.state.dragging ? 'grabbing' : 'grab',
                position: 'absolute',
              }
            }, [
              content
            ])
          ]));
        });
        return minimapContent;
      })()
    ]);
  }
}
module.exports = MinimapBuilder;

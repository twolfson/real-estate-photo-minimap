// Load in our dependencies
const assert = require('assert');
const config = require('../config');
const classnames = require('classnames');
const h = require('react-hyperscript');
const MinimapBuilder = require('../components/minimap-builder');
const React = require('react');
const ReactDOM = require('react-dom');
const Store = require('../store');
const {Link} = require('react-router-dom');

// Define our main page load hook
class MinimapBuild extends React.Component {
  constructor(props) {
    super(props);

    // Before handing off state, perform a synchronous sort on our data
    Store.run('sortImagesByLocationKey');
    Store.run('populateMinimap');

    // Perform normal constructor actions
    this.state = Store._renderState;
    Store._renderFn = this.setState.bind(this);
  }

  render() {
    let state = this.state;
    return h('.container', [
      h('.row', [
        h('.col-12', [
          h('h1', 'real-estate-photo-minimap'),
          h('p', 'We\'ll create a blueprint layout with grouped images, at up to 10 locations, in 3 steps'),
          // ol
          //   li Upload and categorize image with location
          //   li Upload blueprint image from external tool
          //   li Associate locations with blueprint image
          h('.mb-3', [
            h('.progress', {style: {height: '1.5rem'}}, [
              h('.progress-bar', {role: 'progressbar', style: {width: '33%', textDecoration: 'line-through'}}, '1 - Categorize images'),
              h('.progress-bar', {role: 'progressbar', style: {width: '33%'}}, '2 - Build minimap'), // eslint-disable-line max-len
              h('.progress-bar.progressbar-muted', {role: 'progressbar', style: {width: '34%'}}, '3 - Assocate blueprint'), // eslint-disable-line max-len
            ])
          ])
        ])
      ]),
      h('.row', [
        h('.col-12', [
          h('h3', 'Build minimap/blueprint with each location')
        ])
      ]),
      h('.row', [
        h('.col-12.mb-3', [
          h('div', {style: {border: '1px solid black'}}, [
            h(MinimapBuilder, {state})
          ])
        ])
      ]),
      h('.row', [
        h('.col-12', [
          h('p', 'Navigate the buttons and images below for convenient reference')
        ])
      ]),
      h('.row', [
        h('.col-12', [
          (() => {
            function createInput(location) {
              return h('.col-2', {key: location.key}, [
                h(`.input-group.input-group-as-btn-group`, [
                  h(`.input-group-prepend`, [
                    h(`button.input-group-text.location-${location.key}-bg`, {
                      onClick: (evt) => { Store.rr('goToFirstLocationImage', location.key); },
                    }, location.key),
                  ]),
                  h(`button.form-control-plaintext.location-${location.key}-bg`, {
                    readOnly: true,
                    onClick: (evt) => { Store.rr('goToFirstLocationImage', location.key); },
                  }, location.name)
                ]),
              ]);
            }
            assert(state.locations.length === 10, `Expected 10 locations but received ${state.locations.length}`);
            return [
              h('.row.mb-3', {key: 'location-row-0'}, [
                state.locations.slice(0, 5).map(createInput)
              ]),
              h('.row.mb-3', {key: 'location-row-1'}, [
                state.locations.slice(5, 10).map(createInput)
              ])
            ];
          })()
        ])
      ]),
      h('.row.mb-3', [
        h('.col-4', [
          h('a', {href: state.getCurrentImage().src, target: '_blank'}, [
            h('img.img-fluid', {
              src: state.getCurrentImage().src,
              alt: 'Actively selected photo',
            })
          ])
        ]),
        h('.col-8', [
          h('.row.row-cols-8', [
            state.images.map((img, i) => {
              return h('.col.mb-1', {key: i}, [
                // DEV: We use a `div` as `::before` doesn't seem to work great with `img`
                h('div', {
                  key: i,
                  className: classnames({
                    'selected-image': i === state.currentImageIndex,
                  }, img.locationKey ? `location-img location-${img.locationKey}-img` : '')
                }, [
                  h('img.img-fluid', {
                    src: img.src,
                    role: 'button',
                    alt: `Photo ${i} thumbnail`,
                    onClick: () => { Store.rr('goToImage', i); }
                  })
                ])
              ]);
            })
          ])
        ])
      ]),
      h('.row', [
        h('.col-6', [
          h('p', [
            h(Link, {className: 'btn btn-primary', to: '/'}, 'Back'),
            h('br'),
            h('em.text-muted.small', 'Progress will be persisted'),
          ])
        ]),
        h('.col-6.text-right', [
          h('p', [
            // h(Link, {className: 'btn btn-primary', to: '/minimap-review'}, 'Continue'),
            h('button', {className: 'btn btn-primary', disabled: true}, 'Continue'),
            h('br'),
            h('em.text-muted.small', 'Not yet implemented'),
          ])
        ]),
      ]),
    ]);
  }

  componentDidMount() {
    // When a key is pressed
    let state = this.state;
    this._keyListener = (evt) => {
      // If the event is for an input, then stop
      // https://github.com/ccampbell/mousetrap/blob/1.6.5/mousetrap.js#L973-L1001
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(evt.target.tagName)) {
        return;
      }

      // Compare to known shortcuts
      // Location numbers
      if (state.getLocationKeys().includes(evt.key)) {
        Store.rr('goToFirstLocationImage', evt.key);
      // Arrow keys
      } else if (evt.key === 'ArrowLeft') {
        Store.rr('previousImage');
      } else if (evt.key === 'ArrowRight') {
        Store.rr('nextImage');
      }
    }
    window.addEventListener('keydown', this._keyListener);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this._keyListener);
    delete this._keyListener;
  }
}

// Export our module
module.exports = MinimapBuild;

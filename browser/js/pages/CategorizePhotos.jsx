// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const h = require('react-hyperscript');
const React = require('react');
const Store = require('../store');
const {Link} = require('react-router-dom');

// Define our main page load hook
class CategorizePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = Store._renderState;
    Store._renderFn = this.setState.bind(this);
  }

  render() {
    let state = this.state;
    return <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>real-estate-photo-minimap</h1>
          <p>We'll create a blueprint layout with grouped images, at up to 10 locations, in 3 steps</p>
          {/*
          More descriptive text if we have more space:
          ol
            li Upload and categorize image with location
            li Upload blueprint image from external tool
            li Associate locations with blueprint image
          */}
          <div className="mb-3">
            <div className="progress" style={{height: '1.5rem'}}>
              <div className="progress-bar" role="progressbar" style={{width: '33%'}}>
                1 - Categorize images
              </div>
              <div className="progress-bar progressbar-muted" role="progressbar" style={{width: '33%'}}>
                2 - Upload blueprint
              </div>
              <div className="progress-bar progressbar-muted" role="progressbar" style={{width: '34%'}}>
                3 - Assocate blueprint
              </div>
            </div>
          </div>
        </div>
      </div>
      h('.row', [
        h('.col-12', [
          h('h3', 'Associate uploaded images with locations')
        ])
      ]),
      h('.row', [
        h('.col-12', [
          (() => {
            function createInput(location) {
              return h('.col-2', {key: location.key}, [
                h('.input-group', [
                  h('.input-group-prepend', [
                    h('span.input-group-text', {
                      className: `location-${location.key}-bg`,
                      role: 'button',
                      onClick: () => { Store.rr('setLocationForCurrentImage', location.key); },
                    }, location.key),
                  ]),
                  h('input.form-control', {
                    type: 'text', value: location.name,
                    onFocus: (evt) => { Store.rr('goToFirstLocationImage', location.key); },
                    onChange: (evt) => { Store.rr('setLocationName', location.key, evt.target.value); },
                    'aria-label': `Location name ${location.key}`
                  }),
                ])
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
      h('.row', [
        h('.col-6', [
          h('div', 'Type or press location number to categorize image'),
          h('p', [
            h('img.img-fluid', {src: state.getCurrentImage().src, alt: 'Actively selected photo'})
          ]),

          h('p', [
            'or ',
            h('button.btn.btn-secondary', {onClick: () => { Store.rr('nextImage'); }}, 'skip to next image'),
            h('span.text-muted', ' (shortcut: s)'),
          ])
        ])
      ]),
      h('.row', [
        state.images.map((img, i) => {
          return h('.col-1.mb-1', {key: i}, [
            // DEV: We use a `div` as `::before` doesn't seem to work great with `img`
            h('div', {
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
      ]),
      h('.row', [
        h('.col-6', [
        ]),
        h('.col-6.text-right', [
          h('p', [
            h(Link, {className: 'btn btn-primary', to: '/minimap-build'}, 'Continue'),
            h('br'),
            h('em.text-muted.small', `Uncategorized images (${
              state.images.filter((img) => !img.locationKey).length
            }) will be omitted`),
          ])
        ])
      ]),
    </div>;
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
        Store.rr('setLocationForCurrentImage', evt.key);
      // Skipping shortcut
      } else if (evt.key === 's') {
        Store.rr('nextImage');
      // Arrow keys
      } else if (evt.key === 'ArrowLeft') {
        Store.rr('previousImage');
      } else if (evt.key === 'ArrowRight') {
        Store.rr('nextImage');
      }
    };
    window.addEventListener('keydown', this._keyListener);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this._keyListener);
    delete this._keyListener;
  }
}

// Export our module
module.exports = CategorizePhotos;

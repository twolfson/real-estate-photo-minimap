// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const h = require('react-hyperscript');
const Floorplan = require('../components/floorplan');
const React = require('react');
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
              <div className="progress-bar" role="progressbar" style={{width: '33%', textDecoration: 'line-through'}}>
                1 - Categorize images
              </div>
              <div className="progress-bar" role="progressbar" style={{width: '33%'}}>
                2 - Build minimap
              </div>
              <div className="progress-bar progressbar-muted" role="progressbar" style={{width: '34%'}}>
                3 - Assocate blueprint
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Build minimap/blueprint with each location</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-3">
          <div style={{border: '1px solid black'}}>
            <Floorplan state={state} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p>Navigate the buttons and images below for convenient reference</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {(() => {
            function createInput(location) {
              return <div className="col-2" key={location.key}>
                <div className={`input-group input-group-as-btn-group`}>
                  <div className={`input-group-prepend`}>
                    <button className={`input-group-text location-${location.key}-bg`}
                      onClick={(evt) => { Store.rr('goToFirstLocationImage', location.key); }}
                    >
                      {location.key}
                    </button>
                  </div>
                  <button className={`form-control-plaintext location-${location.key}-bg`}
                    readOnly={true}
                    onClick={(evt) => { Store.rr('goToFirstLocationImage', location.key); }}
                  >
                    {location.name}
                  </button>
                </div>
              </div>;
            }
            assert(state.locations.length === 10, `Expected 10 locations but received ${state.locations.length}`);
            return <>
              <div className="row mb-3">
                {state.locations.slice(0, 5).map(createInput)}
              </div>
              <div className="row mb-3">
                {state.locations.slice(5, 10).map(createInput)}
              </div>
            </>;
          })()}
        </div>
      </div>
      {/*
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
      */}
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
        Store.rr('goToFirstLocationImage', evt.key);
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
module.exports = MinimapBuild;

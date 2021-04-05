// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const Floorplan = require('../components/Floorplan');
const React = require('react');
const { Link } = require('react-router-dom');
const { useStore } = require('../hooks/store');

// Define our page
function MinimapBuild() {
  let state = useStore();

  // Before handing off state, perform a synchronous sort on our data
  state.sortImagesByLocationKey();
  state.populateMinimap();

  // Perform our render
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
    <div className="row mb-3">
      <div className="col-4">
        <a href={state.getCurrentImage().src} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img className="img-fluid"
            src={state.getCurrentImage().src}
            alt="Actively selected photo"
          />
        </a>
      </div>
      <div className="col-8">
        <div className="row row-cols-8">
          {state.images.map((img, i) => {
            return <div className="col mb-1" key={i}>
              {/* DEV: We use a `button` as `::before` doesn't seem to work great with `img` */}
              <button
                key={i}
                className={classnames('btn-unstyled', {
                  'selected-image': i === state.currentImageIndex,
                }, img.locationKey ? `location-img location-${img.locationKey}-img` : '')}
                onClick={() => { Store.rr('goToImage', i); }}
              >
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img className="img-fluid"
                  src={img.src}
                  alt={`Photo ${i} thumbnail`}
                />
              </button>
            </div>;
          })}
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-6">
        <p>
          <Link className="btn btn-primary" to="/">Back</Link>
          <br />
          <em className="text-muted small">Progress will be persisted</em>
        </p>
      </div>
      <div className="col-6 text-right">
        <p>
          {/* <Link className="btn btn-primary" to="/minimap-review">Continue</Link> */}
          <button className="btn btn-primary" disabled={true}>Continue</button>
          <br />
          <em className="text-muted small">Not yet implemented</em>
        </p>
      </div>
    </div>
  </div>;

  /*
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
  */
}

// Export our module
module.exports = MinimapBuild;

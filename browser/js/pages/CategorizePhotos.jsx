// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const React = require('react');
const { useStore, useCurrentImage } = require('../hooks/store');
const { Link } = require('react-router-dom');

// Define our main page load hook
function CategorizePhotos() {
  let state = useStore();
  let currentImage = useCurrentImage();

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
        <h3>Associate uploaded images with locations</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        {(() => {
          function createInput(location) {
            return <div className="col-2" key={location.key}>
              <div className="input-group">
                <div className="input-group-prepend">
                  <button className={`input-group-text location-${location.key}-bg`}
                    onClick={() => { Store.rr('setLocationForCurrentImage', location.key); }}
                  >
                    {location.key}
                  </button>
                </div>
                <input className="form-control"
                  type="text" value={location.name}
                  onFocus={(evt) => { Store.rr('goToFirstLocationImage', location.key); }}
                  onChange={(evt) => { Store.rr('setLocationName', location.key, evt.target.value); }}
                  aria-label={`Location name ${location.key}`}
                />
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
    <div className="row">
      <div className="col-6">
        <div>Type or press location number to categorize image</div>
        <p>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img className="img-fluid" src={currentImage.src} alt="Actively selected photo" />
        </p>

        <p>
          or{' '}
          <button className="btn btn-secondary"
            onClick={() => { Store.rr('nextImage'); }}>skip to next image</button>
          <span className="text-muted"> (shortcut: s)</span>
        </p>
      </div>
    </div>
    <div className="row">
      {state.images.map((img, i) => {
        return <div className="col-1 mb-1" key={i}>
          {/* DEV: We use a `button` as `::before` doesn't seem to work great with `img`*/}
          <button
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
    <div className="row">
      <div className="col-6"></div>
      <div className="col-6 text-right">
        <p>
          <Link className="btn btn-primary" to="/minimap-build">Continue</Link>
          <br />
          <em className="text-muted small">
            {(() => {
              let uncategorizedImages = state.images.filter((img) => !img.locationKey);
              return <>Uncategorized images ({uncategorizedImages.length}) will be omitted</>;
            })()}
          </em>
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
  */
};

// Export our module
module.exports = CategorizePhotos;

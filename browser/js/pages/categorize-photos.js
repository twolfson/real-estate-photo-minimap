// Load in our dependencies
const assert = require('assert');
const config = require('./config');
const classnames = require('classnames');
const h = require('react-hyperscript');
const ReactDOM = require('react-dom');
const Store = require('./store');

// Expose common data
window.Store = Store;

// Define our main page load hook
function main() {
  let reactContainer = document.getElementById('react-content');
  if (!reactContainer) { throw new Error('Unable to find #react-content'); }

  // TODO: Should use `this.props` instead of `Store` for content
  ReactDOM.render(
    h('.container', [
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
              h('.progress-bar', {role: 'progressbar', style: {width: '33%'}}, '1 - Categorize images'),
              h('.progress-bar.progressbar-muted', {role: 'progressbar', style: {width: '33%'}}, '2 - Upload blueprint'), // eslint-disable-line max-len
              h('.progress-bar.progressbar-muted', {role: 'progressbar', style: {width: '34%'}}, '3 - Assocate blueprint'), // eslint-disable-line max-len
            ])
          ])
        ])
      ]),
      h('.row', [
        h('.col-12', [
          h('h3', 'Associate uploaded images with locations')
        ])
      ]),
      h('.row', [
        h('.col-12',
          (() => {
            function createInput(location) {
              return h('.col-2', {key: location.key}, [
                h('.input-group', [
                  h('.input-group-prepend', [
                    h('span', {
                      className: `input-group-text location-${location.key}-bg`,
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
            assert(Store.locations.length === 10, `Expected 10 locations but received ${Store.locations.length}`);
            return [
              h('.row.mb-3',
                Store.locations.slice(0, 5).map(createInput)
              ),
              h('.row.mb-3',
                Store.locations.slice(5, 10).map(createInput)
              )
            ];
          })()
        )
      ]),
      h('.row', [
        h('.col-6', [
          h('div', 'Type or press location number to categorize image'),
          h('p', [
            h('img.img-fluid', {src: Store.getCurrentImage().src, alt: 'Actively selected photo'})
          ]),

          h('p', [
            'or ',
            h('button.btn.btn-secondary', {onClick: () => { Store.rr('nextImage'); }}, 'skip to next image'),
            h('span.text-muted', ' (shortcut: s)'),
          ])
        ])
      ]),
      h('.row',
        Store.images.map((img, i) => {
          return h('.col-1.mb-1', [
            // DEV: We use a `div` as `::before` doesn't seem to work great with `img`
            h('div', {
              key: i,
              className: classnames({
                'selected-image': i === Store.currentImageIndex,
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
      ),
      h('.row', [
        h('.col-12', [
          h('.text-right', [
            h('p', [
              h('button.btn.btn-primary', 'Continue'),
              h('br'),
              h('em.text-muted.small', `Uncategorized images (${
                Store.images.filter((img) => !img.locationKey).length
              }) will be omitted`),
            ])
          ])
        ])
      ]),
    ]),
    reactContainer
  );
}
// DEV: We could use `DOMContentLoaded` hook but our script location is good enough
main();
// Rebind `main` as render
Store._renderFn = main;

// View hooks
// When a key is pressed
// TODO: When move to another window, unbind (prob do via `componentDidMount` and `componentWillUnmount` mechanisms)
window.addEventListener('keydown', (evt) => {
  // If the event is for an input, then stop
  // https://github.com/ccampbell/mousetrap/blob/1.6.5/mousetrap.js#L973-L1001
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(evt.target.tagName)) {
    return;
  }

  // Compare to known shortcuts
  // Location numbers
  if (Store.getLocationKeys().includes(evt.key)) {
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
});

// Load in our dependencies
const assert = require('assert');
const config = require('../config');
const classnames = require('classnames');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const Store = require('../store');
const {Link} = require('react-router-dom');

// Fancy importing non-JS assets handling for demo
import blueprintSvgSrc from '../../../backups/1376-natoma.svg';

// Define our main page load hook
class MinimapBuild extends React.Component {
  constructor() {
    super();
    // TODO: Should use `this.state` instead of `Store` for content
    // DEV: For now, this triggers new state due to unique object
    let getState = () => { return {}; };
    this.state = getState();
    Store._renderFn = () => { this.setState(getState()); };
  }

  render() {
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
          h('div.p-1', {style: {border: '1px solid black', height: '300px'}}, [
            h('span', {style: {position: 'absolute'}}, 'Minimap builder goes here'),
            h('img', {src: blueprintSvgSrc, style: {maxHeight: '100%', margin: '0 auto'}})
          ])
        ])
      ]),
      h('.row', [
        h('.col-12', [
          h('p', 'Navigate the buttons and images below for convenient reference')
        ])
      ]),
      h('.row', [
        h('.col-12',
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
      h('.row.mb-3', [
        h('.col-4', [
          h('a', {href: Store.getCurrentImage().src, target: '_blank'}, [
            h('img.img-fluid', {
              src: Store.getCurrentImage().src,
              alt: 'Actively selected photo',
            })
          ])
        ]),
        h('.col-8', [
          h('.row.row-cols-8',
            // DEV: All browsers except IE stable sort, this is prob good enough -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            // TODO: This mutates our images in-place, thus Store receives new order, which is why left/right arrows are working right now
            //   but we should prob not contaminate the Store order directly like that
            //   Maybe add something like an `orderId` key to each image and update/sort by that?
            //   To see it break: Use `.slice()` first as well as reset `localStorage`
            Store.images.sort((imgA, imgB) => {
              return imgA.locationKey > imgB.locationKey;
            }).map((img, i) => {
              return h('.col.mb-1', [
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
          )
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
    this._keyListener = (evt) => {
      // If the event is for an input, then stop
      // https://github.com/ccampbell/mousetrap/blob/1.6.5/mousetrap.js#L973-L1001
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(evt.target.tagName)) {
        return;
      }

      // Compare to known shortcuts
      // Location numbers
      if (Store.getLocationKeys().includes(evt.key)) {
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

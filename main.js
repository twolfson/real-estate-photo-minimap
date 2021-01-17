// Wrap all our content in an IIFE to avoid leaks
(function () {

// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const h = require('react-hyperscript');
const ReactDOM = require('react-dom');

// Model singleton and constants
// DEV: `evt.key` is a string, this is easier to maintain via Sublime Text mutli-select
const CATEGORIES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const Store = {
  images: Array(44).fill(true).map((_, i) => {
    let img = {src: `big-photos/${i}.jpg`, category: null};
    if (i === 3) { img.category = '1'; }
    if (i === 5) { img.category = '2'; }
    if (i === 7) { img.category = '3'; }
    if (i === 20) { img.category = '4'; }
    return img;
  }),
  currentImageIndex: 0,
  getCurrentImage: function () {
    return this.images[this.currentImageIndex];
  },

  _nextImage: function () {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  },
  _goToImage: function (index) {
    assert(index >= 0 && index < this.images.length, `Index ${index} out of \`this.images\` range`);
    assert(!isNaN(index), `Index is NaN`);
    this.currentImageIndex = index;
  },

  nextImage: function () {
    this._nextImage();
    render();
  },
  goToImage: function (index) {
    this._goToImage(index);
    render();
  },
  categorizeCurrentImage: function (category) {
    this._categorizeImage(this.getCurrentImage(), category);
    this._nextImage();
    render();
  }
};

// Define our main page load hook
function main() {
  let reactContainer = document.getElementById('react-content');
  if (!reactContainer) { throw new Error('Unable to find #react-content'); }

  ReactDOM.render(
    h('.container', [
      h('.row', [
        h('.col-12', [
          h('h1', 'real-estate-layout-tool'),
          h('p', 'We\'ll create a blueprint layout with grouped images, at up to 10 locations, in 3 steps'),
          //- ol
          //-   li Upload and categorize image with location
          //-   li Upload blueprint image from external tool
          //-   li Associate locations with blueprint image
          h('.mb-3', [
            h('.progress', {style: {height: '1.5rem'}}, [
              h('.progress-bar', {role: 'progressbar', style: {width: '33%'}}, '1 - Categorize images'),
              //- TODO: Build better `.muted` for progressbar
              h('.progress-bar', {role: 'progressbar', style: {width: '33%', backgroundColor: 'transparent', color: 'black', opacity: '40%'}}, '2 - Upload blueprint'),
              h('.progress-bar', {role: 'progressbar', style: {width: '34%', backgroundColor: 'transparent', color: 'black', opacity: '40%'}}, '3 - Assocate blueprint'),
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
            function createInput(location, humanI) {
              return h('.col-2', [
                h('.input-group', [
                  h('.input-group-prepend', [
                    h('span', {className: `input-group-text category-${humanI}-bg`}, humanI),
                  ]),
                  h('input.form-control', {type: 'text', value: location, onChange: () => { /* TODO: Wire me up */}, 'aria-label': `Location name ${humanI}`}),
                ])
              ]);
            }
            return [
              h('.row.mb-3',
                // TODO: Use data structure for categories
                ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Hallway'].map((location, i) => {
                  let humanI = i + 1;
                  return createInput(location, humanI);
                })
              ),
              h('.row.mb-3',
                ['Kitchen', 'Bathroom', '', '', ''].map((location, i) => {
                  let humanI = (i + 6) % 10;
                  return createInput(location, humanI);
                })
              )
            ];
          })()
        )
      ]),
      h('.row', [
        h('.col-6', [
          //- TODO: Allow pressing actual number part of "prepend" -- updated text would read "Type or press"
          //- TODO: Use dynamic image location
          h('div', 'Type location number to categorize image'),
          h('p', [
            h('img.img-fluid', {src: Store.getCurrentImage().src, alt: 'Actively selected photo'})
          ]),

          h('p', [
            'or ',
            h('button.btn.btn-secondary', {onClick: () => { /* TODO: Implement click */}}, 'skip to next image'),
            h('span.text-muted', ' (shortcut: s)'),
          ])
        ])
      ]),
      h('.row',
        //- TODO: Use dynamic numbering and image location
        Store.images.map((img, i) => {
          return h('.col-1.mb-1', [
            //- TODO: Use dynamic numbering and categorization
            //- DEV: We use a `div` as `::before` doesn't seem to work great with `img`
            h('div', {
              className: classnames({
                'selected-image': i === Store.currentImageIndex,
              }, img.category ? `category-img category-${img.category}-img` : '')
            }, [
              h('img.img-fluid', {
                src: img.src,
                role: 'button',
                alt:`Photo ${i} thumbnail`,
                onClick: () => { Store.goToImage(i); }
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
              //- TODO: Use dynamic image count
              h('em.text-muted.small', 'Uncategorized images (40) will be omitted'),
            ])
          ])
        ])
      ])
    ]),
    reactContainer
  );
}
// DEV: We could use `DOMContentLoaded` hook but our script location is good enough
main();
// Alias `main` to `render`
let render = main;

// View hooks
// When a key is pressed
window.addEventListener('keypress', (evt) => {
  // If it's a known category, then label our current image
  if (CATEGORIES.includes(evt.key)) {
    Store.categorizeCurrentImage(evt.key);
  // Otherwise, if we're skipping, then skip
  } else if (evt.key === 's') {
    Store.nextImage();
  }
});

// End of IIFE
}());

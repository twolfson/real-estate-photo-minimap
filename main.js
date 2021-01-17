// Wrap all our content in an IIFE to avoid leaks
(function () {

// Load in our dependencies
const assert = require('assert');
const classnames = require('classnames');
const h = require('react-hyperscript');
const ReactDOM = require('react-dom');

// Model singleton
const Store = {
  // DEV: We use keys instead of array index as we want to associate it loosely (e.g. different shortcuts)
  categories: [
    {name: 'Room 1',   key: '1'},
    {name: 'Room 2',   key: '2'},
    {name: 'Room 3',   key: '3'},
    {name: 'Room 4',   key: '4'},
    {name: 'Hallway',  key: '5'},
    {name: 'Kitchen',  key: '6'},
    {name: 'Bathroom', key: '7'},
    {name: '',         key: '8'},
    {name: '',         key: '9'},
    {name: '',         key: '0'},
  ],
  images: Array(44).fill(true).map((_, i) => {
    let img = {src: `big-photos/${i}.jpg`, categoryKey: null};
    if (i === 3) { img.categoryKey = '1'; }
    if (i === 5) { img.categoryKey = '2'; }
    if (i === 7) { img.categoryKey = '3'; }
    if (i === 20) { img.categoryKey = '4'; }
    return img;
  }),
  currentImageIndex: 0,
  getCategoryKeys: function () {
    return this.categories.map((cat) => cat.key);
  },
  getCurrentImage: function () {
    return this.images[this.currentImageIndex];
  },

  nextImage: function () {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  },
  goToImage: function (index) {
    assert(index >= 0 && index < this.images.length, `Index ${index} out of \`this.images\` range`);
    assert(!isNaN(index), `Index is NaN`);
    this.currentImageIndex = index;
  },
  categorizeCurrentImage: function (categoryKey) {
    let categoryKeys = this.getCategoryKeys();
    assert(categoryKeys.includes(categoryKey), `Category ${categoryKey} isn't within categories`);
    this.getCurrentImage().categoryKey = categoryKey;
    this.nextImage();
  },

  rr /* run and render */: function (method, /* args */) {
    let args = [].slice.call(arguments, 1);
    this[method].apply(this, args);
    render();
  }
};
window.Store = Store;

// Define our main page load hook
function main() {
  let reactContainer = document.getElementById('react-content');
  if (!reactContainer) { throw new Error('Unable to find #react-content'); }

  //- TODO: Should use `this.props` instead of `Store` for content
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
                    h('span', {
                      className: `input-group-text category-${humanI}-bg`,
                      role: 'button',
                      onClick: () => { Store.rr('categorizeCurrentImage', humanI); },
                    }, humanI),
                  ]),
                  h('input.form-control', {type: 'text', value: location, onChange: () => { /* TODO: Wire me up */}, 'aria-label': `Location name ${humanI}`}),
                ])
              ]);
            }
            return [
              h('.row.mb-3',
                // TODO: Use data structure for categories (e.g. [{name: 'Room 1', shortcut: '1'}, ...])
                ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Hallway'].map((location, i) => {
                  let humanI = i + 1;
                  return createInput(location, humanI.toString());
                })
              ),
              h('.row.mb-3',
                ['Kitchen', 'Bathroom', '', '', ''].map((location, i) => {
                  let humanI = (i + 6) % 10;
                  return createInput(location, humanI.toString());
                })
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
            //- DEV: We use a `div` as `::before` doesn't seem to work great with `img`
            h('div', {
              key: i,
              className: classnames({
                'selected-image': i === Store.currentImageIndex,
              }, img.categoryKey ? `category-img category-${img.categoryKey}-img` : '')
            }, [
              h('img.img-fluid', {
                src: img.src,
                role: 'button',
                alt:`Photo ${i} thumbnail`,
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
                Store.images.filter((img) => !img.categoryKey).length
              }) will be omitted`),
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
  if (Store.getCategoryKeys().includes(evt.key)) {
    Store.rr('categorizeCurrentImage', evt.key);
  // Otherwise, if we're skipping, then skip
  } else if (evt.key === 's') {
    Store.rr('nextImage');
  }
});

// End of IIFE
}());

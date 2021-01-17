// Wrap all our content in an IIFE to avoid leaks
(function () {

// Load in our dependencies
const classnames = require('classnames');
const h = require('react-hyperscript');
const ReactDOM = require('react-dom');

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
            h('img.img-fluid', {src: 'big-photos/0.jpg', alt: 'Actively selected photo'})
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
        Array(44).fill(true).map((_, i) => {
          console.log('i', i);
          let imgName = `big-photos/${i}.jpg`;
          return h('.col-1.mb-1', [
            //- TODO: Use dynamic numbering and categorization
            //- DEV: We use a `div` as `::before` doesn't seem to work great with `img`
            h('div', {
              className: classnames({
                'selected-image': i === 0,

                'category-img': [3, 5, 7, 20].includes(i),
                'category-1-img': i === 3,
                'category-2-img': i === 5,
                'category-3-img': i === 7,
                'category-4-img': i === 20,
              })
            }, [
              h('img.img-fluid', {src: imgName, alt:`Photo ${i} thumbnail`})
            ])
          ]);
        })
      )
    ]),
    reactContainer
  );
}
Array(44).map((i) => console.log);
// DEV: We could use `DOMContentLoaded` hook but our script location is good enough
main();

// Model singleton and constants
// DEV: `evt.key` is a string, this is easier to maintain via Sublime Text mutli-select
const CATEGORIES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const Store = {
  images: [],
  labelCurrentImage: function (category) {
    this.labelImage(this.currentImage, category);
    this.nextImage();
  }
};

// View hooks
// When a key is pressed
window.addEventListener('keypress', (evt) => {
  // If it's a known category, then label our current image
  if (CATEGORIES.includes(evt.key)) {
    Store.labelCurrentImage(evt.key);
  // Otherwise, if we're skipping, then skip
  } else if (evt.key === 's') {
    Store.nextImage();
  }
});

}());

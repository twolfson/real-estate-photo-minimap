// Wrap all our content in an IIFE to avoid leaks
(function () {

// Load in our dependencies
const ReactDOM = window.ReactDOM;
const e = React.createElement;

// Define our main page load hook
function main() {
  let reactContainer = document.getElementById('react-content');
  if (!reactContainer) { throw new Error('Unable to find #react-content'); }

  ReactDOM.render(
    e('h1', {}, 'foo'),
    reactContainer
  );
}
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

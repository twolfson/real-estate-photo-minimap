// Load in our dependencies
const ReactDOM = require('react-dom');
const {Router, Route} = require('react-router');

// Define our main page load hook
function main() {
  let reactContainer = document.getElementById('react-content');
  if (!reactContainer) { throw new Error('Unable to find #react-content'); }

  // TODO: Should use `this.props` instead of `Store` for content
  ReactDOM.render('foo', reactContainer);
}
main();

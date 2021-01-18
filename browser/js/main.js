// Load in our dependencies
const assert = require('assert');
const CategorizePhotos = require('./pages/categorize-photos');
const MinimapBuild = require('./pages/minimap-build');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const {HashRouter, Switch, Route, Link} = require('react-router-dom');

// Define our main page load hook
function main() {
  // Load our container
  let reactContainer = document.getElementById('react-content');
  assert(reactContainer, 'Unable to find #react-content');
  reactContainer.textContent = 'Attaching content...';

  // Bind our container to our router
  ReactDOM.render(
    h(HashRouter, [
      h(Switch, [
        h(Route, {exact: true, path: '/', component: CategorizePhotos}),
        h(Route, {exact: true, path: '/minimap-build', component: MinimapBuild}),
        h(Route, {path: '*'}, () => '404: URL not found'),
      ])
    ]),
    reactContainer
  );
}
main();

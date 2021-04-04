// Load in our dependencies
const assert = require('assert');
const CategorizePhotos = require('./pages/CategorizePhotos');
const MinimapBuild = require('./pages/minimap-build');
const React = require('react');
const ReactDOM = require('react-dom');
const {HashRouter, Switch, Route} = require('react-router-dom');

// Define our main page load hook
function main() {
  // Load our container
  let reactContainer = document.getElementById('react-content');
  assert(reactContainer, 'Unable to find #react-content');
  reactContainer.textContent = 'Attaching content...';

  // Bind our container to our router
  ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route exact={true} path="/" component={CategorizePhotos} />
        <Route exact={true} path="/minimap-build" component={MinimapBuild} />
        <Route path="*">404: URL not found</Route>
      </Switch>
    </HashRouter>,
    reactContainer
  );
}
main();

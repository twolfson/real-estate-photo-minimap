// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const {BrowserRouter, Switch, Route} = require('react-router-dom');

class Home extends React.Component {
  render() {
    return h('h1', 'Welcome to the Home Page');
  }
};

// Define our main page load hook
function main() {
  // Load our container
  let reactContainer = document.getElementById('react-content');
  assert(reactContainer, 'Unable to find #react-content');
  reactContainer.textContent = 'Attaching content...';

  // Bind our container to our router
  ReactDOM.render(
    h(BrowserRouter, [
      h(Switch, [
        h(Route, {path: '/', component: Home}),
      ])
    ]),
    reactContainer
  );
}
main();

// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const {HashRouter, Switch, Route} = require('react-router-dom');

class Home extends React.Component {
  render() {
    return h('h1', [
      'Welcome to the Home Page',
      h('a', {href: '#/2'}, 'Link')
    ]);
  }
};
class Home2 extends React.Component {
  render() {
    return h('h1', 'Welcome 222 to the Home Page');
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
    h(HashRouter, [
      h(Switch, [
        h(Route, {exact: true, path: '/', component: Home}),
        h(Route, {exact: true, path: '/2', component: Home2}),
      ])
    ]),
    reactContainer
  );
}
main();

// Load in our dependencies
const assert = require('assert');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const {HashRouter, Switch, Route, Link} = require('react-router-dom');

const _state = {count: 0};

class Home extends React.Component {
  constructor() {
    super();
    this.state = Object.assign(_state);
  }

  render() {
    return h('h1', [
      'Welcome to the Home Page' + this.state.count,
      h('button', {onClick: () => {_state.count += 1}}, 'Increment'),
      h(Link, {to: '/2'}, 'Foo'),
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
        h(Route, {path: '*'}, () => '404: URL not found'),
      ])
    ]),
    reactContainer
  );
}
main();

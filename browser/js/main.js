// Load in our dependencies
const assert = require('assert');
const CategorizePhotos = require('./pages/categorize-photos');
const h = require('react-hyperscript');
const React = require('react');
const ReactDOM = require('react-dom');
const {HashRouter, Switch, Route, Link} = require('react-router-dom');

const _state = {count: 0, _updateFn: null};

class Home extends React.Component {
  constructor() {
    super();
    this.state = Object.assign(_state);
    let that = this;
    _state._updateFn = (_state) => {
      // TODO: In final version, this would be passed in immutably from `_state`
      let state = Object.assign(_state);
      that.setState(state);
    }
  }

  render() {
    return h('h1', [
      'Welcome to the Home Page' + this.state.count,
      h('button', {onClick: () => {_state.count += 1; _state._updateFn(_state); }}, 'Increment'),
      h(Link, {to: '/2'}, 'Forward'),
    ]);
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
        h(Route, {exact: true, path: '/', component: CategorizePhotos}),
        h(Route, {exact: true, path: '/2', component: Home}),
        h(Route, {path: '*'}, () => '404: URL not found'),
      ])
    ]),
    reactContainer
  );
}
main();

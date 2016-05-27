import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';

import LandingPage from './components/LandingPage';

const store = createStore(reducers);

document.addEventListener('DOMContentLoaded', () => {
  render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path='/'>
          <IndexRoute component={LandingPage} />
        </Route>
      </Router>
    </Provider>
  ), document.getElementById('root'));
});
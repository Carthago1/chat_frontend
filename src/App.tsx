import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from '@/store/store';
import MainView from './views/MainView';

function App() {
  return (
    <Provider store={store}>
      <MainView />
    </Provider>
  );
}

export default App;

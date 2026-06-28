import { useState } from 'react';
import './index.scss';
import { APP_TITLE, APP_SUBTITLE } from './constants';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyFeed from './pages/MyFeed';
import Market from './pages/Market';
import Users from './pages/Users';
import DesiHeader from './components/Header';
import { HeaderContextProvider } from './context/HeaderContext';

export default function App() {

  return (
    <>
    <HeaderContextProvider>
    <main className='app'>
      <BrowserRouter>
      
        <DesiHeader />

        <Routes>
          <Route path='' element={<Home />} />
          <Route path='my-feed' element={<MyFeed />} />
          <Route path='market' element={<Market />} />
          <Route path='users' element={<Users />} />
        </Routes>
      </BrowserRouter>
    </main>
    </HeaderContextProvider>
  </>
  );
}

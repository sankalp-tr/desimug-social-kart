import { useState } from 'react';
import './index.css';
import { APP_TITLE, APP_SUBTITLE } from './constants';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyFeed from './pages/MyFeed';
import Market from './pages/Market';
import Users from './pages/Users';

export default function App() {

  return (
    <>
    <main className='app'>
      <BrowserRouter>
      <header>
        <nav>
          <NavLink to='/'>Home</NavLink>&nbsp;|&nbsp;
          <NavLink to='/my-feed'>My Feed</NavLink>&nbsp;|&nbsp;
          <NavLink to='/market'>Market Place</NavLink>&nbsp;|&nbsp;
          <NavLink to='/users'>Users</NavLink>&nbsp;|&nbsp;
          <NavLink to='/tutorials'>Tutorials</NavLink>
        </nav>
      </header>
        <Routes>
          <Route path='' element={<Home />} />
          <Route path='my-feed' element={<MyFeed />} />
          <Route path='market' element={<Market />} />
          <Route path='users' element={<Users />} />
        </Routes>
      </BrowserRouter>
    </main>
  </>
  );
}

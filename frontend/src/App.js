import React from 'react';
import './App.css';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SigninScreen from './screens/SigninScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import UploadReferenceScreen from './screens/UploadReferenceScreen';
import ReferenceScreen from './screens/ReferenceScreen';

function App() {

  return (
    <BrowserRouter>
      <div className="grid-container">
        <Header/>
        <main className="main">
          <div className="content">
              <Route path="/" exact={true} component={HomeScreen} />
              <Route path="/signin" component={SigninScreen} />
              <Route path="/register" component={RegisterScreen} />
              <Route path="/profile" component={ProfileScreen} />
              <Route path="/uploadreference" component={UploadReferenceScreen} />
              <Route path="/references/:id" component={ReferenceScreen} />
          </div>
        </main>
        <Footer/>
      </div>

    </BrowserRouter>
  );
}

export default App;

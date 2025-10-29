import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chores from './Chores';
import AddChore from './AddChore';
import Header from './Header';
import Footer from './Footer';
import CreateHome from './CreateHome'

const App = props => {
  return (
    <div className="App">
      <Router>
        <Header />
        <main className="App-main">
          <Routes>
            {/* a route for the home page */}
            <Route path="/" element={<Home />} />
            {/* a route for the chores page */}
            <Route path="/chores" element={<Chores />} />
            {/* a route for the add chore page */}
            <Route path="/chores/add" element={<AddChore />} />
            {/* a route for the invite roommate to create a new home */}
            <Route path="/create" element={<CreateHome />} /> {/* This page won't be in the navbar, and have access from onboarding or in home page*/}

          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App;

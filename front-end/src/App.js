import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chores from './Chores';
import AddChore from './AddChore';
import Header from './Header';
import Footer from './Footer';
import Landing from './Landing';
import Payments from './Payments.js'
import Events from './Events';


const App = props => {
  return (
    <div className="App">
      <Router>
        <Header />
        <main className="App-main">
          <Routes>
            {/* a route for the home page */}
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            
            {/* a route for the chores page */}
            <Route path="/chores" element={<Chores />} />
            {/* a route for the add chore page */}
            <Route path="/chores/add" element={<AddChore />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App;

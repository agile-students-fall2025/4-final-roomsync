import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chores from './Chores';
import AddChore from './AddChore';
import Header from './Header';
import Footer from './Footer';


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

          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App;

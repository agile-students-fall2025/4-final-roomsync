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
import EventDetails from './EventDetails';
import CompatibilityFinder from './compatibility/CompatibilityFinder';
import StartEssayForRoommate from './compatibility/StartEssayForRoommate';
import PostAvailableSpace from './compatibility/PostAvailableSpace';
import PotentialRoommates from './compatibility/PotentialRoommates';
import PotentialRoommateProfile from './compatibility/PotentialRoommateProfile';
import Login from './Login';
import Register from './Register';


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
            
            {/* a route for login and register page */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* a route for the chores page */}
            <Route path="/chores" element={<Chores />} />
            {/* a route for the add chore page */}
            <Route path="/chores/add" element={<AddChore />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />

            {/* compatibility finder hub */}
            <Route path="/compatibility" element={<CompatibilityFinder />} />
            <Route path="/compatibility/roommate/essay" element={<StartEssayForRoommate />} />
            <Route path="/compatibility/roommate/space" element={<PostAvailableSpace />} />
            <Route path="/compatibility/roommate/potentialroommates" element={<PotentialRoommates />} />
            <Route path="/compatibility/roommate/potentialroommate/:id" element={<PotentialRoommateProfile />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App;

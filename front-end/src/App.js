import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chores from './Chores';
import AddChore from './AddChore';
import Header from './Header';
import Footer from './Footer';
import CreateHome from './CreateHome'
import Landing from './Landing';
import Payments from './Payments.js'
import PaymentDetails from './PaymentDetails.js'
import Events from './Events';
import EventDetails from './EventDetails';
import EventCalendar from './EventCalendar.js';
import SkillSwap from './SkillSwap';
import CompatibilityFinder from './compatibility/CompatibilityFinder';
import StartEssayForRoommate from './compatibility/StartEssayForRoommate';
import PostAvailableSpace from './compatibility/PostAvailableSpace';
import PotentialRoommates from './compatibility/PotentialRoommates';
import PotentialRoommateProfile from './compatibility/PotentialRoommateProfile';
import StartEssayForRoom from './compatibility/StartEssayForRoom';
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
            <Route path="/chores/add" element={<AddChore />} />

            {/* a route for the payments page */}
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/:paymentId" element={<PaymentDetails />} />

            {/* a route for the invite roommate to create a new home */}
            <Route path="/create" element={<CreateHome />} /> {/* This page won't be in the navbar, and have access from onboarding or in home page*/}
            <Route path="/payments" element={<Payments />} />
            <Route path="/skillswap" element={<SkillSwap />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/eventcalendar" element={<EventCalendar />} />
            

            {/* compatibility finder hub */}
            <Route path="/compatibility" element={<CompatibilityFinder />} />
            <Route path="/compatibility/roommate/essay" element={<StartEssayForRoommate />} />
            <Route path="/compatibility/roommate/space" element={<PostAvailableSpace />} />
            <Route path="/compatibility/roommate/potentialroommates" element={<PotentialRoommates />} />
            <Route path="/compatibility/roommate/potentialroommate/:id" element={<PotentialRoommateProfile />} />
            <Route path="/compatibility/room/essay" element={<StartEssayForRoom />} />
          </Routes>
        </main>
        
      </Router>
    </div>
  )
}

export default App;

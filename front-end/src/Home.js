import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Home.css'

/**
 * A React component that represents the Home page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const Home = props => {
  //Temperary data from chores page
    const [chores, setChores] = useState([
      { id: 1, name: 'Clean Kitchen', assignedTo: 'Brian', finished: false },
      { id: 2, name: 'Take Out Trash', assignedTo: 'Eslem', finished: false },
      { id: 3, name: 'Vacuum Living Room', assignedTo: 'Jacod', finished: true }
    ])

    //TODO : this filteres accoring to the user id (use Brian for sprint 1)
    const userID = 'Brian'; // this will be userId in the backend
    const filteredChores = chores.filter(chore => chore.assignedTo == userID && chore.finished == false);

  return (
    <>
    <div class="">
      {/*TODO form will get the info from backend*/}
      <form action="get">
        <div class="statistics-home">
          <div class="stats">
            <h3>Your Upcoming Chorses</h3>
            <ul id="chorses">
              {filteredChores.map(chore => (
                <li key={chores.id}>{chore.name}</li>
              ))}
            </ul>
          </div>
          <div class="stats">
            <h3>Your Upcoming Payments</h3>
            <ul id="payments"></ul>
          </div>
          
        </div>
      </form>
    </div>

    <div class="buttons-home">
      <a href="default.asp">Skill Swap</a>
      <a href="/chores">Chores</a>
      <a href="default.asp">Payments</a>
      <a href="default.asp">Compatibility Finder</a>
    </div>
    </>
  )
}

// make this component available to be imported into any other file
export default Home

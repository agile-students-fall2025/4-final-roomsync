import { Link } from 'react-router-dom'
import './Home.css'

/**
 * A React component that represents the Home page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const Home = props => {
  return (
    <>
    <div class="">
    <form action="get">
    <div class="statistics-home">
     <h3>Upcoming Chores</h3>
     <ul id="chores"></ul>
     <h3>Upcoming Payments</h3>
     <ul id="payments"></ul>
     </div>
    </form>
    </div>

    <div class="buttons-home">
      <a href="default.asp">Skill Swap</a>
      <a href="/chores">Chores</a>
      <a href="/payments">Payments</a>
      <a href="default.asp">Compatibility Finder</a>
    </div>
    </>
  )
}

// make this component available to be imported into any other file
export default Home

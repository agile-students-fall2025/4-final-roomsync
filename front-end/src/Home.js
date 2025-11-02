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

    const [payments, setPayments] = useState([
    { id: 1, name: "Pay electricity bill", amount: 120.5, createdAt: "2025-10-20", cleared: false, categoryId: 1, paidBy: 1, owedBy: [1, 2, 3, 4, 5] },
    { id: 2, name: "Refill water filter", amount: 35.0,  createdAt: "2025-10-18", cleared: true,  categoryId: 1, paidBy: 2, owedBy: [1, 2, 3] },
    { id: 3, name: "Buy milk",            amount: 4.25,  createdAt: "2025-10-25", cleared: true,  categoryId: 2, paidBy: 3, owedBy: [1, 3, 4] },
    { id: 4, name: "Buy vegetables",      amount: 18.6,  createdAt: "2025-10-26", cleared: false, categoryId: 2, paidBy: 1, owedBy: [1, 2, 5] },
    { id: 5, name: "Restock snacks",      amount: 22.4,  createdAt: "2025-10-23", cleared: false, categoryId: 2, paidBy: 4, owedBy: [1, 2, 3, 4] },
    { id: 6, name: "Change air filter",   amount: 15.0,  createdAt: "2025-10-21", cleared: false, categoryId: 3, paidBy: 5, owedBy: [1, 2, 3, 4, 5] },
    { id: 7, name: "Check smoke detector",amount: 10.0,  createdAt: "2025-10-19", cleared: true,  categoryId: 3, paidBy: 2, owedBy: [2, 3, 5] },
  ]);

    //TODO : this filteres accoring to the user id (use Brian for sprint 1)
    const userID = 1; // this will be userId in the backend
    
    const filteredChores = chores.filter(chore => chore.id == userID && chore.finished == false && chore.assignedTo);
    const user = chores.find(user => user.id = userID )



    const filteredPayments = payments
  .filter(payment => 
    payment.paidBy === userID && 
    payment.cleared === false && 
    payment.owedBy.includes(1)
  )
  .map(payment => ({
    ...payment,
    amountPerPerson: payment.amount / payment.owedBy.length
  }));

  return (
    <>
    <div class="">
      {/*TODO form will get the info from backend*/}
      <h2>Welcome {user.assignedTo}</h2>
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
            <ul id="payments">
              {filteredPayments.map(payment => (
                <li key={payments.id}>{payment.name} | git {payment.amount}</li>
              ))}
            </ul>
          </div>
          
        </div>
      </form>
    </div>

    <div class="buttons-home">
      <a class="button-5" href="skillswap">Skill Swap</a>
      <a class="button-5" href="/chores">Chores</a>
      <a class="button-5" href="/payments">Payments</a>
      <a class="button-5" href="/compatibility">Compatibility Finder</a>
    </div>
    </>
  )
}

// make this component available to be imported into any other file
export default Home

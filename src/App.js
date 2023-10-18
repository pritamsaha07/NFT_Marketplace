import React, { useEffect, useState } from 'react'; // Import necessary modules from React
import Web3 from 'web3'; // Import Web3 library for Ethereum interactions
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Wallet from './components/wallet'; // Import the 'Wallet' component
import UserView from './components/userview'; // Import the 'UserView' component

function App() { // Define the 'App' component

  const [state, setState] = useState({ // State variable 'state' using React's 'useState' hook
    web3: null, // Initialize 'web3' to null
    contract: null // Initialize 'contract' to null
  });

  const saveState = (state) => { // Function to save state
    console.log(state); // Log the 'state' object
    setState(state); // Update the 'state' with the new state
  }

  return (
    <> {/* A fragment to group components without a parent container */}
      <Wallet saveState={saveState} state={state}></Wallet> {/* Render the 'Wallet' component with 'saveState' and 'state' props */}
      <UserView state={state}></UserView> {/* Render the 'UserView' component with 'state' prop */}
    </>
  );
}

export default App; // Export the 'App' component

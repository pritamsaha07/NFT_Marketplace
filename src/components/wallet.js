import React, { useState } from 'react'; // Import necessary modules from React
import Web3 from 'web3'; // Import Web3 library for Ethereum interactions
import Container from 'react-bootstrap/Container'; // Import the Container component from Bootstrap
import Nav from 'react-bootstrap/Nav'; // Import the Nav component from Bootstrap
import Navbar from 'react-bootstrap/Navbar'; // Import the Navbar component from Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import ABI from './nft.json' // Import an ABI from a JSON file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS again (duplicate)

const Wallet = ({ saveState }) => { // Define the 'Wallet' component
   const [connected, setConnected] = useState(true); // State variable for connection status
   const [account, setAccount] = useState(""); // State variable for the connected account

   const init = async () => { // Initialization function
    setAccount(account); // Set the 'account' state (this doesn't have any effect as 'account' is empty)
     try {
      let provider = null;
      if (window.ethereum) { // Check if MetaMask's Ethereum provider is available in the browser
        provider = window.ethereum;
      }
      if (window.web3) { // Check if a Web3 provider is available in the browser
        provider = window.web3.currentProvider;
      }
      else if (!process.env.production) { // Check if not in production environment
        provider = new Web3.provider.HttpProvider("http://localhost:7545"); // Use a local Ethereum provider
      }
       const web3 = new Web3(provider); // Create a Web3 instance using the provider
       await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request user accounts from MetaMask
       const contract = new web3.eth.Contract(
          ABI,
           "0xdEc9F818B1e0E6866f104B054e32020563c7862e" // Initialize a contract with an ABI and address
       );
       setConnected(false); // Set 'connected' state to false to indicate successful connection
       saveState({ web3: web3, contract: contract }); // Save the Web3 instance and contract in the app's state
     } catch (error) {
       alert("Please Install Metamask"); // Display an alert if MetaMask is not installed
     }
   }

   return (
     <>
       <Navbar bg="transparent" variant="dark" expand="lg"> {/* Define a Bootstrap Navbar */}
        <Container> {/* Define a Bootstrap Container */}
        
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto"> {/* Define a Bootstrap Nav */}
              <div className="header">
                <button className={`connectBTN ${connected ? 'connect' : 'connected'}`} onClick={init} disabled={!connected}>
                  {connected ? "Connect Metamask" : "Connected" } {/* Display a button to connect or indicate connection status */}
                </button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
       
     </>
   );
};

export default Wallet; // Export the 'Wallet' component

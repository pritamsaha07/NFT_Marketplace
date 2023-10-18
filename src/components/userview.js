import React, { useState, useEffect } from 'react'; // Importing necessary modules from React
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS
import Web3 from 'web3'; // Importing Web3 library for Ethereum interactions
import axios from 'axios'; // Importing Axios for HTTP requests
import './userview.css'; // Importing a custom CSS file

const FormData = require('form-data'); // Importing the 'form-data' library

function UserView({ state, saveState }) { // Defining the 'UserView' component

  // State variables using React's 'useState' hook
  const [imageFile, setImageFile] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [mintedNFTTokenId, setMintedNFTTokenId] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [nonce, setnonce] = useState('');
  const [listedNFTs, setListedNFTs] = useState([]);
  const PUBLIC_KEY = "0x19742F257885e263013E930C697899c73cE82841" ;
  const PRIVATE_KEY ="3071f7892fe8afd143d9d1ba054491d9d5290f7d24e4a40edeb952ab6103579b" ;
  const handleImageUpload = async (e) => { // Event handler for image upload
    const file = e.target.files[0]; // Get the selected image file
    setImageFile(file); // Set the selected image file in state
  };

  useEffect(() => { // Effect hook for loading NFTs
    async function loadNFTs() {
      if (state.contract) {
        const listedNFTs = await state.contract.methods.showNfts().call(); // Call the 'showNfts' function from the contract
        setListedNFTs(listedNFTs); // Update the state with the listed NFTs
      }
    }
    loadNFTs();
  }, [state.contract]);

  const mintNFT = async () => { // Function for minting NFT
    try {
      if (!imageFile) {
        alert('Please upload an image file.'); // Alert if no image file is selected
        return;
      }
  
      if (!state.web3) {
        alert('Web3 is not initialized. Please connect to a compatible Ethereum provider.'); // Alert if Web3 is not initialized
        return;
      }
  
      const { web3, contract } = state;
      const accounts = await web3.eth.getAccounts(); // Get Ethereum accounts
      if (accounts.length === 0) {
        alert('No Ethereum accounts found. Please ensure you are connected to an Ethereum provider.'); // Alert if no Ethereum accounts are found
        return;
      }
  
      await uploadImageToIPFS(imageFile); // Upload the image to IPFS
      const account = accounts[0];
      console.log(account);
      console.log(ipfsHash);
      const nonce = await web3.eth.getTransactionCount(account, 'latest'); // Get the latest nonce
      setnonce(nonce); // Set the nonce in state
      const tx = {
        from: account,
        to: contract.options.address,
        nonce: nonce,
        gas: '500000', 
        gasPrice: '1000000000', 
        data: contract.methods.mintNFT(PUBLIC_KEY, ipfsHash).encodeABI(),
      };
  
      const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY); // Sign the transaction
      console.log('Transaction signed:', signedTx);
  
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction); // Send the signed transaction
      console.log(receipt);
      alert('NFT minted and listed successfully!'); // Alert for successful NFT minting and listing
      setTransactionHash(receipt.transactionHash); // Set the transaction hash in state
      setMintedNFTTokenId(tx.data); // Set the minted NFT token ID in state
    } catch (error) {
      console.error(error); // Log any errors
    }
  };
  
  const listNft = async () => { // Function for listing an NFT for sale
    try {
      const { web3, contract } = state;

      if (!listPrice) {
        alert('Please provide a price to list the NFT.'); // Alert if no price is provided
        return;
      }
     
      const accounts = await web3.eth.getAccounts(); // Get Ethereum accounts
      const account = accounts[0];
      let x = 0;
      await contract.methods.listNFTForSale(ipfsHash, x, listPrice).send({ // Call the 'listNFTForSale' function from the contract
        from: account,
        to: contract.options.address,
        nonce: nonce,
        gas: '500000', 
        gasPrice: '1000000000',
      });
      x++;
      console.log('NFT listed for sale successfully!'); // Log a success message
    } catch (error) {
      console.error(error); // Log any errors
    }
  };
  
  const buyNFT = async (_id) => { // Function for buying an NFT
    try {
      const { web3, contract } = state;
      const accounts = await web3.eth.getAccounts(); // Get Ethereum accounts
      const account = accounts[0];
      const receipt = await contract.methods.buyNFT(_id).send({ // Call the 'buyNFT' function from the contract
        from: account, 
        to: contract.options.address,
        nonce: nonce,
        gas: '500000', 
        gasPrice: '1000000000',
        value: listPrice
      });
      console.log(receipt); // Log the receipt of the transaction
    } catch (error) {
      console.error(error); // Log any errors
    }
  }

  const uploadImageToIPFS = async (imageFile) => { // Function for uploading an image to IPFS
    if (imageFile) {
      try {
        const api_key = '3ca3bc019baf96d01deb';
        const secret_Api_key = '97772d7c5aacdf3a71a2f2c2e6b5648a4f010f107a28c86eaa2e6921d40e13c3';
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append('file', imageFile);

        const resFile = await axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: formData,
          headers: {
            'pinata_api_key': api_key,
            'pinata_secret_api_key': secret_Api_key,
            'Content-Type': 'multipart/form-data',
          },
        });

        const ImgHash = `${resFile.data.IpfsHash}`;
        const Imglink = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
        setIpfsHash(ImgHash); // Set the IPFS hash in state
        console.log('Imagehash', ImgHash);
        console.log('ImageLink', Imglink);
       
      } catch (error) {
        console.log('Error sending File to IPFS: ');
        console.log(error);
        
      }
    }
  };

  return (
    <div>
    
      <div className="container">
      <h2>Mint NFT</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageFile}/>
      <button onClick={mintNFT}>Mint NFT</button>
      </div>
      
      {transactionHash && (
        <div>
          <p>Transaction Hash: {transactionHash}</p>
      
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
        </div>
      )}

      <div className="list-section">
        <h2>List NFT for Sale</h2>
        <input
          type="text"
          placeholder="Price"
          id='price'
          onChange={(e) => setListPrice(e.target.value)}
        />
        <button onClick={listNft}>List NFT</button>
      </div>

      <div >
        <h2>Listed NFTs</h2>
        {listedNFTs.map((nft, index) => (
          <div  className="nft-card" key={index}>
            <p>Token URI: {nft.url}</p>
            
            <img src={`https://ipfs.io/ipfs/${ipfsHash}`} alt="NFT" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            <p className="nft-price"> Price: {"1 ETH"}</p>
            <button className="buy-button" onClick={() => buyNFT(index)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserView;


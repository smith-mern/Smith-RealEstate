Real Estate NFT Escrow System and NFT Minting Contract

This repository contains a set of smart contracts and a React-based front-end application for creating and managing real estate Non-Fungible Tokens (NFTs) on the Ethereum blockchain. The project consists of two main components:

1. Smart Contracts:

Escrow.sol: This contract handles the escrow and sale process of NFTs. It allows sellers to list their NFTs for sale, buyers to deposit funds, inspectors to approve or disapprove the property, and the finalization of the sale when all conditions are met. It also handles the cancellation of sales.
RealEstate.sol: This contract is an ERC-721 compliant NFT contract that allows minting and transferring real estate NFTs.

2. React Front-End:

The React-based front-end application provides a user interface for interacting with the smart contracts. It allows users to view listed real estate NFTs, list NFTs for sale, deposit funds in escrow, manage inspections, approve sales, and finalize or cancel sales.

Getting Started

1.  Clone the Repository
    git clone <repository-url>
    cd <repository-folder>

2.  Install Dependencies
    Install the necessary dependencies for both the smart contracts and the React front-end:

    # Install Node.js and npm if not already installed

    # For the smart contracts, you may need to install Truffle and a development blockchain (e.g., Ganache)

    # Install React front-end dependencies

    cd client
    npm install

    # Install smart contract dependencies (if using Truffle)

    cd ../ethereum
    npm install

3.  Configure the Project
    Update the configuration as needed:

    - In the ethereum directory, update the truffle-config.js file to set up your development blockchain, if you're using Truffle.
    - In the client directory, configure the Ethereum provider, NFT contract address, and other parameters in the config.json file.

4.  Deploy Smart Contracts
    Deploy the smart contracts to your chosen Ethereum network or development blockchain. Depending on your development setup, you can use Truffle, Hardhat, or another development tool.

5.  Run the React Front-End
    Start the React front-end to interact with the deployed smart contracts:
    cd client
    npm start
    The React application should open in your browser, allowing you to interact with the smart contracts.

Smart Contracts

Escrow Contract (`Escrow.sol`)
The Escrow contract handles the escrow and sale process for real estate NFTs. It includes the following functionalities:

    - Listing a property for sale, including setting the purchase price and escrow amount.
    - Depositing earnest money into escrow by the buyer.
    - Updating the inspection status of a property by an inspector.
    - Approving the sale by involved parties (buyer, seller, and lender).
    - Finalizing the sale and transferring funds and NFT to the buyer.
    - Canceling the sale and refunding funds.

Real Estate NFT Contract (`RealEstate.sol`)
The RealEstate contract is an ERC-721 compliant contract for minting and managing real estate NFTs. It includes the following functionality:

    - Minting new real estate NFTs with unique token URIs.
    - Keeping track of the total supply of NFTs.

React Front-End
The React front-end provides a user-friendly interface for users to interact with the smart contracts. Key features include:

    - Viewing listed real estate NFTs.
    - Listing a real estate NFT for sale.
    - Depositing earnest money into escrow.
    - Managing property inspections.
    - Approving sales.
    - Finalizing or canceling sales.

The front-end integrates with the Ethereum network through the web3 library to facilitate these actions.

License
This project is provided under the Unlicense. You are free to use, modify, and distribute the code as you see fit. Please review the licenses of any third-party dependencies used in the project.

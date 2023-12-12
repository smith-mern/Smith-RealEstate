Real Estate Marketplace - ReadMe
This project allows users to buy and sell real estate properties using smart contracts on the blockchain.

Project Structure:
contracts: Contains the Solidity code for the RealEstate and Escrow contracts.
scripts: Contains scripts for deploying and interacting with the contracts.
components: React components for building the user interface.
abis: JSON files containing the Application Binary Interfaces (ABIs) of the contracts.
config.json: Configuration file with network information and contract addresses.
utils: Utility functions for the project.
App.js: Main application file for the React app.
Smart Contracts:
RealEstate.sol: This contract defines the standard ERC721 token for representing real estate properties. It allows users to mint, own, and transfer these tokens.
Escrow.sol: This contract facilitates the buying and selling process using an escrow system. It ensures secure transactions between buyers, sellers, and lenders.
Scripts:
deployRealEstate.js: Deploys the RealEstate contract to the specified network.
deployEscrow.js: Deploys the Escrow contract to the specified network.
React Components:
Navigation: Displays the navigation bar with connection and account information.
Search: Allows users to search for properties based on different criteria.
Home: Displays detailed information about a specific property.
Cards: Displays a list of available properties with relevant details.
Deployment and Usage:
Install Hardhat: npm install -g hardhat
Install required dependencies: npm install @openzeppelin/contracts ethers
Run npx hardhat compile to compile the contracts.
Deploy the RealEstate contract: npx hardhat run scripts/deployRealEstate.js --network <network>
Deploy the Escrow contract: npx hardhat run scripts/deployEscrow.js --network <network>
Update the config.json file with the deployed contract addresses.
Start the React app: cd frontend && npm start
Useful Commands:
npx hardhat node: Starts the Hardhat console for interacting with the contracts.
npx hardhat run <script>: Executes a specific script in the scripts directory.
npm start: Starts the React application.
Contributing:
We encourage contributions to this project. Please fork the repository, make your changes, and submit a pull request.

License:
This project is licensed under the Unlicense.

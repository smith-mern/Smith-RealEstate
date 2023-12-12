// Import the necessary libraries
const hre = require("hardhat");
const { ethers, utils } = require("ethers");

// Helper function to convert from ETH to Wei
const tokens = (n) => utils.parseUnits(n.toString(), "ether");

async function main() {
  // Get signers for different participants
  const [buyer, seller, inspector, lender] = await hre.ethers.getSigners();

  // Deploy RealEstate contract
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Real Estate Contract deployed at: ${realEstate.address}`);

  // Mint 3 properties
  console.log("Minting 3 properties...");
  for (let i = 0; i < 3; i++) {
    const tokenURI = `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${
      i + 1
    }.json`;
    await realEstate.connect(seller).mint(tokenURI);
  }

  // Deploy Escrow contract
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.deployed();

  console.log(`Escrow Contract deployed at: ${escrow.address}`);

  // Approve transfers to the Escrow contract
  console.log("Approving transfers to Escrow...");
  for (let i = 0; i < 3; i++) {
    await realEstate.connect(seller).approve(escrow.address, i + 1);
  }

  // List three properties on the Escrow contract
  console.log("Listing properties on Escrow...");
  await escrow.connect(seller).list(1, buyer.address, tokens(20), tokens(10));
  await escrow.connect(seller).list(2, buyer.address, tokens(15), tokens(15));
  await escrow.connect(seller).list(3, buyer.address, tokens(10), tokens(5));

  console.log("Deployment completed successfully!");
}

// Catch any errors and exit with error code
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

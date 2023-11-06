const { expect } = require("chai");
const { ethers } = require("hardhat", "hardhat-coverage");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let realEstate, escrow;
  let buyer, seller, inspector, lender;

  beforeEach(async () => {
    //setup accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    // deploy escrow
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    // //Mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png"
      );

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );

    // //Approve property
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();

    // List property
    transaction = await escrow
      .connect(seller)
      .list(1, buyer.address, tokens(10), tokens(5));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Returns NFT address", async () => {
      result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.address);
      console.log(result);
    });

    it("Returns seller address", async () => {
      result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
      console.log(result);
    });

    it("Returns inspector address", async () => {
      result = await escrow.inspector();
      expect(result).to.be.equal(inspector.address);
      console.log(result);
    });

    it("Returns lender address", async () => {
      result = await escrow.lender();
      expect(result).to.be.equal(lender.address);
      console.log(result);
    });
  });

  describe("listing", async () => {
    it("Update as listed", async () => {
      const result = await escrow.isListed(1);
      expect(result).to.be.equal(true);
    });

    it("Updates ownership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });

    it("Returns buyer", async () => {
      const result = await escrow.buyer(1);
      expect(result).to.be.equal(buyer.address);
    });

    it("Returns the purchase price", async () => {
      const result = await escrow.purchasePrice(1);
      expect(result).to.be.equal(tokens(10));
    });

    it("Returns the escrow amount", async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.be.equal(tokens(5));
    });

    it("only seller can call the list function", async () => {
      await expect(
        escrow.connect(buyer).list(1, buyer.address, tokens(10), tokens(5))
      ).to.be.reverted;
    });
  });

  describe("Deposits", async () => {
    it("only seller can call the deposit function", async () => {
      await expect(
        escrow.connect(seller).depositErnest(1, { value: tokens(5) })
      ).to.be.reverted;
    });

    it("Updates contract baclance", async () => {
      const transaction = await escrow
        .connect(buyer)
        .depositErnest(1, { value: tokens(5) });
      await transaction.wait();
      const result = await escrow.getBalance();
      expect(result).to.be.equal(tokens(5));
    });
  });

  describe("Inspection", async () => {
    it("Updates inspection Status", async () => {
      const transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(1, true);
      await transaction.wait();
      const result = await escrow.inspectionPassed(1);
      expect(result).to.be.equal(true);
    });
  });

  describe("Approval", async () => {
    it("Updates Approval Status", async () => {
      let transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      expect(await escrow.approval(1, buyer.address)).to.be.equal(true);
      expect(await escrow.approval(1, seller.address)).to.be.equal(true);
      expect(await escrow.approval(1, lender.address)).to.be.equal(true);
    });
  });

  describe("Sale", async () => {
    beforeEach(async () => {
      let transaction = await escrow.connect(buyer).depositErnest(1, {
        value: tokens(5),
      });
      await transaction.wait();

      transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(1, true);
      await transaction.wait();

      transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      await lender.sendTransaction({
        to: escrow.address,
        value: tokens(5),
      });

      transaction = await escrow.connect(seller).finalizeSale(1);
      await transaction.wait();
    });

    it("Updates the ownwership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address);
    });

    it("Updates contract baclance", async () => {
      expect(await escrow.getBalance()).to.be.equal(0);
    });
  });

  describe("CancelSales", async () => {
    it("Should allow the buyer to cancel the sale and receive the balance if inspection failed", async function () {
      const nftID = 1;

      // Set inspection status to failed (usually done by the inspector)
      await escrow.connect(inspector).updateInspectionStatus(nftID, false);

      // Cancel the sale (buyer decides to cancel due to failed inspection)
      await escrow.connect(buyer).cancelSale(nftID);

      // Check the buyer's balance
      const buyerBalance = await buyer.getBalance();

      expect(buyerBalance).to.be.above(0);
    });

    it("should allow the seller to cancel the sale and recieve the balance", async function () {
      const nftID = 1;

      // Cancel the sale (seller decides to cancel)
      await escrow.connect(seller).cancelSale(nftID);

      // Check the seller's balance
      const sellerBalance = await seller.getBalance();

      expect(sellerBalance).to.be.above(0);
    });
  });
});

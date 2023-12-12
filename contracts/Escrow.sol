// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Escrow {
    address public lender;
    address public inspector;
    address payable public seller;
    IERC721 public nftContract;

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(address _nftContract, address payable _seller, address _inspector, address _lender) {
        nftContract = IERC721(_nftContract);
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function list(uint256 _nftID, address _buyer, uint256 _purchasePrice, uint256 _escrowAmount)
        public
        payable
        onlySeller
    {
        require(!isListed[_nftID], "NFT already listed");
        // Transfer NFT from seller to escrow
        nftContract.transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    function depositErnest(uint256 _nftID) public payable onlybuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID], "Not enough funds");
    }

    function updateInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed;
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftID) public {
        require(isListed[_nftID], "NFT not listed");
        require(inspectionPassed[_nftID]);
        require(approval[_nftID][buyer[_nftID]]);
        require(approval[_nftID][seller]);
        require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);

        isListed[_nftID] = false;

        // Transfer funds to seller
        (bool success,) = seller.call{value: purchasePrice[_nftID]}("");
        require(success);

        // Transfer NFT to buyer
        nftContract.transferFrom(address(this), buyer[_nftID], _nftID);
    }

    function cancelSale(uint256 _nftID) public {
        require(isListed[_nftID], "NFT not listed");
        isListed[_nftID] = false;

        if (inspectionPassed[_nftID] == false) {
            // Refund escrow to buyer
            (bool success,) = buyer[_nftID].call{value: address(this).balance}("");
            require(success);
        } else {
            // Refund sale price to seller
            (bool success,) = seller.call{value: address(this).balance}("");
            require(success);
        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function");
        _;
    }

    modifier onlybuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this function");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this function");
        _;
    }
}

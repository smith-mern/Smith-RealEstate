//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public lender;
    address public inspector;
    address payable public seller;
    address public nftAddress;

    modifier onlySeller() {
        require(msg.sender == seller, "Only the seller can execute this function");
        _;
    }

    modifier onlybuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only the buyer can execute this function");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only the inspector can execute this function");
        _;
    }

    mapping(uint256 => bool) public isListed;

    mapping(uint256 => uint256) public purchasePrice; //the amount to buy the house

    mapping(uint256 => uint256) public escrowAmount;

    mapping(uint256 => address) public buyer; // the address of the buyer

    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval; //a mapping of address of the nft to if the nft has been approved

    constructor(address _nftAddress, address payable _seller, address _inspector, address _lender) {
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function list(uint256 _nftID, address _buyer, uint256 _purchasePrice, uint256 _escrowAmount)
        public
        payable
        onlySeller
    {
        // Transfer NFT from seller to escrow
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

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
        require(inspectionPassed[_nftID]);
        require(approval[_nftID][buyer[_nftID]]);
        require(approval[_nftID][seller]);
        require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);

        isListed[_nftID] = false;

        (bool success,) = payable(seller).call{value: address(this).balance}("");
        require(success);

        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }

    function cancelSale(uint256 _nftID) public {
        if (inspectionPassed[_nftID] == false) {
            payable(buyer[_nftID]).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

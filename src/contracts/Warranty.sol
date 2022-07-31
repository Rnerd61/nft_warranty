// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Warranty {
    uint256 public trr = 0;

    address internal retailer_id;
    uint256 internal warrantyPeriod;
    address public owner_id;
    bool internal not_burnt = false;
    bool internal transfered = false;
    bool internal not_bought = true;

    struct tokkenSample {
        string productName;
        string serialNumber;
        string conditionsLink;
        uint16 transactionAllowed;
        string imgeUrl;
    }

    constructor() {
        retailer_id = msg.sender;
        trr = trr + 1;
        warrantyPeriod = block.timestamp + 100;
    }

    modifier retailer(){
        require(msg.sender == retailer_id);
        _;
    }

    modifier owner(){
        require(msg.sender == owner_id && is_valid() && not_burnt);
        _;
    }

    function transfer(address transfer_id, uint256 _time) public retailer{
        if(transfered==false){
            owner_id = transfer_id;
            warrantyPeriod = block.timestamp + _time;
            transfered = true;
        }
    }

    mapping(uint => tokkenSample) public details;

    function addDetails(string memory _productName,
        string memory _serialNumber,
        string memory _conditionsLink,
        uint16 _transactionAllowed,
        string memory _imgeUrl) public retailer {
        details[trr] = tokkenSample(_productName, _serialNumber,
            _conditionsLink, _transactionAllowed, _imgeUrl);
    }

    function extend_warrenty(uint256 t) public retailer{
        warrantyPeriod += t;
    }

    function Remaining_Time() public {
        if(warrantyPeriod-block.timestamp > 0){
            trr = warrantyPeriod-block.timestamp;
        }else{
            trr = 0;
        }
    }

    function buy() public {
        if(is_valid()){
            if (not_bought){
                owner_id = msg.sender;
                not_bought = false;
            }
        }
    }


    function is_valid() internal returns(bool){
        if(warrantyPeriod-block.timestamp > 0){
            return true;
        }else{
            burn();
            return false;
        }
    }

    function burn() internal{
        not_burnt = false;
    }

}
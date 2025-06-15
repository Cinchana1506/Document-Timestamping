// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentTimestamp {
    struct Record {
        uint256 timestamp;
        address submitter;
    }

    mapping(bytes32 => Record) public records;

    function timestampDocument(bytes32 docHash) public {
        require(records[docHash].timestamp == 0, "Already timestamped");
        records[docHash] = Record(block.timestamp, msg.sender);

    }

    function getTimestamp(bytes32 docHash) public view returns (uint256, address) {
        Record memory record = records[docHash];
        return (record.timestamp, record.submitter);
    }
}

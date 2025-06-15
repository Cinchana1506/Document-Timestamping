const hre = require("hardhat");

async function main() {
  const Timestamp = await hre.ethers.getContractFactory("DocumentTimestamp");
  const contract = await Timestamp.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress(); //  get the deployed address properly
  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

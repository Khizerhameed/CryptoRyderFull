const Authentication = artifacts.require("Authentication.sol");
const RideShare = artifacts.require("Rideshare.sol");

module.exports = async function(deployer, network) {
  let authentication = await  deployer.deploy(Authentication);
  console.log(Authentication.address);
 // var app = await authentication.deployed();
  //const Auth = authentication.address;
  //console.log(authentication.address);
 let rideShare = await  deployer.deploy(RideShare,Authentication.address);
 

};



pragma solidity ^0.5.16;

import './Killable.sol';
contract Authentication is Killable {
  struct User {
    bytes32 name;
    uint8 age;
    uint256 phoneNumber;
    uint driverRating;
    uint riderRating;
    uint8 numberOfRidesGiven;// driver
    uint8 numberOfRidesTaken; //passenger
  }

  mapping (address => User) public users;

  uint private id; // Stores user id temporarily
  
    
    
  modifier onlyExistingUser {
    // Check if user exists or terminate

    require(!(users[msg.sender].name == 0x0),"signup first");
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed
    require(!(name == 0x0),"name shouldn't be equal to zero address");
    _;
  }
  modifier onlyValidFields(
    uint8 age,
    uint256 phoneNumber) {
    //updating phoneNumber and age
    require(!(age <= 0 && phoneNumber <= 0 ),"error in field values");
    _;
  }
  
  
    //writing a test method to contvert name into bytes32-> not used in app
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }
    assembly {
        result := mload(add(source, 32))
    }
}

    //another test method to convert bytes32ToString
    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
    
  function login() view public onlyExistingUser returns (bytes32) {
    return (users[msg.sender].name);
  }

  function signup(bytes32 name ) 
  public payable onlyValidName(name) returns (bytes32) {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.

    if (users[msg.sender].name == 0x0 && users[msg.sender].age == 0x0 && users[msg.sender].phoneNumber == 0x0)
    {
        users[msg.sender].name = name;

        return (users[msg.sender].name);
    }

    return (users[msg.sender].name);
  }
  

  function update(bytes32 name,
    uint8 age,
    uint256 phoneNumber)
  public
  payable
  onlyValidName(name)
  onlyExistingUser
  onlyValidFields(age,phoneNumber)
  returns (bytes32, uint8, uint256) {
    // Update user name.

     if (users[msg.sender].name != 0x0 )
     {
        users[msg.sender].name = name;
        users[msg.sender].age = age;
        users[msg.sender].phoneNumber = phoneNumber;

        return(
        users[msg.sender].name,
        users[msg.sender].age,
        users[msg.sender].phoneNumber
        );
    }
  }
  
    //called by Passenger
  function driverRating(address _userAddress, uint _driverRating) public {
      require(_driverRating <= 5,"rating start should be less than 5");
      //users[_userAddress].driverRating.push(_driverRating);
      users[_userAddress].driverRating = _driverRating;
    }
    //called by driver
    function riderRating(address _userAddress, uint _riderRating) public {
      require(_riderRating <= 5,"rating start should be less than 5");
     // users[_userAddress].riderRating.push(_riderRating);
     users[_userAddress].riderRating = _riderRating;
    }
    
    function numberOfRidesGiven(address _userAddress) public {
      users[_userAddress].numberOfRidesGiven++;
    }
    
    function numberOfRidesTaken(address _userAddress) public {
      users[_userAddress].numberOfRidesTaken++;
    }
    function getUserData(address _userAddress) public view 
    returns(bytes32 name, uint age,uint256 phoneNumber,
    uint NumberOfRidesGiven,uint NumberOfRidesTaken ,uint ,uint){
        
       return (
            users[_userAddress].name,
            users[_userAddress].age,
            users[_userAddress].phoneNumber,
            users[_userAddress].numberOfRidesGiven,
            users[_userAddress].numberOfRidesTaken,
            users[_userAddress].riderRating,
            users[_userAddress].driverRating
       );
               
    }

}
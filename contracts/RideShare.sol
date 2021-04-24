pragma solidity ^0.5.16;

import './Killable.sol';
import './Authentication.sol';



/**
 * Strings Library
 * 
 * In summary this is a simple library of string functions which make simple 
 * string operations less tedious in solidity.
 * 
 * Please be aware these functions can be quite gas heavy so use them only when
 * necessary not to clog the blockchain with expensive transactions.
 * 
 * @author James Lockhart <james@n3tw0rk.co.uk>
 */
library Strings {
    
    /**
     * Concat (High gas cost)
     * 
     * Appends two strings together and returns a new value
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string which will be the concatenated
     *              prefix
     * @param _value The value to be the concatenated suffix
     * @return string The resulting string from combinging the base and value
     */
    function concat(string memory _base, string memory _value)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length > 0);

        string memory _tmpValue = new string(_baseBytes.length +
            _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i;
        uint j;

        for (i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for (i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }

    /**
     * Index Of
     *
     * Locates and returns the position of a character within a string
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string acting as the haystack to be
     *              searched
     * @param _value The needle to search for, at present this is currently
     *               limited to one character
     * @return int The position of the needle starting from 0 and returning -1
     *             in the case of no matches found
     */
    function indexOf(string memory _base, string memory _value)
        internal
        pure
        returns (int) {
        return _indexOf(_base, _value, 0);
    }

    /**
     * Index Of
     *
     * Locates and returns the position of a character within a string starting
     * from a defined offset
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string acting as the haystack to be
     *              searched
     * @param _value The needle to search for, at present this is currently
     *               limited to one character
     * @param _offset The starting point to start searching from which can start
     *                from 0, but must not exceed the length of the string
     * @return int The position of the needle starting from 0 and returning -1
     *             in the case of no matches found
     */
    function _indexOf(string memory _base, string memory _value, uint _offset)
        internal
        pure
        returns (int) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length == 1);

        for (uint i = _offset; i < _baseBytes.length; i++) {
            if (_baseBytes[i] == _valueBytes[0]) {
                return int(i);
            }
        }

        return -1;
    }

    /**
     * Length
     * 
     * Returns the length of the specified string
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string to be measured
     * @return uint The length of the passed string
     */
    function length(string memory _base)
        internal
        pure
        returns (uint) {
        bytes memory _baseBytes = bytes(_base);
        return _baseBytes.length;
    }

    /**
     * Sub String
     * 
     * Extracts the beginning part of a string based on the desired length
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string that will be used for 
     *              extracting the sub string from
     * @param _length The length of the sub string to be extracted from the base
     * @return string The extracted sub string
     */
    function substring(string memory _base, int _length)
        internal
        pure
        returns (string memory) {
        return _substring(_base, _length, 0);
    }

    /**
     * Sub String
     * 
     * Extracts the part of a string based on the desired length and offset. The
     * offset and length must not exceed the lenth of the base string.
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string that will be used for 
     *              extracting the sub string from
     * @param _length The length of the sub string to be extracted from the base
     * @param _offset The starting point to extract the sub string from
     * @return string The extracted sub string
     */
    function _substring(string memory _base, int _length, int _offset)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);

        assert(uint(_offset + _length) <= _baseBytes.length);

        string memory _tmp = new string(uint(_length));
        bytes memory _tmpBytes = bytes(_tmp);

        uint j = 0;
        for (uint i = uint(_offset); i < uint(_offset + _length); i++) {
            _tmpBytes[j++] = _baseBytes[i];
        }

        return string(_tmpBytes);
    }

    /**
     * String Split (Very high gas cost)
     *
     * Splits a string into an array of strings based off the delimiter value.
     * Please note this can be quite a gas expensive function due to the use of
     * storage so only use if really required.
     *
     * @param _base When being used for a data type this is the extended object
     *               otherwise this is the string value to be split.
     * @param _value The delimiter to split the string on which must be a single
     *               character
     * @return string[] An array of values split based off the delimiter, but
     *                  do not container the delimiter.
     */
    function split(string memory _base, string memory _value)
        internal
        pure
        returns (string[] memory splitArr) {
        bytes memory _baseBytes = bytes(_base);

        uint _offset = 0;
        uint _splitsCount = 1;
        while (_offset < _baseBytes.length - 1) {
            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == -1)
                break;
            else {
                _splitsCount++;
                _offset = uint(_limit) + 1;
            }
        }

        splitArr = new string[](_splitsCount);

        _offset = 0;
        _splitsCount = 0;
        while (_offset < _baseBytes.length - 1) {

            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == - 1) {
                _limit = int(_baseBytes.length);
            }

            string memory _tmp = new string(uint(_limit) - _offset);
            bytes memory _tmpBytes = bytes(_tmp);

            uint j = 0;
            for (uint i = _offset; i < uint(_limit); i++) {
                _tmpBytes[j++] = _baseBytes[i];
            }
            _offset = uint(_limit) + 1;
            splitArr[_splitsCount++] = string(_tmpBytes);
        }
        return splitArr;
    }

    /**
     * Compare To
     * 
     * Compares the characters of two strings, to ensure that they have an 
     * identical footprint
     * 
     * @param _base When being used for a data type this is the extended object
     *               otherwise this is the string base to compare against
     * @param _value The string the base is being compared to
     * @return bool Simply notates if the two string have an equivalent
     */
    function compareTo(string memory _base, string memory _value)
        internal
        pure
        returns (bool) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        if (_baseBytes.length != _valueBytes.length) {
            return false;
        }

        for (uint i = 0; i < _baseBytes.length; i++) {
            if (_baseBytes[i] != _valueBytes[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compare To Ignore Case (High gas cost)
     * 
     * Compares the characters of two strings, converting them to the same case
     * where applicable to alphabetic characters to distinguish if the values
     * match.
     * 
     * @param _base When being used for a data type this is the extended object
     *               otherwise this is the string base to compare against
     * @param _value The string the base is being compared to
     * @return bool Simply notates if the two string have an equivalent value
     *              discarding case
     */
    function compareToIgnoreCase(string memory _base, string memory _value)
        internal
        pure
        returns (bool) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        if (_baseBytes.length != _valueBytes.length) {
            return false;
        }

        for (uint i = 0; i < _baseBytes.length; i++) {
            if (_baseBytes[i] != _valueBytes[i] &&
            _upper(_baseBytes[i]) != _upper(_valueBytes[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Upper
     * 
     * Converts all the values of a string to their corresponding upper case
     * value.
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string base to convert to upper case
     * @return string 
     */
    function upper(string memory _base)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        for (uint i = 0; i < _baseBytes.length; i++) {
            _baseBytes[i] = _upper(_baseBytes[i]);
        }
        return string(_baseBytes);
    }

    /**
     * Lower
     * 
     * Converts all the values of a string to their corresponding lower case
     * value.
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string base to convert to lower case
     * @return string 
     */
    function lower(string memory _base)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        for (uint i = 0; i < _baseBytes.length; i++) {
            _baseBytes[i] = _lower(_baseBytes[i]);
        }
        return string(_baseBytes);
    }

    /**
     * Upper
     * 
     * Convert an alphabetic character to upper case and return the original
     * value when not alphabetic
     * 
     * @param _b1 The byte to be converted to upper case
     * @return bytes1 The converted value if the passed value was alphabetic
     *                and in a lower case otherwise returns the original value
     */
    function _upper(bytes1 _b1)
        private
        pure
        returns (bytes1) {

        if (_b1 >= 0x61 && _b1 <= 0x7A) {
            return bytes1(uint8(_b1) - 32);
        }

        return _b1;
    }

    /**
     * Lower
     * 
     * Convert an alphabetic character to lower case and return the original
     * value when not alphabetic
     * 
     * @param _b1 The byte to be converted to lower case
     * @return bytes1 The converted value if the passed value was alphabetic
     *                and in a upper case otherwise returns the original value
     */
    function _lower(bytes1 _b1)
        private
        pure
        returns (bytes1) {

        if (_b1 >= 0x41 && _b1 <= 0x5A) {
            return bytes1(uint8(_b1) + 32);
        }

        return _b1;
    }

}

//date time 
// ----------------------------------------------------------------------------
// BokkyPooBah's DateTime Library v1.01
//
// A gas-efficient Solidity date and time library
//
// https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
//
// Tested date range 1970/01/01 to 2345/12/31
//
// Conventions:
// Unit      | Range         | Notes
// :-------- |:-------------:|:-----
// timestamp | >= 0          | Unix timestamp, number of seconds since 1970/01/01 00:00:00 UTC
// year      | 1970 ... 2345 |
// month     | 1 ... 12      |
// day       | 1 ... 31      |
// hour      | 0 ... 23      |
// minute    | 0 ... 59      |
// second    | 0 ... 59      |
// dayOfWeek | 1 ... 7       | 1 = Monday, ..., 7 = Sunday
//
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2018-2019. The MIT Licence.
// ----------------------------------------------------------------------------

library BokkyPooBahsDateTimeLibrary {

    uint constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint constant SECONDS_PER_HOUR = 60 * 60;
    uint constant SECONDS_PER_MINUTE = 60;
    int constant OFFSET19700101 = 2440588;

    uint constant DOW_MON = 1;
    uint constant DOW_TUE = 2;
    uint constant DOW_WED = 3;
    uint constant DOW_THU = 4;
    uint constant DOW_FRI = 5;
    uint constant DOW_SAT = 6;
    uint constant DOW_SUN = 7;

    // ------------------------------------------------------------------------
    // Calculate the number of days from 1970/01/01 to year/month/day using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and subtracting the offset 2440588 so that 1970/01/01 is day 0
    //
    // days = day
    //      - 32075
    //      + 1461 * (year + 4800 + (month - 14) / 12) / 4
    //      + 367 * (month - 2 - (month - 14) / 12 * 12) / 12
    //      - 3 * ((year + 4900 + (month - 14) / 12) / 100) / 4
    //      - offset
    // ------------------------------------------------------------------------
    function _daysFromDate(uint year, uint month, uint day) internal pure returns (uint _days) {
        require(year >= 1970);
        int _year = int(year);
        int _month = int(month);
        int _day = int(day);

        int __days = _day
          - 32075
          + 1461 * (_year + 4800 + (_month - 14) / 12) / 4
          + 367 * (_month - 2 - (_month - 14) / 12 * 12) / 12
          - 3 * ((_year + 4900 + (_month - 14) / 12) / 100) / 4
          - OFFSET19700101;

        _days = uint(__days);
    }

    // ------------------------------------------------------------------------
    // Calculate year/month/day from the number of days since 1970/01/01 using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and adding the offset 2440588 so that 1970/01/01 is day 0
    //
    // int L = days + 68569 + offset
    // int N = 4 * L / 146097
    // L = L - (146097 * N + 3) / 4
    // year = 4000 * (L + 1) / 1461001
    // L = L - 1461 * year / 4 + 31
    // month = 80 * L / 2447
    // dd = L - 2447 * month / 80
    // L = month / 11
    // month = month + 2 - 12 * L
    // year = 100 * (N - 49) + year + L
    // ------------------------------------------------------------------------
    function _daysToDate(uint _days) internal pure returns (uint year, uint month, uint day) {
        int __days = int(_days);

        int L = __days + 68569 + OFFSET19700101;
        int N = 4 * L / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = 4000 * (L + 1) / 1461001;
        L = L - 1461 * _year / 4 + 31;
        int _month = 80 * L / 2447;
        int _day = L - 2447 * _month / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint(_year);
        month = uint(_month);
        day = uint(_day);
    }

    function timestampFromDate(uint year, uint month, uint day) internal pure returns (uint timestamp) {
        timestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY;
    }
    function timestampFromDateTime(uint year, uint month, uint day, uint hour, uint minute, uint second) internal pure returns (uint timestamp) {
        timestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + hour * SECONDS_PER_HOUR + minute * SECONDS_PER_MINUTE + second;
    }
    function timestampToDate(uint timestamp) internal pure returns (uint year, uint month, uint day) {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
    function timestampToDateTime(uint timestamp) internal pure returns (uint year, uint month, uint day, uint hour, uint minute, uint second) {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
        secs = secs % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
        second = secs % SECONDS_PER_MINUTE;
    }

    function isValidDate(uint year, uint month, uint day) internal pure returns (bool valid) {
        if (year >= 1970 && month > 0 && month <= 12) {
            uint daysInMonth = _getDaysInMonth(year, month);
            if (day > 0 && day <= daysInMonth) {
                valid = true;
            }
        }
    }
    function isValidDateTime(uint year, uint month, uint day, uint hour, uint minute, uint second) internal pure returns (bool valid) {
        if (isValidDate(year, month, day)) {
            if (hour < 24 && minute < 60 && second < 60) {
                valid = true;
            }
        }
    }
    function isLeapYear(uint timestamp) internal pure returns (bool leapYear) {
        (uint year,,) = _daysToDate(timestamp / SECONDS_PER_DAY);
        leapYear = _isLeapYear(year);
    }
    function _isLeapYear(uint year) internal pure returns (bool leapYear) {
        leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
    function isWeekDay(uint timestamp) internal pure returns (bool weekDay) {
        weekDay = getDayOfWeek(timestamp) <= DOW_FRI;
    }
    function isWeekEnd(uint timestamp) internal pure returns (bool weekEnd) {
        weekEnd = getDayOfWeek(timestamp) >= DOW_SAT;
    }
    function getDaysInMonth(uint timestamp) internal pure returns (uint daysInMonth) {
        (uint year, uint month,) = _daysToDate(timestamp / SECONDS_PER_DAY);
        daysInMonth = _getDaysInMonth(year, month);
    }
    function _getDaysInMonth(uint year, uint month) internal pure returns (uint daysInMonth) {
        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            daysInMonth = 31;
        } else if (month != 2) {
            daysInMonth = 30;
        } else {
            daysInMonth = _isLeapYear(year) ? 29 : 28;
        }
    }
    // 1 = Monday, 7 = Sunday
    function getDayOfWeek(uint timestamp) internal pure returns (uint dayOfWeek) {
        uint _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = (_days + 3) % 7 + 1;
    }

    function getYear(uint timestamp) internal pure returns (uint year) {
        (year,,) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
    function getMonth(uint timestamp) internal pure returns (uint month) {
        (,month,) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
    function getDay(uint timestamp) internal pure returns (uint day) {
        (,,day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
    function getHour(uint timestamp) internal pure returns (uint hour) {
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
    }
    function getMinute(uint timestamp) internal pure returns (uint minute) {
        uint secs = timestamp % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
    }
    function getSecond(uint timestamp) internal pure returns (uint second) {
        second = timestamp % SECONDS_PER_MINUTE;
    }

    function addYears(uint timestamp, uint _years) internal pure returns (uint newTimestamp) {
        (uint year, uint month, uint day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        year += _years;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + timestamp % SECONDS_PER_DAY;
        require(newTimestamp >= timestamp);
    }
    function addMonths(uint timestamp, uint _months) internal pure returns (uint newTimestamp) {
        (uint year, uint month, uint day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        month += _months;
        year += (month - 1) / 12;
        month = (month - 1) % 12 + 1;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + timestamp % SECONDS_PER_DAY;
        require(newTimestamp >= timestamp);
    }
    function addDays(uint timestamp, uint _days) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _days * SECONDS_PER_DAY;
        require(newTimestamp >= timestamp);
    }
    function addHours(uint timestamp, uint _hours) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _hours * SECONDS_PER_HOUR;
        require(newTimestamp >= timestamp);
    }
    function addMinutes(uint timestamp, uint _minutes) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp >= timestamp);
    }
    function addSeconds(uint timestamp, uint _seconds) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp + _seconds;
        require(newTimestamp >= timestamp);
    }

    function subYears(uint timestamp, uint _years) internal pure returns (uint newTimestamp) {
        (uint year, uint month, uint day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        year -= _years;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + timestamp % SECONDS_PER_DAY;
        require(newTimestamp <= timestamp);
    }
    function subMonths(uint timestamp, uint _months) internal pure returns (uint newTimestamp) {
        (uint year, uint month, uint day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        uint yearMonth = year * 12 + (month - 1) - _months;
        year = yearMonth / 12;
        month = yearMonth % 12 + 1;
        uint daysInMonth = _getDaysInMonth(year, month);
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        newTimestamp = _daysFromDate(year, month, day) * SECONDS_PER_DAY + timestamp % SECONDS_PER_DAY;
        require(newTimestamp <= timestamp);
    }
    function subDays(uint timestamp, uint _days) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _days * SECONDS_PER_DAY;
        require(newTimestamp <= timestamp);
    }
    function subHours(uint timestamp, uint _hours) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _hours * SECONDS_PER_HOUR;
        require(newTimestamp <= timestamp);
    }
    function subMinutes(uint timestamp, uint _minutes) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp <= timestamp);
    }
    function subSeconds(uint timestamp, uint _seconds) internal pure returns (uint newTimestamp) {
        newTimestamp = timestamp - _seconds;
        require(newTimestamp <= timestamp);
    }

    function diffYears(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _years) {
        require(fromTimestamp <= toTimestamp);
        (uint fromYear,,) = _daysToDate(fromTimestamp / SECONDS_PER_DAY);
        (uint toYear,,) = _daysToDate(toTimestamp / SECONDS_PER_DAY);
        _years = toYear - fromYear;
    }
    function diffMonths(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _months) {
        require(fromTimestamp <= toTimestamp);
        (uint fromYear, uint fromMonth,) = _daysToDate(fromTimestamp / SECONDS_PER_DAY);
        (uint toYear, uint toMonth,) = _daysToDate(toTimestamp / SECONDS_PER_DAY);
        _months = toYear * 12 + toMonth - fromYear * 12 - fromMonth;
    }
    function diffDays(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _days) {
        require(fromTimestamp <= toTimestamp);
        _days = (toTimestamp - fromTimestamp) / SECONDS_PER_DAY;
    }
    function diffHours(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _hours) {
        require(fromTimestamp <= toTimestamp);
        _hours = (toTimestamp - fromTimestamp) / SECONDS_PER_HOUR;
    }
    function diffMinutes(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _minutes) {
        require(fromTimestamp <= toTimestamp);
        _minutes = (toTimestamp - fromTimestamp) / SECONDS_PER_MINUTE;
    }
    function diffSeconds(uint fromTimestamp, uint toTimestamp) internal pure returns (uint _seconds) {
        require(fromTimestamp <= toTimestamp);
        _seconds = toTimestamp - fromTimestamp;
    }
}

contract Rideshare is  Killable {
  
  //using AddrArrayLib for AddrArrayLib.Addresses;
  using Strings for string;
  //using dataTime library
  using BokkyPooBahsDateTimeLibrary for uint;
    
    
  struct Passenger {
    uint price;
    string state; // initial, driverConfirmed, passengerConfirmed, enRoute, completion, canceled
  }

  struct Ride {
    address driver;
    string carName;
    uint drivingCost;
    uint capacity;
    string originAddress;
    string destAddress;
    uint createdAt; 
    uint confirmedAt;//confirmed by
    uint destinationDate;
    uint departureTime;
    uint arrivaltime;
    mapping (address => Passenger) passengers;
    address[] passengerAccts;
    mapping(address=>bool) hasPaid;
    uint unPaidTimestamp;
  }
  
  Ride[] public rides;
  
  //uint public rideCount;
  
  address[] addressesEnRoute;
  
  mapping (address => uint) reputation;
  mapping (address => uint) public riderData;
  mapping (address => uint) public driverData;

    // AddrArrayLib.Addresses bidderAddressesList;
    // AddrArrayLib.Addresses approvedAddressesList;
    
  
  mapping(address => DriverRides) public DRides;
  struct DriverRides{
    uint totalRides;
    uint cancelledRides;
    uint totalEarning;
  } 
  
  Authentication public authentication;
  
      constructor(address _authentication) public {
       require(
            _authentication != address(0),
            "constructor::Cannot have null address for _authentication"
        );
        authentication = Authentication(_authentication);
           }
  // for now, only drivers can create Rides
  function createRide(
  string memory _carName,
  uint _driverCost,
  uint _capacity,
  string memory _originAddress,
  string memory _destAddress,
  uint _confirmedAt, //confirmed by pessangers
  uint _destinationDate,//initial 0, now in arrived function
  uint _departureTime,// has to given by user in timestamp
  uint _arrivaltime // initial 0
  //uint _unPaidTimestamp //initial 0
  ) public {
    address[] memory _passengerAccts;
    
    
    rides.push(Ride(msg.sender,_carName ,_driverCost,
    _capacity, _originAddress, _destAddress,
    block.timestamp, _confirmedAt, _destinationDate,
    _departureTime,_arrivaltime,
    _passengerAccts,now));
    uint rideCount = getRideCount();
    driverData[msg.sender] = rideCount;
    
  }
  function getRiderData() external view returns(uint){
      return riderData[msg.sender];
  }
  function getDriverData() external view returns(uint){
      return driverData[msg.sender];
  }
  
  
  // called by passenger
  function joinRide(uint rideNumber) public payable {
    Ride storage curRide = rides[rideNumber];
    require(msg.value == curRide.drivingCost,"value must be equal to driving cost");
        Passenger storage passenger = curRide.passengers[msg.sender];    
        
        passenger.price = msg.value;
        passenger.state = "initial";
        riderData[msg.sender] = rideNumber + 1;
        
        rides[rideNumber].passengerAccts.push(msg.sender) -1; //***
         }
  
  function getPassengers(uint rideNumber) view public returns(address[] memory) {
    return rides[rideNumber].passengerAccts;
  }

  function getPassengerRideState(uint rideNumber, address passenger) view public returns(string memory) {
    return rides[rideNumber].passengers[passenger].state;
  }

  function getRide(uint rideNumber) public view returns (
    address _driver,
    string memory _carName,
    uint _drivingCost,
    uint _capacity,
    string memory _originAddress,
    string memory _destAddress,
    uint _createdAt,
    uint _confirmedAt, 
    uint _destinationDate,
    uint _departureTime,
    uint _arrivaltime,
    uint _unPaidTimestamp
  ) {
    Ride memory ride = rides[rideNumber];
    return (
      ride.driver,
      ride.carName,
      ride.drivingCost,
      ride.capacity,
      ride.originAddress,
      ride.destAddress,
      ride.createdAt,
      ride.confirmedAt,
      ride.destinationDate,
      ride.departureTime,
      ride.arrivaltime,
      ride.unPaidTimestamp
    );
  }

  function getRideCount() public view returns(uint) {
    return rides.length;
  }
  
  function passengerInRide(uint rideNumber, address passengerAcct) public view returns (bool) {
    Ride storage curRide = rides[rideNumber];
    for(uint i = 0; i < curRide.passengerAccts.length; i++) {
      if (curRide.passengerAccts[i] == passengerAcct) {
        return true;
      }
    }
    return false;
  }
  
  function cancelRide(uint rideNumber) public{
    Ride storage curRide = rides[rideNumber];
    require(block.timestamp < curRide.confirmedAt);
    riderData[msg.sender]=0;
    //
    // DriverRides memory dRides;
   
    if (msg.sender == curRide.driver) {
      for (uint i = 0; i < curRide.passengerAccts.length; i++) {
       // curRide.passengerAccts[i].transfer(curRide.passengers[curRide.passengerAccts[i]].price);
        address(uint160(curRide.passengerAccts[i])).transfer(curRide.passengers[curRide.passengerAccts[i]].price);
        //
        if(DRides[msg.sender].cancelledRides >0){DRides[msg.sender].cancelledRides--;}
        // DRides[msg.sender].cancelledRides--;
      }
    } else if (passengerInRide(rideNumber, msg.sender)) {
      msg.sender.transfer(curRide.passengers[msg.sender].price);
      //
      if(DRides[msg.sender].cancelledRides >0){DRides[msg.sender].cancelledRides--;}
    }
    
  }

  // called by passenger
  function confirmDriverMet(uint rideNumber) public {
    require(passengerInRide(rideNumber, msg.sender));
    Ride storage curRide = rides[rideNumber];
    // uint(keccak256(abi.encodePacked(source))); was in 0.4.0
    if (keccak256(abi.encodePacked(curRide.passengers[msg.sender].state)) == keccak256("passengersConfirmed")) {
      curRide.passengers[msg.sender].state = "enRoute";
    } else {
      curRide.passengers[msg.sender].state = "driverConfirmed";
    }
    
  }
  
  // called by driver
  function confirmPassengersMet(uint rideNumber, address[] memory passengerAddresses)  public {
    Ride storage curRide = rides[rideNumber];
    require(msg.sender == curRide.driver);
    address _userAddress = curRide.driver;
    
    for(uint i=0; i < passengerAddresses.length; i++) {
      //string memory curState = curRide.passengers[passengerAddresses[i]].state;
      if (keccak256(abi.encodePacked(curRide.passengers[passengerAddresses[i]].state)) == keccak256("driverConfirmed")) {
        curRide.passengers[passengerAddresses[i]].state = "enRoute";
        DRides[msg.sender].totalRides++;
        authentication.numberOfRidesTaken(_userAddress);
      } else {
        curRide.passengers[passengerAddresses[i]].state = "passengersConfirmed";
        DRides[msg.sender].totalRides++;
        authentication.numberOfRidesTaken(_userAddress);
      }
    }
    // require(rides[rideNumber].state == "confirmed");
  }
   
  function enRouteList(uint rideNumber) public returns(address[] memory) {
    Ride storage curRide = rides[rideNumber];
    //for version 5x
    address[] memory tempAddressesEnRoute;
    addressesEnRoute = tempAddressesEnRoute;
    for(uint i = 0; i < curRide.passengerAccts.length; i++) {
      if (keccak256(abi.encodePacked(curRide.passengers[curRide.passengerAccts[i]].state)) == keccak256("enRoute")) {
        addressesEnRoute.push(curRide.passengerAccts[i]);
      }
    }
   
  }
  
  // called by passenger
  function arrived(uint rideNumber, uint _rate) public returns(uint256) {
    require(passengerInRide(rideNumber, msg.sender));
    Ride storage curRide = rides[rideNumber];
    address _userAddress = curRide.driver;
    address(uint160(curRide.driver)).transfer(curRide.passengers[msg.sender].price);
    curRide.passengers[msg.sender].state = "completion";
    //for keeping record that this passenger has paid rent
    curRide.hasPaid[msg.sender] = true;
    authentication.driverRating(_userAddress, _rate);
    authentication.numberOfRidesGiven(_userAddress);
    DRides[curRide.driver].totalEarning += curRide.drivingCost;
    //destinationDate
    curRide.destinationDate = block.timestamp;
    curRide.arrivaltime = block.timestamp;
    curRide.destinationDate = block.timestamp;
     //setting time stamp here
    curRide.unPaidTimestamp = block.timestamp;
     BokkyPooBahsDateTimeLibrary.addMinutes(curRide.unPaidTimestamp, 5);
    
    //paid accounts
    
    return curRide.drivingCost;
  }
  //called by driver
  function riderRating(uint rideNumber, uint _rate) public{
    Ride storage curRide = rides[rideNumber];
    address _userAddress = curRide.driver;
    
    authentication.riderRating(_userAddress,_rate);
    
  }
  
  //called by driver
  function getPaidPassengers(uint rideNumber, address _passengerAddress) view public returns(bool) {
    Ride storage curRide = rides[rideNumber];
     return curRide.hasPaid[_passengerAddress];
  }
    //called by driver
  function getMoneyFromUnPaidPassendgers(uint rideNumber) public returns( bool){
    Ride storage curRide = rides[rideNumber];
    uint a = curRide.unPaidTimestamp;
  
   
     require(curRide.unPaidTimestamp >=a ,"time not completed to call");
    
    for (uint i = 0; i <= curRide.passengerAccts.length; i++) {
    //checking bool and state
    if( curRide.hasPaid[curRide.passengerAccts[i]]= false){
    require(Strings.compareTo(curRide.passengers[curRide.passengerAccts[i]].state,
    curRide.passengers[curRide.passengerAccts[i]].state),"this passenger is not in this ride or has paid");
    address(uint160(curRide.driver)).transfer(curRide.passengers[curRide.passengerAccts[i]].price);
       
    return true;
        
     }
     else
     {
         return false;
     }
        
    }
  }
  
  
  
  
  //filters by origin
  function filterByOrigin(uint rideNumber, string memory _origin) public view returns (
    address _driver,
    string memory _carName,
    uint _drivingCost,
    uint _capacity,
    string memory _originAddress,
    string memory _destAddress,
    uint _createdAt,
    uint _confirmedAt,
    uint _destinationDate,
    uint _departureTime,
    uint _arrivaltime
  ){
     Ride memory ride = rides[rideNumber];
     if(Strings.compareTo(ride.originAddress,_origin)){
      return (
      ride.driver,
      ride.carName,
      ride.drivingCost,
      ride.capacity,
      ride.originAddress,
      ride.destAddress,
      ride.createdAt,
      //BokkyPooBahsDateTimeLibrary.timestampToDate(ride.createdAt),
      ride.confirmedAt,
      ride.destinationDate,
      ride.departureTime,
      ride.arrivaltime
    );
     }
    
  }
  //filter by destinationDate
  function filtetbyDestinationDate(uint rideNumber,uint _DestinationDate) public view returns(   
    address _driver,
    string memory _carName,
    uint _drivingCost,
    uint _capacity,
    string memory _originAddress,
    string memory _destAddress,
    uint _createdAt,
    uint _confirmedAt,
    uint _destinationDate,
    uint _departureTime,
    uint _arrivaltime) {
     Ride memory ride = rides[rideNumber];
     if(ride.destinationDate == _DestinationDate){
      return (
      ride.driver,
      ride.carName,
      ride.drivingCost,
      ride.capacity,
      ride.originAddress,
      ride.destAddress,
      ride.createdAt,
      ride.confirmedAt,
      ride.destinationDate,
      ride.departureTime,
      ride.arrivaltime
    );
     }
      
  }
  //filter by time of departureTime
  function filterByTimeOfDeparture(uint rideNumber,uint _DepartureTime ) public view returns(   
    address _driver,
    string memory _carName,
    uint _drivingCost,
    uint _capacity,
    string memory _originAddress,
    string memory _destAddress,
    uint _createdAt,
    uint _confirmedAt,
    uint _destinationDate,
    uint _departureTime,
    uint _arrivaltime) {
     Ride memory ride = rides[rideNumber];
     if(ride.departureTime == _DepartureTime){
      return (
      ride.driver,
      ride.carName,
      ride.drivingCost,
      ride.capacity,
      ride.originAddress,
      ride.destAddress,
      ride.createdAt,
      ride.confirmedAt,
      ride.destinationDate,
      ride.departureTime,
      ride.arrivaltime
    );
     }}
       
  
  //filter by arrival time
  function filterByArrivalTime(uint rideNumber,uint _Arrivaltime ) public view returns(   
    address _driver,
    string memory _carName,
    uint _drivingCost,
    uint _capacity,
    string memory _originAddress,
    string memory _destAddress,
    uint _createdAt,
    uint _confirmedAt,
    uint _destinationDate,
    uint _departureTime,
    uint _arrivaltime) {
     Ride memory ride = rides[rideNumber];
     if(ride.arrivaltime == _Arrivaltime){
      return (
      ride.driver,
      ride.carName,
      ride.drivingCost,
      ride.capacity,
      ride.originAddress,   
      ride.destAddress,
      ride.createdAt,
      ride.confirmedAt,
      ride.destinationDate,
      ride.departureTime,
      ride.arrivaltime
    );
     }}
  
  
}

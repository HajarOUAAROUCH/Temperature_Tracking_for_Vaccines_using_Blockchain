// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract MyTemp {
    // the temperature is measured in 3 points : factory, distributor, final destination
    uint[3][] public temperature; 
    uint[3] public data;
    uint i=0;
    uint public d;
    

    function setTemp(uint _d) external{
        d = _d;
        data[i]= d;        
        i+=1;
        if (i==3){
            i=0;
            temperature.push(data);
        }
    }

    function getTemp() external view returns (uint[3] memory, uint[3][] memory ) {
        return (data,temperature);
    }
}
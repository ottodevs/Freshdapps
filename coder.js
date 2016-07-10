
    var SolidityCoder = require("web3/lib/solidity/coder.js");

// dont override global variable
    if (typeof window !== 'undefined' && typeof window.SolidityCoder === 'undefined') {
        window.SolidityCoder = SolidityCoder;
    }
(function() {
  'use strict';

  angular
    .module('dabla')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($http, $location) {
    var vm = this;
    var web3 = new Web3();
    var address = "0x27ce8BfcfB4DF18835b249e4b5aFf3D52bd7Da3B";
    var contractFunction = $location.path() == "/new" ?  "getNewDappsAtPosition(uint256)" : "getDappsPosition(uint256)";

    vm.dapps = [];
    var numDapps = 0;

      /**
       * This function continuously loads dapps until it reaches numDapps. One call after the other, we don't want to DDoS etherscan...
       * @param position
       */
    function loadAllDappsFrom(position) {
      if (position <= numDapps && position <= 10) {
        $http({
          method: "GET",
          url: "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" + address + "&data=" + web3.sha3(contractFunction).substring(0, 10) + SolidityCoder.encodeParam('uint256', position)
        }).then(function resultSuccess(payload) {
          vm.dapps.push(SolidityCoder.decodeParams(['string', 'string', 'uint256', 'address'], payload.data.result.substring(2)));
          loadAllDappsFrom(position+1);
        }, function resultError(payload) {
          console.error(payload);
        });
      }
    }

      /**
       * First we want to get the number of Dapps in the chain.
       */
    $http({
      method: "GET",
      url: "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" + address + "&data=" + web3.sha3("getDappsLength()").substring(0, 10)
    }).then(function resultSuccess(payload) {
      numDapps = SolidityCoder.decodeParams(['uint256'],payload.data.result.substring(2)).toString();
      loadAllDappsFrom(1); //then we want to start loading it.
    }, function resultError(payload) {
      console.error(payload);
    });


  }
})();

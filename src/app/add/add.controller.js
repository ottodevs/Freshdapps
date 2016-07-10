(function() {
  'use strict';

  angular
    .module('dabla')
    .controller('AddController', AddController);

  /** @ngInject */
  function AddController($mdDialog) {
    var vm = this;
    var web3 = new Web3();

    vm.title="";
    vm.link="";
    vm.beneficiary="";

    vm.address = "0x27ce8BfcfB4DF18835b249e4b5aFf3D52bd7Da3B";
    vm.abi = '[ { "constant": false, "inputs": [ { "name": "dappAddress", "type": "address" } ], "name": "upVoteAndSend", "outputs": [], "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "type": "function" }, { "constant": false, "inputs": [], "name": "payout", "outputs": [], "type": "function" }, { "constant": true, "inputs": [ { "name": "newPosition", "type": "uint256" } ], "name": "getNewDappsAtPosition", "outputs": [ { "name": "name", "type": "string" }, { "name": "link", "type": "string" }, { "name": "points", "type": "uint256" }, { "name": "donationcontract", "type": "address" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "getDappsLength", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "type": "function" }, { "constant": true, "inputs": [ { "name": "upvotedPosition", "type": "uint256" } ], "name": "getDappsPosition", "outputs": [ { "name": "name", "type": "string" }, { "name": "link", "type": "string" }, { "name": "points", "type": "uint256" }, { "name": "donationcontract", "type": "address" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "name", "type": "string" }, { "name": "link", "type": "string" }, { "name": "beneficiary", "type": "address" } ], "name": "addDapp", "outputs": [ { "name": "", "type": "address" } ], "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "donationAddress", "type": "address" }, { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "link", "type": "string" } ], "name": "DappAdded", "type": "event" } ]';

    vm.createPayload = function() {
      vm.errors = undefined;
      try {
        vm.payload = web3.sha3("addDapp(string,string,address)").substring(0,10) + SolidityCoder.encodeParams(["string", "string", "address"], [vm.title, vm.link, vm.beneficiary]);
      } catch(a) {
        vm.errors = a;
      }
    };

    vm.showAlert = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      console.log("bla");
      $mdDialog.show(
          $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('Add the contract to your Wallet')
              .textContent('Address:  '+vm.address+'    ABI:  '+vm.abi)
              .ariaLabel('Add Contract')
              .ok('Got it!')
              .targetEvent(ev)
      );
    };


  }
})();

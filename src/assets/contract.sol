contract FreshDapps {
    address creator;


    struct DApp {
        string name;
        string link;
        address donationcontract;
        uint points;
		uint created;
    }

	struct DonationAddressesDapps {
		bool wasSet;
		uint dappsArrayKeyId;
	}

    DApp[] dapps;

    mapping(address => DonationAddressesDapps) dappsMapping;
	event DappAdded(address donationAddress, string name, string link);

	 function FreshDapps() {
        creator = msg.sender;
    }

	//fallback function in case something goes wrong
	function payout() {
		if(msg.sender == creator) {
			creator.send(this.balance);
		}
	}


    function addDapp(string name, string link, address beneficiary) returns (address){
        if(msg.value >= 1 ether) {
            if(creator.send(msg.value)) {

				//add a new donationcontract
                address donationcontract = new DappsDonation(beneficiary);

				//push that thing to our array
                uint dapps_id = dapps.push(DApp(name, link, donationcontract, 0, now))-1;
				//we do not map the beneficiary, because we could have multiple times the same.
				dappsMapping[donationcontract] = DonationAddressesDapps(true,dapps_id);

				//emit an event
				DappAdded(donationcontract, name, link);

				//return the contract address for further use
                return donationcontract;
            }
        }
        throw;
    }

	function upVoteAndSend(address dappAddress){
		 //if we have that in the database
        if(dappsMapping[dappAddress].wasSet == true) {
			//find the address of the donation-dapp
            DappsDonation dappsDonation = DappsDonation(dapps[dappsMapping[dappAddress].dappsArrayKeyId].donationcontract);
			//get the beneficiary from there
			//and send him the msg_value
			if(msg.value >= 1 ether) {
				//we only want to do this if the donation is bigger than 1 ether.
				if(dappsDonation.getBeneficiary().send(msg.value)) {
					//and if it was more than 1 ether in donation, add a point.
					if(msg.value >= 1 ether) {
						dapps[dappsMapping[dappAddress].dappsArrayKeyId].points++;
					}
				} else {
					throw;
				}
			} else {
				//the amount was smaller than 1 ether, so we don't keep anyting, but also no upvotes, sorry...
				if(!dappsDonation.getBeneficiary().send(msg.value)) {
					throw;
				}
			}
        } else {
			//if we don't know who that is - just get the hell out of here.
			throw;
		}
    }


	//this is a tricky one, it will eventually take a lot of computational power
	//but it should work fine for the first few positions.
    function getDappsPosition(uint upvotedPosition) constant returns (string name, string link, uint points, address donationcontract) {
		if(upvotedPosition > dapps.length || upvotedPosition <= 0) {
			throw;
		}
		DApp[] memory myDapps = new DApp[](upvotedPosition);
		for(uint numIndex = 0; numIndex < dapps.length; numIndex++) {

			//we only support max 256
			for(var i = upvotedPosition; i > 0; i--) {
				//move it ->in between<- where it belongs - meaning move all less points one lower
				var j = 1;
				//if the link has more points
				if(myDapps[i-1].points < dapps[numIndex].points) {
					for(j = 1; j < i; j++) {
						myDapps[j-1] = myDapps[j];
					}
					myDapps[i-1] = dapps[numIndex];
					break;
				//or if the link has the same points but is an earlier submission
				} else if(myDapps[i-1].points == dapps[numIndex].points && myDapps[i-1].created < dapps[numIndex].created) {
					for(j = 1; j < i; j++) {
						myDapps[j-1] = myDapps[j];
					}
					myDapps[i-1] = dapps[numIndex];
					break;
				}
			}
		}
        return (myDapps[0].name,myDapps[0].link,myDapps[0].points,myDapps[0].donationcontract);

		 }
	//this just returns the most new positions.
    function getNewDappsAtPosition(uint newPosition) constant returns (string name, string link, uint points, address donationcontract) {
		if(newPosition > dapps.length || newPosition <= 0) {
			throw;
		}
		DApp newDapp = dapps[dapps.length - newPosition];
        return (newDapp.name,newDapp.link,newDapp.points,newDapp.donationcontract);
    }


	function getDappsLength() constant returns (uint) {
		return dapps.length;
	}




    function kill() {
       if(msg.sender == creator) { suicide(creator); }
    }
}

contract DappsDonation {
    address beneficiary;
    address creatorContract;

    function DappsDonation(address beneficiaryAddr) {
        creatorContract = msg.sender;
        beneficiary = beneficiaryAddr;
    }

	function getBeneficiary() returns (address) {
        return beneficiary;
    }

    function() {
		if(!creatorContract.call.value(msg.value)(bytes4(sha3("upVoteAndSend(address)")),this)) {
			throw;
		}
    }

}
pragma solidity ^0.5.0;

contract Election{ 
	//step 1:(Smoke test) Store candidate
	//		 read candidate
	//	     Contructor : we need it to run whenevr we initialize our SM upon migration
	//   		|-> set the val of the variable(Candidate)

	//Step 2: Model a candidate
	struct Candidate{
		uint id;
		string name;
		uint countVote;
		string partyName;
	}

	struct Timer{
		uint month;
		uint day;
		uint hour;
		uint min;
		uint sec;
	}
	//mapping the voters accoording 
	//to their address as they've voted 
	//or not.....
	mapping (address => bool) public voters;

	//Store Candidate
	//fetch candidate
	//count the number of the candidates
	mapping(uint => Candidate) public candidates;
	mapping(uint => Timer) public TimingList;
	mapping(uint => uint) public idAndVotes;
	mapping(uint => string) public idAndName;

	// Candidate[] public candidatesArray;
	address[] public voterAddresses;

	uint public timingNumber;
	uint public countCandidate;
	string public winnerName="";

	constructor() public {

	}

	function addCandidates(string memory _name, string memory _partyName) public
	{
		countCandidate++;
		candidates[countCandidate] = Candidate(countCandidate , _name , 0 , _partyName);
		idAndName[countCandidate] = _name;
		idAndVotes[countCandidate] = 0;
	}

	function vote (uint _candidateId) public{
		//check if this voter has voted jst once as a condition
		require(!voters[msg.sender]);

		//check if the the candidate id is valid as a condition
		require( _candidateId>0 && _candidateId<=countCandidate );

		//mark the voter that has voted
		voters[msg.sender] = true;
		voterAddresses.push(msg.sender);

		//increase the votecount of a perticular candidate
		candidates[_candidateId].countVote++;
		idAndVotes[_candidateId]+=1;  

	}

	function changeTimer(uint _month, uint _day, uint _hour, uint _min, uint _sec) public{
		timingNumber++;
		TimingList[timingNumber] = Timer(_month , _day , _hour , _min , _sec);
	}

	function resetAll() public{
		countCandidate = 0;
		// delete candidatesArray;
		for(uint i=0; i<voterAddresses.length; i++){
			address votersAcc = voterAddresses[i];
			delete voters[votersAcc];
		}
		for(uint i=1 ; i<=countCandidate ; i++)
		{
			delete idAndVotes[i];
			delete idAndName[i];
		}
		winnerName="";

		TimingList[timingNumber] = Timer(0,0,0,0,0);
		timingNumber = 0;
	}

	function defineWinner() public{
	    uint count = 0;
	    for (uint i=1 ; i<=countCandidate ; i++){
	    	string memory name = idAndName[i];
	    	uint votes = idAndVotes[i];
	    	if(votes > count){
	    		count = votes ;
	    		winnerName = "";
	    		winnerName = append(winnerName , name);
	    	}
	    	else if(votes == count && count!=0){
	    		string memory x = append("," , name);
	    		winnerName = append(winnerName , x);
	    	}
	    }
	}

	function append(string memory a, string memory b) internal pure returns (string memory) {
    	return string(abi.encodePacked(a, b));
	}
}

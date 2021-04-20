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

	uint public timingNumber;
	uint public countCandidate;

	constructor() public {
		// addCandidates("Abir"  , "A");
		// addCandidates("Prato" , "B");
		// addCandidates("Rakib" , "C");
		// addCandidates("Shanto", "D");
	}

	function addCandidates(string memory _name, string memory _partyName) public
	{
		countCandidate++;
		candidates[countCandidate] = Candidate(countCandidate , _name , 0 , _partyName);
	}

	function vote (uint _candidateId) public{
		//check if this voter has voted jst once as a condition
		require(!voters[msg.sender]);

		//check if the the candidate id is valid as a condition
		require( _candidateId>0 && _candidateId<=countCandidate );

		//mark the voter that has voted
		voters[msg.sender] = true;

		//increase the votecount of a perticular candidate
		candidates[_candidateId].countVote++;
	}

	function changeTimer(uint _month, uint _day, uint _hour, uint _min, uint _sec) public{
		timingNumber++;
		TimingList[timingNumber] = Timer(_month , _day , _hour , _min , _sec);
	}
}
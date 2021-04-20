var Election = artifacts.require("./Election.sol");

contract("Election",function(accounts)
{	
	var candidatesDetails ;

	it("checks the numner of candidates",function()
	{
		return Election.deployed().then(function(i)
		{
			return i.countCandidate();
		}).then(function(count)
		{
			assert.equal(count,4);
		})
	})

	it("checks the details of a candidate",function()
	{
		return Election.deployed().then(function(i)
		{
			candidatesDetails = i;
			return candidatesDetails.candidates(1);
		}).then(function(can)
	 	{
			assert.equal(can[0] , 1, "represents ID");
			assert.equal(can[1] , "Abir" , "represents NAME");
			assert.equal(can[2] , 0 , "represents VOTE");

			return candidatesDetails.candidates(2); 	
		}).then(function(can)
		{
			assert.equal(can[0] , 2 , "represents ID");
			assert.equal(can[1] , "Prato" , "represents NAME");
			assert.equal(can[2] , 0 , "represents VOTE");

			return candidatesDetails.candidates(3);
		}).then(function(can)
		{
			assert.equal(can[1], "Rakib" , "represents NAME");
			assert.equal(can[0] , 3 , "represents ID");		
		})
	})

	var candidateId = 1;
	it("checks the valid accounts" , ()=>{
		return Election.deployed().then( (i)=>{
			candidatesDetails = i;
			return candidatesDetails.vote(candidateId , { from:accounts[0] }) ///defined which account i jst wanted to vote
		} ).then( (receipt)=>{
			return candidatesDetails.voters(accounts[0]); ///took that account to check whether this has voted or not 

		} ).then( (voted)=>{
			assert(voted , "The accoungt has voted..."); ///if voted then returned true value as "VOTED"

		// 	candidateId = 2;
		// 	return candidatesDetails.vote(candidateId , { from:accounts[0] });
		// } ).then(rec=>{
		// 	return candidatesDetails.voters(accounts[0]);
		// }).then(vote=>{
		// 	assert(vote , "Duplicate account verified...!")
		// })		


			return candidatesDetails.candidates(candidateId); /// defined to check the votecount of that candidate has incremented or not
		} ).then( (can)=>{
			var voteCount = can[2];
			assert.equal(voteCount , 1 , "Number of votecount of that candidateId"); /// & again checks the following condition
		})
		// candidateId=100;
		// return candidatesDetails.vote(100 , { from : accounts[2] });
		// } ).then(assert.fail).catch(err=> {
		// 	assert(err.message.indexOf('revert') >=0 , "error msg contain revert");
		// 	return candidatesDetails.candidates(100);
		// }).then(can=>{
		// 	var VC = can[2];
		// 	assert.equal(VC , 0 , "1st candidates voteCount");
		// })
	})


})


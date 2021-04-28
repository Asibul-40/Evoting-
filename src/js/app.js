
var swag=0;
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',



  init: function() {
    return App.initWeb3();
  },

//  By initializing web3 we can conncet our 
//  client side application to our local blockchain.....
  initWeb3: async function() {
    await ethereum.enable();
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else
    {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },



  initContract: function() {
    $.getJSON("Election.json", function(election) {

      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);

      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },


  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var candidateContent = $("#candidate-content");
    var table = $("#tableInfo");
    var voteForm = $("#vote-form");
    var inputTimerField = $("#timer-form");
    var setTimerbutton = $("#setTimerButton");
    var candidateNamePartySection = $("#candidate-name-party-section");
    var startButton = $("#startButton");
    var timer = $('#countDown');
    var addCandidate = $('#addCandidate');
    var candidatesDetails = $('#candidatesResults');
    var startNewElectionButton = $("#start-new-election-btn");
    var resultButton = $('#resultButton');


    loader.show();
    content.hide();
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      // console.log("==>"+account);
        $("#accountAddress").html("Your Account: <b>" + account +"</b>");
      }
    });
    var totalCandidate;
    
    //Set the Admin
    var adminAccount = "Insert Admin account address";    
    var flag = 0;

    // Load contract data
    App.contracts.Election.deployed().then(instance=> {
      electionInstance = instance;
      // console.log("Admin -> "+ adminAccount);
      return electionInstance.countCandidate();
    }).then(function(candidatesCount) {
      // console.log("fff----"+candidatesCount);
      totalCandidate = candidatesCount;

      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidateSelect = $('#selection');
      candidateSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) 
      {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          var partyName = candidate[3];

          // Render candidate Result
          var candidateTemplate = "<tr><td> " + id + "</td><td> " + name + " </td><td>" + partyName + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);

          var candidateOption = "<input type='radio' name='candidate' value=' "+ id +" ' id=' "+id+" '> <lebel for=' "+id+" ' style=' padding-right:4em;'>" + name + "</lebel>"
          candidateSelect.append(candidateOption);
        
          // console.log("->>>>"+candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(markedAcc=>{
      if(markedAcc){
        voteForm.hide();
      }
      loader.hide();
      content.show();
      startNewElectionButton.hide();
      resultButton.hide();

       if(adminAccount==App.account)
       {
      ///Admin can set the candidates as well as the timer.....
        candidateNamePartySection.show();
        inputTimerField.hide();
        voteForm.hide();
        startNewElectionButton.hide();
        resultButton.hide();
        
        startButton.click(function(){
            candidateContent.hide();
            startNewElectionButton.hide();
            resultButton.hide();
 
        })
        addCandidate.click(function(){
          table.show();
          candidatesDetails.show();
        })
        setTimerbutton.click(function(){
          // console.log("ABIR")
          candidateNamePartySection.hide();
          inputTimerField.show();
          table.hide();
        })
      }
      else {
        startNewElectionButton.hide();
        candidateContent.hide();
        table.show();
      }

        return electionInstance.TimingList(1).then(dates => {
        
      var months = dates[0];
      var days = dates[1];
      var hours = dates[2];
      var mins = dates[3];
      var scnd = dates[4];

      if(months==0 && days==0 && hours==0 && mins==0 && scnd==0){
        swag=1;
      }
      else swag=0;

      console.log(months+"__"+days+"__"+hours+"__"+mins+"__"+scnd);

      var countdate=new Date(2021 , months , days , hours , mins , scnd).getTime();
      // console.log(countdate);
      var time = setInterval(function(){
      var now=new Date().getTime();
               // console.log("----"+now);
               gap=countdate-now;
               var second=1000;
               var minute=second*60;
               var hour=minute*60;
               var day=hour*24;

               var d=Math.floor(gap/(day));
               var h=Math.floor((gap%(day))/(hour));
               var m=Math.floor((gap%(hour))/(minute));
               var s=Math.floor((gap%(minute))/(second));

               if(d<10) d="0"+d;
               if(h<10) h="0"+h;
               if(m<10) m="0"+m;
               if(s<10) s="0"+s;
               document.getElementById('day').innerText=d;
               document.getElementById('hour').innerText=h;
               document.getElementById('minute').innerText=m;
               document.getElementById('second').innerText=s;

               if(gap<=0){
                clearInterval(time);
                voteForm.hide();
               document.getElementById('day').innerHTML='00';
               document.getElementById('hour').innerHTML='00';
               document.getElementById('minute').innerHTML='00';
               document.getElementById('second').innerHTML='00';

                App.contracts.Election.deployed().then(i=>{
                  electionInstance = i;
                  console.log("----------->",swag);
                  if(swag==0){
                      return electionInstance.defineWinner( {from:App.account} );
                    }
                }).then(res=>{
                    // console.log(res);
                    candidateNamePartySection.show();
                    $('#loader').hide();
                    if(swag==0)  return electionInstance.winnerName();
                }).then(nm=>{
                      // candidateNamePartySection.hide();
                      if(nm==""){ 
                        var winningMsg = document.getElementById('countDown');
                          winningMsg.style.fontSize = "1.5em";
                          winningMsg.innerText = `There is no winner for this election, as nobody got any votes...!` 
                      }
                      else{
                        for(var i=0;i<nm.length;i++)
                        {
                          if(nm[i]==","){
                            var winningMsg = document.getElementById('countDown');
                            winningMsg.style.fontSize = "1.8em";
                            winningMsg.style.fontStyle = "bold";

                            winningMsg.innerText= `There is a draw between ${nm}. Since they have got the same number of votes.`
                            flag=1;
                          }
                        }
                        if(flag==0){
                          var winningMsg = document.getElementById('countDown');
                          winningMsg.style.fontSize = "1.5em";
                          winningMsg.innerText = `The winner is of the election is ${nm}.`
                          winningMsg.style.textAlign = "right";
                        }
                      }

                      if(App.account == adminAccount){
                        startNewElectionButton.show();
                        candidateNamePartySection.hide();
                        startNewElectionButton.click(function(){
                          startNewElectionButton.hide();
                          App.contracts.Election.deployed().then(i=>{
                            electionInstance = i;
                            return electionInstance.resetAll( { from : App.account } );
                          }).then(result=>{
                            loader.show();
                            content.hide();

                          })                          
                          candidateNamePartySection.show();
                        }) 
                      }
                }).catch(err=>{
                console.log("errrr--> "+err);
                });
              }
             },1000)
      })
    }).catch(function(error) {
      console.warn(error);
    });   
       

  },


  castVote: function(){
    var candidateId = $('input[name = candidate]:checked').val();
    
    App.contracts.Election.deployed().then(i => {
      var electionInstance = i;
      return electionInstance.vote(candidateId , { from:App.account });
    }).then(result=> {
      $('#content').hide();
      $('#loader').show();
    }).catch(err=>{
      console.error("ERR => "+err);
    });
  },


  addCandidate: function(){
    
    var name = $("#input-candidateName-field").val();
    var prtyName = $("#input-candidateParty-field").val();
    // console.log(name + "--->" + prtyName);

    if(name=="" && prtyName==""){
      alert("Candidates Name and Party-Name can't be empty.");
    }
    else if(name==""){
      alert("Please insert a Name for the Candidate");
    }
    else if(prtyName==""){
      alert("Please insert a Party-Name for the Candidate");
    }
    else{
    App.contracts.Election.deployed().then(i => {
      var electionInstance = i;
      return electionInstance.addCandidates(name, prtyName , { from:App.account });
    }).then(result=> {
      App.render();
    }).catch(err=>{
      console.error("ERR => "+err);
    });
  }
  },

  addTimer : function(){
            var day = $("#input-day").val();
            var hour = $("#input-hour").val();
            var min = $("#input-min").val();
            console.log(day+"----"+hour+"----"+min);

            if(day=="" && hour=="" && min==""){
              alert("Timer for the Election can't be NULL...");
            }
            else{
              if(day=="") day+="0";
              if(hour=="") hour+="0";
              if(min=="") min+="0";

            var now = new Date();

             var curDate = now.getDate();
             var curHour = now.getHours();
             var curMin = now.getMinutes();
             
            var dy,hr,mn;
            hr= parseInt(curHour)+parseInt(hour); 
            dy = parseInt(curDate)+parseInt(day);
            mn = parseInt(min)+parseInt(curMin);

            if(mn>=60){
              hr+=parseInt(mn/60);
               if(hr>12){
                dy+=parseInt(hr/24);
                hr%=24;
             }
              mn%=60;
            }

            if(hr>12){
              dy+=parseInt(hr/24);
              hr%=24;
             }
            console.log(dy+",,"+hr+",,"+mn);
            alert(`Voting process will continue for ${day} days ${hour} hours ${min} minutes`);

            var electionInstance;

            App.contracts.Election.deployed().then(i =>{
              electionInstance = i;
              return electionInstance.changeTimer(now.getMonth(), dy, hr, mn, parseInt(now.getSeconds()), { from : App.account });
            }).then(result=>{
              swag=1;
              // $('#table').hide();
              // $("#candidate-content").hide();
              App.render();

            }).catch(err=>{
              console.log("ErroR "+err);
            });
          }
    },

    
  };


$(function() {
  $(window).load(function() {
    App.init();
  });
});

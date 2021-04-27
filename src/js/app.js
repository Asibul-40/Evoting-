App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  admin: '0x5726794276f6b13466ca62ca49c0f6428545656d',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
     ethereum.enable();
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
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
      App.listenForVoteEvents();
      //App.listenForAddCandidateEvents();

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var timerD;
    var loader = $("#loader");
    var content = $("#content");
    var addform = $("#addCandidateForm");
    var timerform = $("#changeTimer");
    var setTimerbutton= $("#setTimerButton");
    var moreadd= $("#moreadd");
    var timer=$("#timer");
    var message=$("#winnermessage");
    var newelection=$("#startnewelection");
    var startbutton=$("#startbutton");
    var flag=0;
    var details=$("#details");
    var mytimer;
    var totalcandidates;
    var candidatesResults;
    var candidatesSelect;
    var notify=0;
    var thewinner;
    var maxv;
    var gotwinner=0;


    //-----------------------------------------------------

    var _month;
    var _day;
    var _hour;
    var _minute;

    //--------------------------------


    loader.show();
    content.hide();
    //------
    addform.hide();
    timerform.hide();
    timer.show();
    message.hide();
    newelection.hide();
    details.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        if(App.admin===account)
        {
            $("#accountAddress").html("Admin's Account: "+account); 
            $("#addCandidate").html("Add a Candidate?"); 

        }
        else{
        $("#accountAddress").html("User's account: "+account);
        addform.hide();
        timerform.hide();
        newelection.hide();
      }
      }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      if(candidatesCount>0)
      {
        totalcandidates=candidatesCount;

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + candidate[0] + "</th><td>" + candidate[1] + "</td><td>" + candidate[2] +"</td><td>" + candidate[3] + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + candidate[0]+ "' >" + candidate[1] + "</ option>"
          candidatesSelect.append(candidateOption);
          //------------------
        });
        loader.hide();
        content.show();
        details.show();

      }
      }
      else{
        document.getElementById('loader').innerHTML = 'Opps!No election is currently running!';
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      /*loader.hide();
      content.show();*/
      //------------
      if(App.account===App.admin)
      {
          addform.show();
          
          setTimerbutton.click(function(){
          addform.hide();
          timerform.show();
          flag=0;
        });
          moreadd.click(function(){
           addform.show();
           timerform.hide();
          });

      }
      //-----------
    }).catch(function(error) {
      console.warn(error);
    });
//------------------------------------------------------------------------------------
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.month();
    }).then(function(month) {
      _month=month;
    });
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.day();
    }).then(function(day) {
      _day=day;
    });
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.hour();
    }).then(function(hour) {
      _hour=hour;
    });
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.minute();
    }).then(function(minute) {
      _minute=minute;
      var countdate=new Date(_month+' '+_day+',2021 '+_hour+':'+_minute+':'+'00').getTime();
             if(_month!=="0"&&day!==0&&hour!==0&&minute!==0)
             {
             function newyear()
             {
               var now=new Date().getTime();
               gap=countdate-now;
               var second=1000;
               var minute=second*60;
               var hour=minute*60;
               var day=hour*24;

               var d=Math.floor(gap/(day));
               var h=Math.floor((gap%(day))/(hour));
               var m=Math.floor((gap%(hour))/(minute));
               var s=Math.floor((gap%(minute))/(second));

               document.getElementById('day').innerText=d;
               document.getElementById('hour').innerText=h;
               document.getElementById('minute').innerText=m;
               document.getElementById('second').innerText=s;
               if(d<=0&&h<=0&&m<=0&&s<=0)
               {
                  clearInterval(mytimer);
                  if(flag===0)
                  {
                  timer.hide();
                  message.show();
                  content.hide();
                  if(App.account===App.admin){
                        newelection.show();
                      }
                  addform.hide();
                  details.hide();
                  App.contracts.Election.deployed().then(function(instance){
                      return instance.winningProposal({from:App.account});
                    }).then(function(result){
                    }).catch(function(err){
                       console.error(err);
                    });
                    App.contracts.Election.deployed().then(function(instance){
                      return instance.winnername();
                    }).then(function(winnername){
                      document.getElementById('winner').innerHTML=winnername;
                    }).catch(function(err){
                       console.error(err);
                    });
                  }

                  startbutton.click(function(){
                    flag=1;
                     App.contracts.Election.deployed().then(function(instance){
                      return instance.resettime({from: App.account});
                     }).then(function(result){
                       newelection.hide();
                       message.hide();
                       addform.show();
                     }).catch(function(err){
                        console.error(err);
                     });
                   });
               }

             }

            mytimer= setInterval(function(){
              newyear();
             },1000)
          }
    });


  //---------------------------------------------------------------------------------

  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  //--------------------------------------------------------------
  addMoreCandidate: function(){
    var name=$('#newname').val();
    var partyname=$('#newpartyname').val();
    App.contracts.Election.deployed().then(function(instance){
      return instance.addCandidate(name,partyname,{from: App.account});
    }).then(function(result){
      // $("#content").hide();
      //$("#loader").show();
      App.render();
    }).catch(function(err){
      console.error(err);
    });
  },
  //---------------------------------------------------
  changeTimer: function(){
    var newday=$('#input-day').val();
    var newmonth=$('#input-month').val();
    var newhour=$('#input-hour').val();
    var newminute=$('#input-minute').val();
    App.contracts.Election.deployed().then(function(instance){
      return instance.changeTime(newmonth,newday,newhour,newminute,{from: App.account});
    }).then(function(result){
       //$("#content").hide();
       //$("#loader").show();
       App.render();
    }).catch(function(err){
      console.error(err);
    });
    
  },
  listenForVoteEvents: function() {
  App.contracts.Election.deployed().then(function(instance) {
    instance.votedevent({},{
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(function(error, event) {
      console.log("event triggered", event)
      // Reload when a new vote is recorded
      App.render();
    });
  });
  }
  /*listenForAddCandidateEvents: function() {
  App.contracts.Election.deployed().then(function(instance) {
    instance.addCandidateEvent({},{
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(function(error, event) {
      console.log("event triggered", event)
      // Reload when a new vote is recorded
      App.render();
    });
  });
  }*/

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});

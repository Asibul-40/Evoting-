
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
    var adminAccount = "0x1fe5e175a0181ce0177b79c19acb59eeeaad5b41";    

    // Load contract data
    App.contracts.Election.deployed().then(instance=> {
      electionInstance = instance;
      // console.log("Admin -> "+ adminAccount);
      return electionInstance.countCandidate();
    }).then(function(candidatesCount) {
      totalCandidate = candidatesCount;

      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidateSelect = $('#selection');
      candidateSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
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

      if(adminAccount==App.account){
      ///Admin can set the candidates as well as the timer.....
        candidateNamePartySection.show();
        inputTimerField.hide();
        voteForm.hide();

        startButton.click(function(){
            var day = $("#input-day").val();
            var hour = $("#input-hour").val();
            var min = $("#input-min").val();
            // alert(`Voting process will continue for ${day} days ${hour} hours ${min} minutes`)
            console.log(day+"-"+hour+"-"+min);
            candidateContent.hide();
        })
      addCandidate.click(function(){
          table.show();
          candidatesDetails.show();
        })
      setTimerbutton.click(function(){
          console.log("ABIR")
          candidateNamePartySection.hide();
          inputTimerField.show();
          table.hide();
        })
      }
      else {
        candidateContent.hide();
        table.show();
        // inputTimerField.hide();
      }
    }).catch(function(error) {
      console.warn(error);
    });
    // -----------------------------------------------------
                var count=0;
                var tieName = [];
                var allVote = [];
      App.contracts.Election.deployed().then(i=>{
      electionInstance = i;
      return electionInstance.countCandidate();
    }).then(totalCandi=>{
      
      // console.log("--++-"+count);
      electionInstance.TimingList(1).then(dates => {
      var months = dates[0];
      var days = dates[1];
      var hours = dates[2];
      var mins = dates[3];
      var scnd = dates[4];
      console.log(months+"__"+days+"__"+hours+"__"+mins+"__"+scnd);

      var countdate=new Date(2021 , months , days , hours , mins , scnd).getTime();
      console.log(countdate);

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
                // alert(totalCandidate);
                var can = totalCandi;
                var nam,voteCnt;
                // console.log(can);
                for(var i=1 ; i<=totalCandi ; i++)
                {
                  // var j = i;
                  _i(i);
                  electionInstance.candidates(i).then(cand=>{
                    var voteCnt = cand[2];
                    var nam = cand[1];
                    voteCnt = voteCnt.toNumber();
                    console.log(i,nam,voteCnt);

                    function _i(i) {
                      // body...
                    
                    if(i==1) {
                     count=voteCnt;
                     console.log("asi"+count+"~~~");
                    }
                    else{
                      if(voteCnt>count)
                      {
                        var winner = nam;
                        tieName.push( nam );
                        count = voteCnt;
                        console.log("nai->---"+count+"~~~"+voteCnt);
                      }
                      else if(voteCnt==count && count!=0){
                        console.log("ho"+count+"~~~~"+voteCnt);
                        tieName.push(nam);
                      }
                  }
                  }
                });


                }
                // var uniqueNames = Array.from(new Set(allVote));
                console.log(tieName);
                console.log(allVote);

                 if(tieName.length>1)  document.getElementById("countDown").innerHTML = `Oppps ! There is no winner for this election. As the following ${tieName.length} candidates got the same vote.`;
                // alert("Time's Up!");
               }
             },1000)
      })
    })
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
    
    App.contracts.Election.deployed().then(i => {
      var electionInstance = i;
      return electionInstance.addCandidates(name, prtyName , { from:App.account });
    }).then(result=> {
      $('#candidateContent').show();
      $('#table').show();
    }).catch(err=>{
      console.error("ERR => "+err);
    });
  },

  addTimer : function(){
            var day = $("#input-day").val();
            var hour = $("#input-hour").val();
            var min = $("#input-min").val();
            console.log(day+"----"+hour+"----"+min);

            var now = new Date();
            // var curMonth = now.getMonth();
            // console.log(curMonth);
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
              return electionInstance.changeTimer(now.getMonth() , dy , hr , mn , parseInt(now.getSeconds()) , { from : App.account });
            }).then(result=>{
              $('#content').show();
            }).catch(err=>{
              console.log("ErroR "+err);
            });
    }
  };


$(function() {
  $(window).load(function() {
    App.init();
  });
});



    // App.contracts.Election.deployed().then(i=>{
    //   electionInstance = i;
    //   return electionInstance.timingNumber();
    // }).then(count=>{

    //   console.log("--++-"+count);
    //   electionInstance.TimingList(1).then(dates => {
    //   var month = dates[0];
    //   var day = dates[1];
    //   var hour = dates[2];
    //   var min = dates[3];
    //   console.log(month+"__"+day+"__"+hour+"__"+min);

    //   var countdate=new Date("April 18,2021 "+hour+":"+min+":00");
    //   console.log(countdate);

    //   var time = setInterval(function(){
    //   var now=new Date().getTime();
    //            // console.log("----"+now);
    //            gap=countdate-now;
    //            var second=1000;
    //            var minute=second*60;
    //            var hour=minute*60;
    //            var day=hour*24;

    //            var d=Math.floor(gap/(day));
    //            var h=Math.floor((gap%(day))/(hour));
    //            var m=Math.floor((gap%(hour))/(minute));
    //            var s=Math.floor((gap%(minute))/(second));

    //            document.getElementById('day').innerText=d;
    //            document.getElementById('hour').innerText=h;
    //            document.getElementById('minute').innerText=m;
    //            document.getElementById('second').innerText=s;

    //            if(gap<=0){
    //             clearInterval(time);
    //             document.getElementById("countDown").innerHTML = "Time's Up !"
    //             // alert("Time's Up!");
    //            }
    //          },1000)
    //   })
    // })
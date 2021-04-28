# Evoting-
This is a "public" Blockchain based E-voting system where the Admin can set the list of Candidates and the Timer for the election and the users can vote. After ending of that countdown timer, the following system shows the winner of that election, based on the maximum vote-count of that particular candidate.  

## Prerequisites
1.Ganache
2.MetaMask extension for Chrome
3.Connect MetaMask to Ganache:
     a)Start up Ganache and open a workspace
     b)Log in to MetaMask
     c)Create a new Custom RPC with the Ganache RPC Server URL: http://localhost:7545/ and connect
     d)Copy the private key for the first account on Ganache by clicking the key icon
     e)Import Account on MetaMask:
            * Select Type as Private Key and paste the private key copied previously
You should now see the first account on Ganache with it's balance of 100 ETH, on MetaMask.


## Deployment
* Fork this repository
* git clone https://github.com/your-username/Evoting-
* cd Evoting
* npm install -g truffle
* npm install
* truffle migrate --reset
* npm run dev

# Evoting-
This is a "public" Blockchain based E-voting system where the Admin can set the list of Candidates and the Timer for the election and the users can vote. After ending of that countdown timer, the following system shows the winner of that election, based on the maximum vote-count of that particular candidate.  

## Prerequisites
1. Ganache
2. MetaMask extension for Chrome
3. Connect MetaMask to Ganache:
     * Start up Ganache and open a workspace
     * Log in to MetaMask
     * Create a new Custom RPC with the Ganache RPC Server URL: http://localhost:7545/ and connect
     * Copy the private key for the first account on Ganache by clicking the key icon
     * Import Account on MetaMask:
     * Select Type as Private Key and paste the private key copied previously
     * You should now see the first account on Ganache with it's balance of 100 ETH, on MetaMask.
     * To set an admin:
     * Choose an account address from ganache and copy it in "/src/js/app.js" in line no 79.
     
## Deployment
* Fork this repository
* Change the current working directory to the location where you want the cloned directory.
* git clone https://github.com/Asibul-40/Evoting-.git
* npm install -g truffle
* npm install
* truffle migrate --reset (for deploying every time if you change some codes in smart contract).
* npm run dev (to run the server).

## Note
* Election result will be automatically shown after the timer ends but it will cost some ether.






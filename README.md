# zknft-in-decentraland


```
$ npm i -g decentraland
```
```
$  dcl start --web3
```


What is this app doing?

Scenario 1: User proves they own an NFT anonymously using zk-nft
1. user walks up to a door
2. user clicks on the door
3. it triggers a popup with an input for the commitment string
4. user enters the zk commitment string
5. if it is valid, door opens.

Scenario 2: User enters with a specific NFT
1. user walks up to a door
2. user clicks on the door
3. it triggers a function
4. the function checks if user owns a specific NFT
5. if not, access denied. if yes, door opens.

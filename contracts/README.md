# Cirql Protocol Contracts
<!-- GETTING STARTED -->

### Getting Started    
1. Clone this repo:
```
git clone https://github.com/show-karma/nouns-wrapped-contracts.git
``` 
 
1. Install dependencies
```sh
yarn
``` 

3. Set the environment variables in `.env` file. You can use `.env.example` as a template.

```
# 1. Paste your private key
PRIVATE_KEY='abcdefg'

# 2. Paste your blockchain explorer API key for contract verification
ETHERSCAN_API_KEY=
``` 
4. Compile contracts
```sh
yarn hardhat deploy --network mumbai (or) base
```

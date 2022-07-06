import { getSigners } from '../utils/signers';
import hre, { ethers } from 'hardhat';

// NOTE : Update env file prior script run
async function main() {

    console.log("hre.network.name", hre.network.name);


    for(i=0; i< userList.length; i++){
        let userBalance = await ethers.provider.getBalance(userAddress);
        
    }


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

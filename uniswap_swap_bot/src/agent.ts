import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  ethers,
} from "forta-agent";


import { UNISWAP_ADDRESS, SWAP_EVENT } from "./constant";

export const swpaRouter ="0xE592427A0AEce92De3Edee1F18E0157C05861564"

export const  function_exact = " function exactInputSingle(address,address,uint24,address,uint256,uint256,uint256,uint160)"

const ABI=[
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint24", "name": "", "type": "uint24" }
    ],
    "name": "getPool",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
]

export const getPool = (token1:String, token2:String, fee:Number) =>{
  const provider = new ethers.providers.JsonRpcProvider('https://polygon.drpc.org')
  const contract = new ethers.Contract(UNISWAP_ADDRESS, ABI, provider);

  const poolAddress = contract.getPool(token1, token2, fee)

  return poolAddress;
}





const provideHandleTransaction = () => async (txEvent: TransactionEvent) => { 


  const findings: Finding[] = [];

  const functionCalls =  txEvent.filterFunction([function_exact], swpaRouter);
  
  
  if(functionCalls.length === 0){
    console.log("no findings");
    return findings;
  }

  

  
  for (const call of functionCalls) {
  
  const poolAddress = await getPool(call.args[0], call.args[1], call.args[2]);



  const tokenSwapEvent = txEvent.filterLog(SWAP_EVENT, poolAddress);
  
  
    tokenSwapEvent.forEach((swapEvent) => {
      const { sender, recipient, amount0, amount1 } = swapEvent.args;

      findings.push(
        Finding.fromObject({
          name: "Swap detected",
          description: `A swap between ${call.args[0]} and ${call.args[1]} on UniswapV3 was detected`,
          alertId: "FORTA-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            sender,
            recipient,
            tokenIn:call.args[0],
            tokenOut:call.args[1],
            amount0: amount0.toString(),
            amount1: amount1.toString(),
          },
        })
      );
    });
}



  return findings;
};

export default {
  handleTransaction: provideHandleTransaction(),
};

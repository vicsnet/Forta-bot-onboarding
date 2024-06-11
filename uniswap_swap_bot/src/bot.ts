import {
    BlockEvent,
    Finding,
    Initialize,
    HandleBlock,
    HealthCheck,
    HandleTransaction,
    HandleAlert,
    AlertEvent,
    TransactionEvent,
    FindingSeverity,
    FindingType,
  } from "forta-agent";

  export const UNISWAP_ADDRESS= "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  export const SWAP_EVENT =
  "event Swap(address indexed sender,address indexed recipient,int256 amount0,int256 amount1,uint160 sqrtPriceX96,uint128 liquidity,int24 tick)";
  


  let findingsCount = 0;

  const handleTransaction:HandleTransaction = async (txEvent:TransactionEvent)=>{
    const findings:Finding[] = [];

    const tokenSwapEvent = txEvent.filterLog(SWAP_EVENT, UNISWAP_ADDRESS);
    tokenSwapEvent.forEach((swapEvent)=>{
        const {sender, recipient, amount0, amount1} = swapEvent.args;
    
        console.log("deposit and output",amount0, amount1)
        findings.push(
            Finding.fromObject({
                name: "Swap detected",
                description:`${Number(amount0)} was swap ${amount1}`,
                alertId:'FORTA-1',
                severity:FindingSeverity.Low,
                type:FindingType.Info,
                metadata:{
                    sender,
                    recipient,
                    amount0: amount0.toString(),
                    amount1:amount1.toString()
                },
            })
        );
        findingsCount++
    })

    return findings;
  }

  export default{
    handleTransaction
  }
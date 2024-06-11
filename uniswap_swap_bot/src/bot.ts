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
        const {sender, recipent, deposit, output} = swapEvent.args;
        findings.push(
            Finding.fromObject({
                name: "swap occur",
                description:`${deposit} was swap ${output}`,
                alertId:'FORTA-1',
                severity:FindingSeverity.Low,
                type:FindingType.Info,
                metadata:{
                    sender,
                    recipent,
                    deposit,
                    output
                },
            })
        );
        findingsCount++
    })

    return findings;
  }
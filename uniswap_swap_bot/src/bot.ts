import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

import { UNISWAP_ADDRESS, SWAP_EVENT } from "./constant";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  const tokenSwapEvent = txEvent.filterLog(SWAP_EVENT, UNISWAP_ADDRESS);
  tokenSwapEvent.forEach((swapEvent) => {
    const { sender, recipient, amount0, amount1 } = swapEvent.args;

    console.log("deposit and output", amount0, amount1);
    findings.push(
      Finding.fromObject({
        name: "Swap detected",
        description: `${Number(amount0)} was swap ${amount1}`,
        alertId: "FORTA-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          sender,
          recipient,
          amount0: amount0.toString(),
          amount1: amount1.toString(),
        },
      })
    );
  });

  return findings;
};

export default {
  handleTransaction,
};

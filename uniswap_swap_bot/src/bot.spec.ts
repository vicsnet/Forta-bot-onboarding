import {
    FindingType,
    FindingSeverity,
    Finding,
    HandleTransaction,
    createTransactionEvent,
    ethers,
  } from "forta-agent";
  import { createAddress } from "forta-agent-tools";

  import bot,{ UNISWAP_ADDRESS, SWAP_EVENT } from "./bot";

  describe("swap occur", ()=>{
    let handleTransaction: HandleTransaction;

    const mockTxEvent = createTransactionEvent({} as any);

    beforeAll(()=>{
        handleTransaction = bot.handleTransaction;
    });

    describe("token swap",()=>{
        const sender = createAddress("0x1")
        const recipient = createAddress("0x2")
        const amount0 =300;
        const amount1 =100;
        const sqrtPricex96 = 2;
        const liquidity = 5;
        const tick = 10;
        it("returns empty findingd if there is no swap", async()=>{
            mockTxEvent.filterLog = jest.fn().mockReturnValue([])
            const findings = await handleTransaction(mockTxEvent)
            expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        SWAP_EVENT,
        UNISWAP_ADDRESS
      );
        })
        it("returns the metadata for swap",async ()=>{
            const mockSwapEvent ={
                args:{
                    sender,
                    recipient,
                    amount0,
                    amount1,
                    sqrtPricex96,
                    liquidity,
                    tick

                }
            };
            mockTxEvent.filterLog = jest.fn().mockReturnValue([mockSwapEvent]);

            const findings = await handleTransaction(mockTxEvent);

            expect(findings).toStrictEqual([
                Finding.fromObject({
                    name: "Swap detected",
                    description:`${amount0} was swap ${amount1}`,
                    alertId:'FORTA-1',
                    severity:FindingSeverity.Low,
                    type:FindingType.Info,
                    metadata:{
                        sender,
                        recipient,
                        amount0: String(amount0),
                        amount1:String(amount1)
                    },
                })
            ]);
            expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
            expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
                SWAP_EVENT,
                UNISWAP_ADDRESS
            );


        })
    })
  })

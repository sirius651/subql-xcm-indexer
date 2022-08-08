import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { FailedToTransactEvent } from "../types";

export async function handleEventXcm(event: SubstrateEvent): Promise<void> {
  const {event: {data: [era]}} = event;
  logger.info(`New era: ${era}`);

  logger.info(`Event ID: ${event.block.block.header.number.toString()}-${event.idx}`);
  // outcome: FailedToTransactAsset
  logger.info(event.extrinsic.success)

  const blockNum = event.block.block.header.number
  const eventIdx = event.idx.toString()
  
  // await (await api.query.system.events()).map( async eventRecord => {
  //     const event = eventRecord.event;
  //     logger.info(`event: ${event}`);
  //     if (event.method === 'ExecutedDownward') {
  //         logger.info(`data: ${event.data}`);

  //         const json = {
  //             accountId: event.data[0],
  //             amount: event.data[1]
  //         }
  //         logger.info('json', json)

  //         const record = new FailedToTransactEvent(era.toString());
  //         record.block = blockNum.toNumber()
  //         record.eventIdx = parseInt(eventIdx)
  //         record.accountId = event.data[0].toString()
  //         record.amount = event.data[1].toString()
  //         await record.save();
  //     }
  // });
  
}
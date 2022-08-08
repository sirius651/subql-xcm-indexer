import { SubstrateEvent, SubstrateBlock } from "@subql/types";
import { TransactionsPerBlock } from "../types";

function formatDate(date: Date): string {
  return date.toISOString().slice(0,10).replace(/-/g, '');
}

function getBlockTimestampInUnix(block: SubstrateBlock): bigint {
  return BigInt(block.timestamp.getTime());
}

export async function handleBalancesTransfer(event: SubstrateEvent): Promise<void> {
  logger.info('event: '+ JSON.stringify(event));
  const transactions = await handleDayStartEnd(event.block);
  transactions.numberOfTransactions ++;
  logger.info('transaction: '+ transactions.numberOfTransactions);
  await transactions.save();
}

async function handleDayStartEnd(block: SubstrateBlock): Promise<TransactionsPerBlock> {
  const date = formatDate(block.timestamp);

  let transactions = await TransactionsPerBlock.get(date);
  if (!transactions) {
    transactions = new TransactionsPerBlock(date);
    transactions.firstBlock = block.block.header.number.toNumber();
    transactions.numberOfTransactions = 0;
    transactions.timestamp = BigInt(0);
    await transactions.save();

    const prevDate = new Date(block.timestamp);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevTransactions = await TransactionsPerBlock.get(formatDate(prevDate));
    if (prevTransactions) {
      prevTransactions.lastBlock = transactions.firstBlock - 1;
      const blocksCount = prevTransactions.lastBlock.valueOf() - prevTransactions.firstBlock;
      const avgNumberOfTransactions = prevTransactions.numberOfTransactions / blocksCount;
      prevTransactions.avgNumberOfTransactions = avgNumberOfTransactions;
      prevTransactions.timestamp = getBlockTimestampInUnix(block);
      await prevTransactions.save();
    }
  }

  return transactions;
}


export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const {event: {data: [era]}} = event;
  logger.info(`New era: ${era}`);
  // Get data from the event
  // The balances.transfer event has the following payload \[from, to, value\]
  logger.info('json :' + JSON.stringify(event));
  

  const transactions = await handleDayStartEnd(event.block);
  transactions.numberOfTransactions ++;
  await transactions.save();

  // Create the new transfer entity
  // const transfer = new Transfer(
  //   `${event.block.block.header.number.toNumber()}-${event.idx}`
  // );
  // transfer.blockNumber = event.block.block.header.number.toBigInt();
  // transfer.from = from.toString();
  // transfer.to = to.toString();
  // transfer.amount = (amount as Balance).toBigInt();
  // await transfer.save();
}

import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider'
import { expect } from './expect'
import { Contract, BigNumber, ContractTransaction } from 'ethers'

export default async function snapshotGasCost(
  x:
    | TransactionResponse
    | Promise<TransactionResponse>
    | ContractTransaction
    | Promise<ContractTransaction>
    | TransactionReceipt
    | Promise<BigNumber>
    | BigNumber
    | Contract
    | Promise<Contract>,
  skip = false
): Promise<void> {
  const resolved = await x
  if ('deployTransaction' in resolved) {
    const receipt = await resolved.deployTransaction.wait()
    if (!skip) expect(receipt.gasUsed.toNumber()).toMatchSnapshot()
  } else if ('wait' in resolved) {
    const waited = await resolved.wait()
    if (!skip) expect(waited.gasUsed.toNumber()).toMatchSnapshot()
  } else if (BigNumber.isBigNumber(resolved)) {
    if (!skip) expect(resolved.toNumber()).toMatchSnapshot()
  }
}

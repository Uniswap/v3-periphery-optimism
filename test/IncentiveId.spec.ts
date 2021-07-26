import { ethers } from 'hardhat'
import { expect } from './shared/expect'
import { TestIncentiveId } from '../typechain-ovm'

describe('IncentiveId', () => {
  let incentiveId: TestIncentiveId
  before('deploy test contract', async () => {
    incentiveId = (await (await ethers.getContractFactory('TestIncentiveId')).deploy()) as TestIncentiveId
  })

  describe('#compute', () => {
    it('is correct for empty bytes', async () => {
      expect(
        await incentiveId.compute({
          rewardToken: ethers.constants.AddressZero,
          refundee: ethers.constants.AddressZero,
          pool: ethers.constants.AddressZero,
          startTime: 0,
          endTime: 100,
        })
      ).to.eq('0x000000')
    })
  })
})

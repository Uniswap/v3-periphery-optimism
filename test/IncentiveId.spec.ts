import { ethers } from 'hardhat'
import { expect } from './shared/expect'
import { TestIncentiveId } from '../typechain-ovm'

describe.only('IncentiveId', () => {
  let incentiveId: TestIncentiveId
  before('deploy test contract', async () => {
    incentiveId = (await (await ethers.getContractFactory('TestIncentiveId')).deploy()) as TestIncentiveId
  })

  describe('#compute', () => {
    it('is correct for example', async () => {
      expect(
        await incentiveId.compute({
          rewardToken: ethers.constants.AddressZero,
          refundee: ethers.constants.AddressZero,
          pool: ethers.constants.AddressZero,
          startTime: 0,
          endTime: 100,
        })
      ).to.eq('0x17b98489a2dfe2c85076f94f6ed94b2c60a48a728457375268be4e78c6a6de87')
    })
  })
})

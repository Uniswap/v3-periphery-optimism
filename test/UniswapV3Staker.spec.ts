import { ethers, waffle } from 'hardhat'
import { UniswapV3Staker, TestERC20 } from '../typechain-ovm'
import completeFixture from './shared/completeFixture'
import { expect } from './shared/expect'
import { IUniswapV3Factory, MockTimeNonfungiblePositionManager } from '../typechain-ovm'

// 1 day
const MAX_INCENTIVE_START_LEAD_TIME = 3600 * 24
// 30 days
const MAX_INCENTIVE_DURATION = MAX_INCENTIVE_START_LEAD_TIME * 30

const { constants } = ethers

describe.only('UniswapV3Staker', () => {
  const wallets = waffle.provider.getWallets()

  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>

  before('loader', async () => {
    loadFixture = waffle.createFixtureLoader(wallets)
  })

  let factory: IUniswapV3Factory
  let nft: MockTimeNonfungiblePositionManager
  let staker: UniswapV3Staker
  let token0: TestERC20
  let token1: TestERC20
  beforeEach('create fixture loader', async () => {
    ;({
      factory,
      nft,
      tokens: [token0, token1],
    } = await loadFixture(completeFixture))
  })

  beforeEach('create staker', async () => {
    staker = (await (await ethers.getContractFactory('UniswapV3Staker')).deploy(
      factory.address,
      nft.address,
      MAX_INCENTIVE_START_LEAD_TIME,
      MAX_INCENTIVE_DURATION
    )) as UniswapV3Staker
  })

  it('deploys and has an address', async () => {
    expect(staker.address).to.be.a('string')
  })

  it('sets immutable variables', async () => {
    expect(await staker.factory()).to.equal(factory.address)
    expect(await staker.nonfungiblePositionManager()).to.equal(nft.address)
    expect(await staker.maxIncentiveDuration()).to.equal(MAX_INCENTIVE_DURATION)
    expect(await staker.maxIncentiveStartLeadTime()).to.equal(MAX_INCENTIVE_START_LEAD_TIME)
  })

  describe('#createIncentive', () => {
    it('can create an incentive that is within the current parameters for any pool address', async () => {
      const timestamp = (await ethers.provider.getBlock('latest')).timestamp
      const startTime = Math.floor(timestamp + MAX_INCENTIVE_START_LEAD_TIME / 2)
      const endTime = Math.floor(startTime + MAX_INCENTIVE_DURATION / 2)
      await token0.approve(staker.address, 100)
      await staker.createIncentive(
        {
          rewardToken: token0.address,
          pool: constants.AddressZero,
          startTime,
          endTime,
          refundee: wallets[0].address,
        },
        100
      )
    })
  })
})

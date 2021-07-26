import { ethers, waffle } from 'hardhat'
import { UniswapV3Staker } from '../typechain-ovm'
import completeFixture from './shared/completeFixture'
import { expect } from './shared/expect'
import { IUniswapV3Factory, MockTimeNonfungiblePositionManager } from '../typechain-ovm'

describe('unit/Deployment', () => {
  const wallets = waffle.provider.getWallets()

  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>

  before('loader', async () => {
    loadFixture = waffle.createFixtureLoader(wallets)
  })

  let factory: IUniswapV3Factory
  let nft: MockTimeNonfungiblePositionManager
  beforeEach('create fixture loader', async () => {
    ;({ factory, nft } = await loadFixture(completeFixture))
  })

  it('deploys and has an address', async () => {
    const stakerFactory = await ethers.getContractFactory('UniswapV3Staker')
    const staker = (await stakerFactory.deploy(factory.address, nft.address, 2 ** 32, 2 ** 32)) as UniswapV3Staker
    expect(staker.address).to.be.a('string')
  })

  it('sets immutable variables', async () => {
    const stakerFactory = await ethers.getContractFactory('UniswapV3Staker')
    const staker = (await stakerFactory.deploy(factory.address, nft.address, 2 ** 32, 2 ** 32)) as UniswapV3Staker

    expect(await staker.factory()).to.equal(factory.address)
    expect(await staker.nonfungiblePositionManager()).to.equal(nft.address)
    expect(await staker.maxIncentiveDuration()).to.equal(2 ** 32)
    expect(await staker.maxIncentiveStartLeadTime()).to.equal(2 ** 32)
  })
})

# Uniswap V3 Periphery

[![Tests](https://github.com/Uniswap/uniswap-v3-periphery-optimism/workflows/Tests/badge.svg)](https://github.com/Uniswap/uniswap-v3-periphery-optimism/actions?query=workflow%3ATests)
[![Lint](https://github.com/Uniswap/uniswap-v3-periphery-optimism/workflows/Lint/badge.svg)](https://github.com/Uniswap/uniswap-v3-periphery-optimism/actions?query=workflow%3ALint)

This repository contains the Optimism fork of the periphery smart contracts for the Uniswap V3 Protocol.
For the lower level core contracts, see the [uniswap-v3-core-optimism](https://github.com/Uniswap/uniswap-v3-core-optimism)
repository.

## Testing

Because these contracts and tests are modified for OVM support, there are some changes that mean we can no longer simply run `yarn test` and `yarn test:ovm` and expect all tests to pass for both the EVM and OVM. There are a few reasons for this:

1. EVM vs. OVM contracts will use different amounts of gas, so the gas tests will fail
2. `PoolAddress.sol` has a hardcoded bytecode hash, but this hash will be different for EVM vs. OVM bytecode
3. In Uniswap V3 Core and Periphery contracts some logic was pulled out into library contracts to reduce contract size. The original EVM contracts had deterministic bytecode, so a bytecode hash can be easily hardcoded in `PoolAddress.sol`, but this is no longer true. The contracts now require linking libraries, and therefore the bytecode and bytecode hash is dependent on the library addresses, which are dependent on the deployer account and nonce

Therefore, we must follow the steps below to run EVM tests in this repo:

1. Run `UPDATE_SNAPSHOT=1 yarn test` which will ensure gas costs snapshots are updated (i.e. tests will not fail for gas cost reasons)

And to run OVM tests:

1. Run `yarn postinstall` to apply a patch that adds OVM mock contract support to Waffle
2. Run `UPDATE_SNAPSHOT=1 yarn test:ovm` which will ensure gas costs snapshots are updated (i.e. tests will not fail for gas cost reasons)
3. On subsequent test runs, run `yarn optimism-down && yarn optimism-up && UPDATE_SNAPSHOT=1 yarn test:ovm`. This is required so the deployer account nonce is reset to zero, which is necessary to get the above bytecode hash when deploying contracts

Both test commands (`yarn test` and `yarn test:ovm`) will automatically update the `POOL_INIT_CODE_HASH` in `PoolAddress.sol` as needed for testing.

Note that the `_Setup.spec.ts` test file must always be run first. This ensures library addresses (which are dependent on account nonce) are always the same, which ensures the bytecode hash is the same on each test run.
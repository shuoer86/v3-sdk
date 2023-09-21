type GetBurnAmountInput = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  newStakedAssets: bigint
  contracts: StakeWise.Contracts
}

const getBurnAmount = async (values: GetBurnAmountInput) => {
  const { contracts, ltvPercent, mintedAssets, stakedAssets, newStakedAssets } = values

  const hasMinted = mintedAssets && mintedAssets > 0

  if (!hasMinted) {
    return 0n
  }

  const stakedWithPercent = (stakedAssets - newStakedAssets) * ltvPercent / 10_000n
  const assetsToBurn = mintedAssets - stakedWithPercent

  if (assetsToBurn > 0) {
    const assetsResult = assetsToBurn > mintedAssets
      ? mintedAssets
      : assetsToBurn

    const sharesToBurn = await contracts.tokens.mintToken.convertToShares(assetsResult)

    return sharesToBurn
  }

  return 0n
}


export default getBurnAmount

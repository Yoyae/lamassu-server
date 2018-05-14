const coinUtils = require('../../coin-utils')

const PAIRS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  ZEC: 'zcash',
  LTC: 'litecoin',
  DASH: 'dash',
  XMCC: 'monacocoin',
  BCH: 'bitcoin-cash'
}

module.exports = {PAIRS, toUnit}

function toUnit (cryptoAtoms, cryptoCode) {
  const cryptoRec = coinUtils.getCryptoCurrency(cryptoCode)
  const unitScale = cryptoRec.unitScale
  return cryptoAtoms.shift(-unitScale)
}

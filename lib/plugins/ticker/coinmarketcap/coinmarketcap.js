const axios = require('axios')
const _ = require('lodash/fp')

const BN = require('../../../bn')
const common = require('../../common/coinmarketcap')

exports.NAME = 'CMC'
exports.SUPPORTED_MODULES = ['ticker']

const PAIRS = common.PAIRS

function findCurrency (fxRates, fiatCode) {
  const rates = _.find(_.matchesProperty('code', fiatCode), fxRates)
  if (!rates || !rates.rate) throw new Error(`Unsupported currency: ${fiatCode}`)
  return BN(rates.rate)
}

exports.ticker = function ticker (account, fiatCode, cryptoCode) {
  if (fiatCode === 'USD') {
    return getCurrencyRates(cryptoCode)
  }

  return axios.get('https://bitpay.com/api/rates')
    .then(response => {
      const fxRates = response.data
      const usdRate = findCurrency(fxRates, 'USD')
      const fxRate = findCurrency(fxRates, fiatCode).div(usdRate)

      return getCurrencyRates(cryptoCode)
        .then(res => ({
          rates: {
            ask: res.rates.ask.times(fxRate),
            bid: res.rates.bid.times(fxRate)
          }
        }))
    })
}

function getCurrencyRates (cryptoCode) {
  const pair = PAIRS[cryptoCode]

  return axios.get('https://api.coinmarketcap.com/v1/ticker/' + pair)
    .then(function (response) {
      const rates = response.data[0].price_usd;
      return {
        rates: {
          ask: BN(rates),
          bid: BN(rates)
        }
      }
    })
}

export const CC_BANKS = {
  VISA: 'VISA',
  MASTERCARD: 'MASTERCARD',
  AMEX: 'AMEX'
};

export const CC_REGEX = {
  VISA: /^4[0-9]{12}(?:[0-9]{3})?$/g,
  MASTERCARD: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/g,
  AMEX: /^3[47][0-9]{13}$/g
};

export const CARD_BRAND_IMGS = {
  Visa: {
    name: 'Visa',
    img: 'static/images/visa-512.png'
  },
  MasterCard: {
    name: 'Mastercard',
    img: 'static/images/mastercard-512.png'
  },
  AmericanExpress: {
    name: 'American Express',
    img: 'static/images/amex-512.png'
  }
};

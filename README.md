# A simple and powerful input for your credit card form
## Install
```
npm install vue-cc-input
```

## How to use it
Just pass a variable for receive the credit card info (trigger only when all validations passed)
```js
<v-credit-card
  v-model="form"
  :banksPermited="[
    'Visa',
    'MasterCard',
    'Amex'
  ]"
/>
```

## Validations
Include some cool validations like:
- Number length (16 or 15 digits)
- Valid credit card number (Luhn algorithm)
- Date valid (greater or equal that today)
- CVV length

## Props
- banksPermited: An array with names of brands allowed (supports Visa, MasterCard, and Amex)
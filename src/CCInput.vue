<template>
  <div style="font-size: 14px;">
    <div class="input__block relative">
      <p class="">Número de tarjeta</p>
      <img v-if="ccBankIs(CC_BANKS.VISA)" class="input--cardBrand" :src="visa" height="32px" alt="Visa" />
      <img v-if="ccBankIs(CC_BANKS.MASTERCARD)" class="input--cardBrand" src="@/static/images/mastercard-512.png" height="32px" alt="Mastercard" />
      <img v-if="ccBankIs(CC_BANKS.AMEX)" class="input--cardBrand" src="../assets/images/amex-512.png" height="32px" alt="Amex" />
      <input
        class="input input--100"
        :class="{ 'input--error': !validCardNumber && cardNumsBlured }"
        type="text"
        inputmode="numeric"
        placeholder="0000 0000 0000 0000"
        :maxlength="ccLength"
        @keyup="validateCCNumber"
        v-model="form.ccNumber"
        @blur="handlerBluredCardNumber"
      />
      <p class="error" v-if="cardNumsBlured && form.ccNumber.length !== ccLength">
        {{ errorCCNumberText }}
      </p>
      <p class="error" v-if="!validCardNumber && cardNumsBlured && form.ccNumber.length === ccLength">
        Su número de tarjeta debe de ser válido.
      </p>
    </div>

    <div class="section__group input__block">
      <div class="w2">
        <p bold noMargin>Fecha de expiración</p>
        <div class="w2">
          <select
            class="input input--100 input--noLeftPadding"
            :class="{ 'input--error': !validExp && cardExpBlured }"
            v-model="expMonth"
            @change="handlerBluredCardExp"
            ref="expMont"
          >
            <option value="">Mes</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
        <div class="w2">
          <select
            class="input input--100 input--noLeftPadding"
            :class="{'input--error':!validExp && cardExpBlured}"
            v-model="expYear"
            @change="handlerBluredCardExp"
          >
            <option value="">Año</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
          </select>
        </div>
        <!-- <p v-if="cardExpBlured" class="error">El campo fecha es requerido</p> -->  
        <p v-if="!validExp && cardExpBlured" class="error">Fecha inválida</p>
      </div>
      <div class="w2 cvv__container">
        <p bold :space="false">CVV</p>
        <div class="cvv__input">
          <div class="input--cvv">
            <input
              class="input"
              :class="{ 'input--error': !validCVV && CVVBlured }"
              type="number"
              name="ccCvv"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="cvv"
              :maxlength="cvvLength"
              ref="cvc"
              @keyup="validateCVC"
              v-model="form.ccCvv"
              @blur="handlerBluredCVV"
            />
            <p v-if="!validCVV && CVVBlured" class="error">El campo código de seguridad es requerido</p>
          </div>
          
          <div class="cvv__icon__container">
            <div style="padding-top: 10px; position: relative;">
              <p class="cc__cvc__icon" @click="switchCVCIcon">?</p>
              <p class="cc__cvc__helpbox" v-if="showCVCHelp">
                <img v-if="ccBank === CC_BANKS.AMEX" src="static/images/cvv-amex.png" alt="CVV">
                <img v-else src="static/images/cvv.png" alt="CVV">
              </p>
              <p class="cc__cvc__helpbox__triangle" v-if="showCVCHelp"></p>

              <p class="cc__cvc__helpbox__triangle-2" v-if="showCVCHelp"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input__block">
      <p class="">Nombre del Titular</p>
      <input
        class="input input--100"
        type="text"
        v-model="form.ccName"
        @blur="handlerBluredName"
      />
      <p v-if="!validName && nameBlured" class="error">El campo nombre del titular es requerido</p>
    </div>

    <div class="input__block">
      <p class="">Dirección</p>
      <input
        class="input input--100"
        type="text"
        v-model="form.ccAddress"
        @blur="handlerBluredAddress"
      />
      <p v-if="!validAddress && addressBlured" class="error">El campo dirección es requerido</p>
    </div>

    <div class="input__block">
      <p class="">Código Postal</p>
      <input
        class="input input--50"
        type="text"
        inputmode="numeric"
        maxlength="8"
        v-model="form.ccPostalCode"
        @blur="handlerBluredCP"
      />
      <p v-if="!validCP && cpBlured" class="error">El campo código postal es requerido</p>
    </div>

  </div>
</template>

<script>
import {
  CC_BANKS,
  CC_REGEX,
} from '@/utils/constants';
import {
  CURRENT_MONTH,
  CURRENT_YEAR
} from '@/utils/currentDates';
import visa from './static/images/visa-512.png';

export default {
  props: {
    useName: Boolean,
    useAddress: Boolean,
    usePostalCode: Boolean,
    banksPermited: Array
  },
  data() {
    return {
      visa,
      expMonth: '',
      expYear: '',
      form: {
        ccNumber: '',
        ccExpiration: '',
        ccCvv: '',
        ccName: '',
        ccAddress: '',
        ccPostalCode: ''
      },
      validationsPassed: {
        cardNumber: false,
        cardExp: false,
        ccCvv: false,
        name: false,
        address: false,
        cp: false
      },
      showCVCHelp: false,
      ccBank: '',
      ccLength: 19,
      cvvLength: 3,
      CC_BANKS,
      cardNumsBlured: false,
      cardExpBlured: false,
      CVVBlured: false,
      nameBlured: false,
      addressBlured: false,
      cpBlured: false
    };
  },
  computed: {
    errorCCNumberText() {
      return this.ccBank === CC_BANKS.AMEX ? 'Ingresa los 15 dígitos de tu tarjeta' : 'Ingresa los 16 dígitos de tu tarjeta';
    },
    cardNums() {
      return this.form.ccNumber;
    },
    validCardNumber() {
      const number = this.form.ccNumber.replace(/ /g, '');
      const testPassed = [];
      const patterns = {
        Visa: new RegExp(CC_REGEX.VISA),
        MasterCard: new RegExp(CC_REGEX.MASTERCARD),
        Amex: new RegExp(CC_REGEX.AMEX)
      };

      try {
        this.banksPermited.forEach((bank) => {
          testPassed.push(patterns[bank].test(number));
        });
      } catch (e) {
        return false;
      }

      // The Luhn Algorithm.
      const luhnCheck = num => {
        if (/[^0-9-\s]+/.test(num)) return false;

        var nCheck = 0, nDigit = 0, bEven = false;
        num = num.replace(/\D/g, "");

        for (var n = num.length - 1; n >= 0; n--) {
          var cDigit = num.charAt(n);
            nDigit = parseInt(cDigit, 10);

          if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
          }

          nCheck += nDigit;
          bEven = !bEven;
        }

        return (nCheck % 10) == 0;
      };

      return testPassed.some(test => test === true) && luhnCheck(number);
    },
    validExp() {
      return this.expYear > CURRENT_YEAR
        || (this.expYear === CURRENT_YEAR && this.expMonth >= CURRENT_MONTH);
    },
    validCVV() {
      return this.form.ccCvv.length === this.cvvLength;
    },
    validName() {
      return this.form.ccName !== '';
    },
    validAddress() {
      return this.form.ccAddress !== '';
    },
    validCP() {
      return this.form.ccPostalCode !== '';
    }
  },
  methods: {
    switchCVCIcon() {
      this.showCVCHelp = !this.showCVCHelp;
    },
    validateCCNumber() {
      this.$nextTick(() => {
        if (this.form.ccNumber.length > 0) {
          this.form.ccNumber = this.form.ccNumber.substring(0, this.ccLength);
          this.form.ccNumber = this.form.ccNumber.replace(/([a-zA-Z,._])/g, '');
          if (this.form.ccNumber.charAt(0) === '4') {
            this.ccBank = CC_BANKS.VISA;
            this.ccLength = 19;
            this.cvvLength = 3;
          } else if (/^5[1-5]/.test(this.form.ccNumber.substring(0, 2))) {
            this.ccBank = CC_BANKS.MASTERCARD;
            this.ccLength = 19;
            this.cvvLength = 3;
          } else if (this.banksPermited.find(bank => bank === 'Amex') && /^3[47]/.test(this.form.ccNumber.substring(0, 2))) {
            this.ccBank = CC_BANKS.AMEX;
            this.ccLength = 17;
            this.cvvLength = 4;
          } else {
            this.ccBank = '';
            this.ccLength = 19;
            this.cvvLength = 3;
          }
        } else {
          this.ccBank = '';
        }
      });
    },
    validateCVC() {
      this.$nextTick(() => {
        if (this.form.ccCvv.length > 0) {
          this.form.ccCvv = this.form.ccCvv.substring(0, this.cvvLength);
          this.form.ccCvv = this.form.ccCvv.replace(/([a-zA-Z,._])/g, '');
        }
      });
    },
    handlerBluredCardNumber() {
      this.cardNumsBlured = true;
      if (this.validCardNumber) {
        this.validationsPassed.cardNumber = true;
      } else {
        this.validationsPassed.cardNumber = false;
      }
    },
    handlerBluredCVV() {
      this.CVVBlured = true;
      if (this.validCVV) {
        this.validationsPassed.ccCvv = true;
      } else {
        this.validationsPassed.ccCvv = false;
      }
    },
    handlerBluredCardExp() {
      this.form.ccExpiration = `${this.expMonth}${this.expYear.slice(-2)}`;
      if (this.expYear !== '') {
        this.cardExpBlured = true;
      }
      if (this.validExp) {
        this.validationsPassed.cardExp = true;
      } else if (this.expMonth !== '' && this.expYear !== '') {
        this.validationsPassed.cardExp = false;
      }
    },
    handlerBluredName() {
      this.nameBlured = true;
      if (this.validName) {
        this.validationsPassed.name = true;
      } else {
        this.validationsPassed.name = false;
      }
    },
    handlerBluredAddress() {
      this.addressBlured = true;
      if (this.validAddress) {
        this.validationsPassed.address = true;
      } else {
        this.validationsPassed.address = false;
      }
    },
    handlerBluredCP() {
      this.cpBlured = true;
      if (this.validCP) {
        this.validationsPassed.cp = true;
      } else {
        this.validationsPassed.cp = false;
      }
    },
    ccBankIs(bank) {
      return this.ccBank === bank;
    }
  },
  watch: {
    cardNums() {
      let val = '';
      if (this.ccBank === CC_BANKS.VISA || this.ccBank === CC_BANKS.MASTERCARD || this.ccBank === '') {
        val = this.form.ccNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      } else if (this.ccBank === CC_BANKS.AMEX) {
        if (this.form.ccNumber.length === 5 || this.form.ccNumber.length === 12) {
          const position = this.form.ccNumber.length - 1;
          val = [this.form.ccNumber.slice(0, position), ' ', this.form.ccNumber.slice(position)].join('').trim();
        } else {
          val = this.form.ccNumber;
        }
      }
      this.form.ccNumber = val;
    },
    validationsPassed: {
      deep: true,
      handler(data) {
        const values = {
          status: false,
          form: {
            ...this.form
          }
        };
        if (Object.values(data).every(item => item)) {
          values.status = true;
        }
        this.$emit('ccOK', values);
      }
    }
  }
};
</script>

<style lang="scss">
  @import "./scss/app";
  .relative {
    position: relative;
  }

  .input--cardBrand {
    position: absolute;
    top: 24px;
    right: 15px;
  }

  .input--cvv {
    width: 80%;
    float: left;
    input {
      width: 100%;
      box-sizing : border-box;
      padding: 10px 0px;
      margin: 5px 0px;
    }
  }

  .cvv__icon__container {
    width: 18%;
    margin-left: 2%;
    float: left;
    position: relative;
  }

  .cc__cvc__icon {
    display: inline-block;
    align-self: center;
    font-size: 16px;
    width: 25px;
    text-align: center;
    color: white;
    background: #1097af;
    height: 25px;
    border-radius: 50%;
    margin: 0;
    line-height: 25px;
    padding: 0px;
  }

  .cc__cvc__helpbox {
    position: absolute;
    right: 0px;
    bottom: 37px;
    width: 120px;
    font-size: 10px;
    padding: 5px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.19);
    border-radius: 0;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.19);
    img {
      width: 110px;
    }
  }

  .cc__cvc__helpbox__triangle {
    position: absolute;
    left: 1px;
    bottom: 20px;
    width: 0px;
    height: 0px;
    // background-color: red;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid rgba(0, 0, 0, 0.19);
  }
</style>

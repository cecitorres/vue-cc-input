<template>
  <div style="font-size: 14px;">
    <div v-if="useName" class="input__block">
      <p class="">Nombre de Tarjetabiente</p>
      <input
        class="input input--100"
        type="text"
        v-model.lazy="form.ccName"
        @change="handlerBluredName"
      />
      <p v-if="!validName && nameBlured" class="error">El campo nombre de Tarjetabiente es requerido</p>
    </div>

    <div class="input__block relative">
      <p class="">Número de tarjeta</p>
      <img v-if="showBankImg && brandCard !== ''" class="input--cardBrand" :src="CARD_BRAND_IMGS[brandCard].img" height="32px" :alt="CARD_BRAND_IMGS[brandCard].alt" />
      <input
        class="input input--100"
        :class="{ 'input--error': !validCardNumber && cardNumsBlured }"
        type="text"
        inputmode="numeric"
        placeholder="0000 0000 0000 0000"
        :maxlength="ccLength"
        v-model.lazy="form.ccNumber"
        @change="doValidationToCardNumber"
        @input="addSpacesToCardNumbersInput"
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
            ref="expMonth"
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
            <option value="2030">2030</option>
          </select>
        </div>
        <!-- <p v-if="cardExpBlured" class="error">El campo fecha es requerido</p> -->  
        <p v-if="!validExp && cardExpBlured" class="error">Fecha inválida</p>
      </div>
      <div class="w2 cvv__container">
        <div>
          <p bold :space="false">CVV</p>
          <!-- <div class="w2 cvv__icon__container">
          </div> -->
        </div>
        <div class="cvv__input">
          <div class="input--cvv">
            <div>
              <p class="cc__cvc__helpbox" v-if="showCVCHelp">
                <img v-if="brandCard === CC_BANKS.AMEX" src="./assets/images/cvv-amex.png" alt="CVV">
                <img v-else src="./assets/images/cvv.png" alt="CVV">
              </p>
              <p class="cc__cvc__helpbox__triangle" v-if="showCVCHelp"></p>

              <p class="cc__cvc__helpbox__triangle-2" v-if="showCVCHelp"></p>
            </div>
            <span class="cc__cvc__icon" @click="switchCVCIcon">?</span>
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
              v-model.lazy="form.ccCvv"
              @input="validateCVC"
              @change="handlerBluredCVV"
            />
            <p v-if="!validCVV && CVVBlured" class="error">El campo código de seguridad es requerido</p>
          </div>
        </div>
      </div>
    </div>
    <slot />

    <!-- <div class="input__block">
      <p class="">Dirección</p>
      <input
        class="input input--100"
        type="text"
        v-model="form.ccAddress"
        @blur="handlerBluredAddress"
      />
      <p v-if="!validAddress && addressBlured" class="error">El campo dirección es requerido</p>
    </div> -->

    <!-- <div class="input__block">
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
    </div> -->
  </div>
</template>

<script>
import {
  CC_BANKS,
  CC_REGEX,
  CARD_BRAND_IMGS
} from './utils/constants';
import isAfter from 'date-fns/isAfter';
import luhnTest from './utils/luhnAlgorithm';

export default {
  props: {
    banksPermited: Array,
    showBankImg: {
      type: Boolean,
      default: true
    },
    useName: Boolean,
    useAddress: Boolean,
    usePostalCode: Boolean,
  },
  data() {
    return {
      expMonth: '',
      expYear: '',
      form: {
        ccNumber: '',
        ccExpiration: '',
        ccCvv: ''
      },
      validationsPassed: {
        cardNumber: false,
        cardExp: false,
        ccCvv: false
      },
      showCVCHelp: false,
      brandCard: '',
      ccLength: 19,
      cvvLength: 3,
      CC_BANKS,
      CARD_BRAND_IMGS,
      cardNumsBlured: false,
      cardExpBlured: false,
      CVVBlured: false,
      nameBlured: false,
      addressBlured: false,
      cpBlured: false
    };
  },
  created() {
    if (this.useName) {
      this.$set(this.form, 'ccName', '');
      this.$set(this.validationsPassed, 'name', false);
    }
  },
  computed: {
    errorCCNumberText() {
      return this.brandCard === CC_BANKS.AMEX ? 'Ingresa los 15 dígitos de tu tarjeta' : 'Ingresa los 16 dígitos de tu tarjeta';
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

      return testPassed.some(test => test === true) && luhnTest(number);
    },
    validExp() {
      if (this.expYear === '' || this.expMonth === '') return false;
      return isAfter(new Date(this.expYear, this.expMonth, 1), new Date());
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
    setBrandCard(cardNumber) {
      return new Promise((resolve) => {
        if (cardNumber.length === 0) {
          this.brandCard = '';
          return;
        }
        let localCardNumber = cardNumber.substring(0, this.ccLength);
        localCardNumber = localCardNumber.replace(/([a-zA-Z,._])/g, '');
        if (localCardNumber.charAt(0) === '4') {
          this.brandCard = CC_BANKS.VISA;
          this.ccLength = 19;
          this.cvvLength = 3;
        } else if (/^5[1-5]/.test(localCardNumber.substring(0, 2))) {
          this.brandCard = CC_BANKS.MASTERCARD;
          this.ccLength = 19;
          this.cvvLength = 3;
        } else if (this.banksPermited.find(bank => bank === 'Amex') && /^3[47]/.test(localCardNumber.substring(0, 2))) {
          this.brandCard = CC_BANKS.AMEX;
          this.ccLength = 17;
          this.cvvLength = 4;
        } else {
          this.brandCard = '';
          this.ccLength = 19;
          this.cvvLength = 3;
        }
        resolve();
      });
    },
    async addSpacesToCardNumbersInput(e) {
      let cardNumberWithSpaces = '';
      const typingValue = e.target.value;
      await this.setBrandCard(String(typingValue));
      if (this.brandCard === CC_BANKS.VISA || this.brandCard === CC_BANKS.MASTERCARD || this.brandCard === '') {
        cardNumberWithSpaces = typingValue.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      } else if (this.brandCard === CC_BANKS.AMEX) {
        if (typingValue.length === 5 || typingValue.length === 12) {
          const position = typingValue.length - 1;
          cardNumberWithSpaces = [typingValue.slice(0, position), ' ', typingValue.slice(position)].join('').trim();
        } else {
          cardNumberWithSpaces = typingValue;
        }
      }
      e.target.value = cardNumberWithSpaces;
    },
    validateCVC(e) {
      const typingValue = e.target.value
      let filteredText = typingValue.substring(0, this.cvvLength);
      e.target.value = filteredText;
    },
    doValidationToCardNumber() {
      this.cardNumsBlured = true;
      this.updateValidation('cardNumber', this.validCardNumber);
    },
    handlerBluredCVV() {
      this.CVVBlured = true;
      this.updateValidation('ccCvv', this.validCVV);
    },
    handlerBluredCardExp() {
      this.form.ccExpiration = `${this.expMonth}${this.expYear.slice(-2)}`;
      if (this.expYear !== '') {
        this.cardExpBlured = true;
      }
      this.updateValidation('cardExp', this.validExp);
    },
    handlerBluredName() {
      this.nameBlured = true;
      this.updateValidation('name', this.validName);
    },
    handlerBluredAddress() {
      this.addressBlured = true;
      this.updateValidation('address', this.validAddress);
    },
    handlerBluredCP() {
      this.cpBlured = true;
      this.updateValidation('cp', this.validCP);
    },
    updateValidation(name, validationMethod) {
      this.validationsPassed[name] = validationMethod;
    },
    ccBankIs(bank) {
      return this.brandCard === bank;
    }
  },
  watch: {
    form: {
      deep: true,
      handler(data) {
        const vueCCInputValues = {
          ...data,
          ccNumber: this.cardNums.replace(/\s+/g, ''),
          isValid: false
        };

        if (Object.values(this.validationsPassed).every(item => item)) vueCCInputValues.isValid = true;
        this.$emit('input', vueCCInputValues)
      }
    }
  }
};
</script>

<style lang="scss">
  @import "./assets/credit-card";
</style>

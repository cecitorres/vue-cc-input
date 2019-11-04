  // The Luhn Algorithm.
  export default num => {
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

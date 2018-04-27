function format_currency(value) {
  return "R$ " + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

export {
  format_currency
}
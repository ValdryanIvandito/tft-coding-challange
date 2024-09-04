export default function toADA(number) {
  // Membalikkan string untuk mempermudah penambahan pemisah ribuan
  let reversedStr = number.split("").reverse().join("");

  // Menambahkan pemisah ribuan setiap 2 digit
  let formattedReversedStr = reversedStr.match(/.{1,2}/g).join(",");

  // Membalikkan string kembali ke arah semula
  let formattedStr = formattedReversedStr.split("").reverse().join("");

  return formattedStr;
}

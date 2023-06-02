export const pattern = {
  name: /^[A-Za-z0-9]+([\s][A-Za-z0-9]+)*$/,
  symbol: /^[A-Za-z0-9]+$/,
  imgURL: /^(http(s)?:\/\/)([a-zA-z0-9]+(-)?[a-zA-z0-9]+\.)+([a-zA-z0-9]+)(\/[a-zA-z0-9]+)*([a-zA-z0-9]+(-?)[a-zA-z0-9]+\.(png|jpe?g|webp)){1}$/,
  domain: /^(http(s)?:\/\/)([a-zA-z0-9]+(-)?[a-zA-z0-9]+\.)+([a-zA-z0-9]+)$/,
  fullURL: /^(http(s)?:\/\/)([a-zA-z0-9]+(-)?[a-zA-z0-9]+\.)+([a-zA-z0-9]+)(\?[a-zA-z0-9]+\=[a-zA-z0-9]+)?(\/[a-zA-z0-9]+)*$/,
  number: /^[0-9]+$/,
  address: /^0x[a-fA-F0-9]{40}$/,
}

export const shortAddress = (address?: string): string =>
  address == null ? '' : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

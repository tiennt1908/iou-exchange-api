export const validate = {
  address: (data: any) => {
    return /^0x[a-fA-F0-9]{40}$/.test(data);
  },
  floatNumber: (data: any) => {
    return /^[0-9]{1,}(\.[0-9]+)?$/.test(data)
  }
}
export const regexCustom = {
  limitDecimal: (data: string, limit: number) => {
    if (validate.floatNumber(data)) {
      return data.match(eval(`/^[0-9]{1,}\.([0-9]{1,${limit}})?/`))?.[0] || data;
    }
    return data;
  },
  cutFloatNumber: (data: string) => {
    if (validate.floatNumber(data)) {
      return data.match(/^[0-9]{1,}(\.[0]*[1-9]+)?/)?.[0] || "";
    }
    return "";
  },
}

export const time = {
  delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}
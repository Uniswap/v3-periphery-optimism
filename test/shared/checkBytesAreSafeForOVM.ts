export function checkBytesAreSafeForOVM(bytes: string): boolean {
  for (let i = 0; i < bytes.length; i += 2) {
    const curByte = bytes.substr(i, 2).toLowerCase()

    if (curByte === '5b') {
      return false
    }
  }

  return true
}

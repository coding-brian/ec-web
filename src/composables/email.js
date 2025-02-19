export function useEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const checkEmail = (value) => {
    if (!emailRegex.test(value)) {
      return false
    }

    return true
  }

  return { checkEmail }
}

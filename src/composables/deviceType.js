import deviceType from '@/const/deviceType.json'

export function useDeviceType() {
  const getDeviceType = () => {
    const width = window.innerWidth

    if (width <= 767) {
      return deviceType.mobile // 手機尺寸
    } else if (width >= 768 && width <= 1024) {
      return deviceType.tablet // 平板尺寸
    } else {
      return deviceType.desktop // 桌機尺寸
    }
  }

  return { getDeviceType }
}

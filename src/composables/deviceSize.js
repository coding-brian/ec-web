import { useDeviceType } from '@/composables/deviceType'
import deviceType from '@/const/deviceType.json'

export function useDeviceSize() {
  const { getDeviceType } = useDeviceType()

  let objectProperty = 'isDesktopSize'

  switch (getDeviceType()) {
    case deviceType.mobile:
      objectProperty = 'isMobileSize'
      break
    case deviceType.tablet:
      objectProperty = 'isTabletSize'
      break
    case deviceType.desktop:
      objectProperty = 'isDesktopSize'
      break
  }

  return { objectProperty }
}

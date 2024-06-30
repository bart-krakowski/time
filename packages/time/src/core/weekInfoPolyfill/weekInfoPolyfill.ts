interface WeekInfo {
  firstDay: number
  weekend: number[]
  minimalDays: number
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  interface Locale {
    getWeekInfo: () => WeekInfo
    weekInfo?: WeekInfo
  }
}

;(function () {
  // Chrome & Safari
  if ('weekInfo' in Intl.Locale.prototype && typeof Intl.Locale.prototype.getWeekInfo !== 'function') {
    Intl.Locale.prototype.getWeekInfo = function () {
      return this.weekInfo
    }
  }
  // Firefox
  if (typeof Intl.Locale.prototype.getWeekInfo !== 'function') {
    import('./weekInfoData').then(({ weekInfoData }) => {
      Intl.Locale.prototype.getWeekInfo = function () {
        const locale = this.toString().toLowerCase()

        const match =
          weekInfoData[locale] ||
          weekInfoData[locale.split('-')[0]] ||
          weekInfoData['default']

        return {
          firstDay: match?.firstDay,
          weekend: match?.weekend,
          minimalDays: match?.minimalDays,
        }
      }
    })
  }
})()

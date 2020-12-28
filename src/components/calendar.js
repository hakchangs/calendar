import moment from "moment"

/**
 * 요일 약어 재설정
 */
moment.updateLocale("ko", {
  weekdaysMin: ["일", "월", "화", "수", "목", "금", "토"],
})
console.log("weekdays=", moment.weekdays())

const DEFAULT_FORMAT = "YYYY-MM-DD"

class Calendar {
  constructor(selector, viewFormat = "YYYY.MM.DD", cal = moment()) {
    this.selector = selector
    this.el = document.querySelector(selector)
    this.cal = cal
    this.viewFormat = viewFormat
    this.setDays(cal)
    this.render()
    this.setEvents()
    this.log()
  }
  render() {
    const weekdaysBody = moment
      .weekdaysMin()
      .map((w) => `<div>${w}</div>`)
      .reduce((p, c) => p + c)

    const daysBody = [...this.getDaysBefore(), ...this.days, ...this.getDaysAfter()]
      .map((day) => {
        const viewValue = day.format("D")
        const date = day.format(DEFAULT_FORMAT)
        let clazz = "day"
        if (day.isSame(moment(), "day")) clazz += " today"
        if (day.isBefore(this.cal, "month")) clazz += " before"
        if (day.isAfter(this.cal, "month")) clazz += " after"
        return `<div class="${clazz}" data-date="${date}">${viewValue}</div>`
      })
      .reduce((p, c) => p + c)

    this.el.innerHTML = `
      <div class="calendar">
        <header class="output">
          <output />
        </header>
        <section class="year-month">
          <div class="prev-year"></div>
          <div class="prev-month"></div>
          <div>
            <section class="year">
              ${this.cal.format("YYYY")}
            </section>
            <section class="month">
              ${this.cal.format("M")}
            </section>
          </div>
          <div class="next-month"></div>
          <div class="next-year"></div>
        </section>
        <section class="days">
          <div class="days-header">
            ${weekdaysBody}
          </div>
          <div class="days-body">
            ${daysBody}
          </div>
        </section>
      </div>
    `
  }
  setEvents() {
    this.el.addEventListener("click", (event) => {
      const el = event.target
      //
      //selected day
      //
      const isDay = el.classList.contains("day")
      if (isDay) {
        const date = el.dataset["date"]
        console.log("date=", date)
        const output = this.el.querySelector("output")
        output.value = moment(date, DEFAULT_FORMAT).format(this.viewFormat)
      }
      //
      //handler events
      //
      const isPrevMonth = el.classList.contains("prev-month")
      const isNextMonth = el.classList.contains("next-month")
      const isPrevYear = el.classList.contains("prev-year")
      const isNextYear = el.classList.contains("next-year")
      if (isPrevMonth) this.cal = this.cal.subtract(1, "months")
      if (isNextMonth) this.cal = this.cal.add(1, "months")
      if (isPrevYear) this.cal = this.cal.subtract(1, "years")
      if (isNextYear) this.cal = this.cal.add(1, "years")
      if (isPrevMonth || isNextMonth || isPrevYear || isNextYear) {
        this.setDays(this.cal)
        this.render()
      }
    })
  }
  setDays(cal) {
    const daysLength = cal.daysInMonth()
    this.days = []
    for (let day = 0; day < daysLength; day++) {
      const date = new Date(cal.year(), cal.month(), day + 1)
      this.days.push(moment(date))
    }
  }
  getDaysBefore() {
    const firstDay = this.days[0].clone()
    const firstDOW = this.days[0].day(0) //Sunday
    const daysBefore = []
    while (moment(firstDOW).isBefore(firstDay, "day")) {
      daysBefore.push(firstDOW.clone())
      firstDOW.add(1, "days")
    }
    return daysBefore
  }
  getDaysAfter() {
    const lastIndex = this.days.length - 1
    const lastDay = this.days[lastIndex].clone()
    const lastDOW = this.days[lastIndex].day(6) //Saturday
    const daysAfter = []
    while (moment(lastDOW).isAfter(lastDay, "day")) {
      daysAfter.push(lastDOW.clone())
      lastDOW.subtract(1, "days")
    }
    return daysAfter.reverse()
  }
  log() {
    console.log("Calendar..")
    console.log("days=", this.days)
    console.log("year=", this.cal.format("YYYY"))
    console.log("month=", this.cal.format("MM"))
    console.log("day=", this.cal.format("DD"))
  }
}
export default Calendar

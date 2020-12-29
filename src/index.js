import "./css/calendar.css"
import moment from "moment"
import Calendar from "./components/calendar"

class App {
  init() {
    console.log("Hello")
    const cal = new Calendar("#calendar", {
      // cal: moment().subtract(1, "months"),
    })
    cal.logSelf()
  }
}

new App().init()

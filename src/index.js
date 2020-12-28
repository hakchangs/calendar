import "./css/calendar.css"
import moment from "moment"
import Calendar from "./components/calendar"

class App {
  init() {
    console.log("Hello")
    const cal = new Calendar("#calendar")
    const cal2 = new Calendar("#calendar-2")
  }
}

new App().init()

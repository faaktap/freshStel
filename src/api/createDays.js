/* Quick date functions - no need to include this.
    let d = new Date();
    let year = d.getFullYear() + 1;
    let month = d.getMonth();
    let day = d.getDate();
    let c = new Date(year + 1, month, day);
    console.log(c);
*/
// date.getDay --- always return day of week 1 to 5 is Mon to Fri, sunday is zero and sat is 6

import { zDate } from '@/api/zDate.js'

export const createDays = {
    stepIt : function() {
      let weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      let startDate = new Date(2022,4,11) //.setHours(0,0,0,0)
      let endDate = new Date(2023,11,31) //.setHours(0,0,0,0)
      let daysOfYear = [];
      for (let d = new Date(startDate) ; d <= endDate; d.setDate(d.getDate() + 1)) {
        daysOfYear.push({
            date: new Date(d),
            day: d.getDay(),
            dayName: weekDays[d.getDay()],
            school: d.getDay() == 0 || d.getDay() == 6 ? 0 : 1 ,  // sunday and saturday is 0 and 6
            holiday: zDate.isPublicHoliday(d),
            description: zDate.format(d,'yyyy-MM-dd')
        });
      }
      return daysOfYear
    }
}

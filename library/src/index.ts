import * as holiday_jp from "@holiday-jp/holiday_jp";

// yyyy年mm月の月初第n営業日を取得する関数  
export function getNthBusinessDay(year: number, month: number, n: number, additionalHolidays?: Date[]): Date | null {
  // 1日からループを行い、祝日でない日をカウントする
  let count = 0;
  for (let i = 1; i <= 31; i++) {
    const date = new Date(year, month, i);
    // 祝日の場合はスキップする
    if (holiday_jp.isHoliday(date)) {
      continue;
    }
    // 土日の場合もスキップする
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    // 追加祝日の場合もスキップする
    if (additionalHolidays && additionalHolidays.some(holiday => holiday.getTime() === date.getTime())) {
      continue;
    }
    count++;
    if (count === n) {
      return date;
    }
  }
  return null;
}

// yyyy_start年mm_start月～yyyy_end年mm_end月 月初第n営業日を取得する関数 
export function getNthBusinessDayRange(year_start: number, month_start: number, year_end: number, month_end: number, n: number, additionalHolidays?: Date[]): Date[] {
  let result: Date[] = [];
  let currentDate = new Date(year_start, month_start);
  let endDate = new Date(year_end, month_end);

  while (currentDate <= endDate) {
    const date = getNthBusinessDay(currentDate.getFullYear(), currentDate.getMonth(), n, additionalHolidays);
    if (date) {
      result.push(date);
    }

    // 1ヶ月進める
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return result;
}

// 銀行法におけるyyyy_start年mm_start月～yyyy_end年mm_end月 月初第n営業日を取得する関数 
export function getNthBusinessDaysBankRange(year_start: number, month_start: number, year_end: number, month_end: number, n: number): Date[] {
  let additionalHolidays = getAdditionalBankHolidays(year_start, month_start, year_end, month_end);
  
  // getNthBusinessDayRangeを呼び出す
  let result = getNthBusinessDayRange(year_start, month_start, year_end, month_end, n, additionalHolidays);
  return result;
}

// 期間中の12月31日,1月2日,1月3日を追加祝日として抽出する関数
export function getAdditionalBankHolidays(year_start: number, month_start: number, year_end: number, month_end: number): Date[] {
  let result: Date[] = [];
  let currentDate = new Date(year_start, month_start);
  let endDate = new Date(year_end, month_end);

  while (currentDate <= endDate) {
    if (currentDate.getMonth() === 0) {
      result.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 2));
      result.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 3));
    } else if (currentDate.getMonth() === 11) {
      result.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 31));
    }
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return result;
}

// Date型のListからicsファイルを作成する関数
export function createIcsFile(data: Date[], summary?: string): string {
  let result = "BEGIN:VCALENDAR\n";
  result += "VERSION:2.0\n";
  result += "PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n";
  result += "CALSCALE:GREGORIAN\n";
  result += "BEGIN:VTIMEZONE\n";
  result += "TZID:Asia/Tokyo\n";
  result += "BEGIN:STANDARD\n";
  result += "TZOFFSETFROM:+0900\n";
  result += "TZOFFSETTO:+0900\n";
  result += "TZNAME:JST\n";
  result += "DTSTART:19700101T000000\n";
  result += "END:STANDARD\n";
  result += "END:VTIMEZONE\n";

  data.forEach(date => {
    result += "BEGIN:VEVENT\n";
    // DTSTART, DTENDの設定
      result += "DTSTART;TZID=Asia/Tokyo:" + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + "T080000\n";
      result += "DTEND;TZID=Asia/Tokyo:" + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + "T081000\n";

      result += "SUMMARY:" + summary + "\n";
      result += "END:VEVENT\n";
  });

  result += "END:VCALENDAR\n";
  return result;
}
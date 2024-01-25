import { useState } from 'react';
import { getNthBusinessDaysBankRange } from '../../../library/src/index';
import { createIcsFile } from '../../../library/src/index';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from 'file-saver';

function BusinessDayList() {
  const [start, setStart] = useState((new Date('2022-01-01')));
  const [end, setEnd] = useState(new Date('2022-12-31'));
  const [nthBusinessDay, setNthBusinessDay] = useState(1);
  const [businessDays, setBusinessDays] = useState<Date[]>([]);

  const saveIcsFile = () => {
    const icsContent = createIcsFile(businessDays);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    saveAs(blob, "business_days.ics");
  };

  const getBusinessDays = () => {
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const days = getNthBusinessDaysBankRange(startYear, startMonth, endYear, endMonth, nthBusinessDay);
    const jstDays = days.map(day => new Date(day.getTime() + 9 * 60 * 60 * 1000)); // Convert to JST
    setBusinessDays(jstDays);
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <DatePicker
          selected={start}

          onChange={(date: Date | null) => date && setStart(date)}
          dateFormat="yyyy年MM月"
          showMonthYearPicker
          customInput={<TextField label="開始年月" />}
          popperPlacement="bottom-start"
        />
        <DatePicker
          selected={end}
          onChange={(date: Date | null) => date && setEnd(date)}
          dateFormat="yyyy年MM月"
          showMonthYearPicker
          customInput={<TextField label="終了年月" />}
          popperPlacement="bottom-start"
        />
        <TextField
          id="nth-business-day"
          label="N営業日"
          type="number"
          defaultValue={nthBusinessDay}
          onChange={e => setNthBusinessDay(Number(e.target.value))}
        />
      </div>
      <Button variant="contained" onClick={getBusinessDays}>営業日のリストを取得</Button>
      <TextareaAutosize
        readOnly
        minRows={10}
        style={{ width: '100%' }}
        value={businessDays.map(date => date.toISOString()).join('\n')}
      />
      <Button variant="contained" onClick={() => saveIcsFile()}>iCalファイルを作成</Button>
    </Box>
  );
}

export default BusinessDayList;
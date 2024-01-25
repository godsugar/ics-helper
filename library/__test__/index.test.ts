import { getNthBusinessDay } from '../src/index';
import { getNthBusinessDayRange } from '../src/index';
import { getNthBusinessDaysBankRange } from '../src/index';
import { getAdditionalBankHolidays } from '../src/index';

describe('getNthBusinessDay', () => {
  it('2024年2月の第9営業日は2024/02/14', () => {
    const result = getNthBusinessDay(2024,1,9);
    expect(result).toEqual(new Date(2024,1,14)); // 2024年2月の第9営業日は2024/02/14
  });

  it('2024/01/02と2024/01/03を休みとした場合、2024年1月の第9営業日は2024/01/17', () => {
    const result = getNthBusinessDay(2024,0,9,[new Date(2024,0,2), new Date(2024,0,3)]);
    expect(result).toEqual(new Date(2024,0,17)); // 2024/01/02と2024/01/03を休みとした場合、2024年1月の第9営業日は2024/01/17
  });

  it('2022年1月には31営業日は存在しないため、nullを返す', () => {
    const result = getNthBusinessDay(2022, 0, 31);
    expect(result).toBeNull(); // 2022年1月には31営業日は存在しないため、nullを返す
  });
});

describe('getNthBusinessDayRange', () => {
  it('2024年2月-2024年3月の第9営業日は2024/02/14, 2024/03/13', () => {
    const result = getNthBusinessDayRange(2024,1,2024,2,9);
    expect(result).toEqual([new Date(2024,1,14), new Date(2024,2,13)]); // 2024年2月～2024年3月の第9営業日は2024/02/14, 2024/03/14
  });

  it('2025/01/02と2025/01/03を休みとした場合、2025年1月-2025年3月の第9営業日は2025/01/17, 2025/02/14, 2025/03/13', () => {
    const result = getNthBusinessDayRange(2025,0,2025,2,9,[new Date(2025,0,2), new Date(2025,0,3)]);
    expect(result).toEqual([new Date(2025,0,17), new Date(2025,1,14), new Date(2025,2,13)]); // 2024/01/02と2024/01/03を休みとした場合、2025年1月～2025年3月の第9営業日は2025/01/17, 2025/02/14, 2025/03/14
  });

  it('2024年1月-2025年3月の20営業日は3月しか存在しない', () => {
    const result = getNthBusinessDayRange(2025,0,2025,2,20,[new Date(2025,0,2), new Date(2025,0,3)]);
    expect(result).toEqual([new Date(2025,2,31)]); // 2022年1月～2025年3月の20営業日は2025/03/21のみ
  });
});

describe('getNthBusinessDaysBankRange', () => {
  it('2025/01/02と2025/01/03を休みとした場合、2025年1月-2025年3月の第9営業日は2025/01/17, 2025/02/14, 2025/03/13', () => {
    const result = getNthBusinessDaysBankRange(2025,0,2025,2,9);
    expect(result).toEqual([new Date(2025,0,17), new Date(2025,1,14), new Date(2025,2,13)]); // 2024/01/02と2024/01/03を休みとした場合、2025年1月～2025年3月の第9営業日は2025/01/17, 2025/02/14, 2025/03/14
  });

  it('2025年1月-2025年3月の20営業日は3月しか存在しない', () => {
    const result = getNthBusinessDaysBankRange(2025,0,2025,2,20);
    expect(result).toEqual([new Date(2025,2,31)]); // 2022年1月～2025年3月の20営業日は2025/03/21のみ
  });
});

describe('getAdditionalBankHolidays', () => {
  it('2025年1月-2025年12月の追加祝日は2025/01/02, 2025/01/03, 2025/12/31', () => {
    const result = getAdditionalBankHolidays(2025,0,2025,11);
    expect(result).toEqual([new Date(2025,0,2), new Date(2025,0,3), new Date(2025,11,31)]); // 2025年1月-2025年3月の追加祝日は2025/01/02, 2025/01/03, 2025/12/31
  });
});
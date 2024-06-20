import { Temporal } from '@js-temporal/polyfill';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DatePicker } from '../core/date-picker';
import type { DatePickerOptions } from '../core/date-picker';

describe('DatePicker', () => {
  let options: DatePickerOptions;
  let datePicker: DatePicker;
  const mockDate = Temporal.PlainDate.from('2023-06-15');
  const mockDateTime = Temporal.PlainDateTime.from('2023-06-15T10:00');

  beforeEach(() => {
    options = {
      weekStartsOn: 1,
      viewMode: { value: 1, unit: 'month' },
      events: [
        {
          id: '1',
          startDate: Temporal.PlainDateTime.from('2023-06-10T09:00'),
          endDate: Temporal.PlainDateTime.from('2023-06-10T10:00'),
          title: 'Event 1',
        },
        {
          id: '2',
          startDate: Temporal.PlainDateTime.from('2023-06-12T11:00'),
          endDate: Temporal.PlainDateTime.from('2023-06-12T12:00'),
          title: 'Event 2',
        },
      ],
      selectedDates: [Temporal.PlainDate.from('2023-06-10')],
      multiple: true,
    };
    datePicker = new DatePicker(options);
    vi.spyOn(Temporal.Now, 'plainDateISO').mockReturnValue(mockDate);
    vi.spyOn(Temporal.Now, 'plainDateTimeISO').mockReturnValue(mockDateTime);
  });

  test('should initialize with the correct selected dates', () => {
    const selectedDates = datePicker.getSelectedDates();
    expect(selectedDates).toHaveLength(1);
    expect(selectedDates[0]?.toString()).toBe('2023-06-10');
  });

  test('should select a date correctly in single selection mode', () => {
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-15'));
    const selectedDates = datePicker.getSelectedDates();
    expect(selectedDates).toHaveLength(1);
    expect(selectedDates[0]?.toString()).toBe('2023-06-15');
  });

  test('should select multiple dates correctly', () => {
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-15'));
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-20'));
    const selectedDates = datePicker.getSelectedDates();
    expect(selectedDates).toHaveLength(3);
    expect(selectedDates.map(date => date.toString())).toContain('2023-06-15');
    expect(selectedDates.map(date => date.toString())).toContain('2023-06-20');
  });

  test('should deselect a date correctly in multiple selection mode', () => {
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-10'));
    const selectedDates = datePicker.getSelectedDates();
    expect(selectedDates).toHaveLength(0);
  });

  test('should select a date range correctly', () => {
    datePicker = new DatePicker({
      ...options,
      multiple: false,
      range: true,
      selectedDates: [Temporal.PlainDate.from('2023-06-10')],
    });
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-15'));
    const selectedDates = datePicker.getSelectedDates();
    expect(selectedDates).toHaveLength(2);
    expect(selectedDates.map(date => date.toString())).toContain('2023-06-10');
    expect(selectedDates.map(date => date.toString())).toContain('2023-06-15');
  });

  test('should not select a date outside the min and max range', () => {
    datePicker = new DatePicker({
      ...options,
      minDate: Temporal.PlainDate.from('2023-06-05'),
      maxDate: Temporal.PlainDate.from('2023-06-20'),
    });
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-01'));
    datePicker.selectDate(Temporal.PlainDate.from('2023-06-25'));
    const selectedDates = datePicker.getSelectedDates();
    expect(selectedDates).toHaveLength(1);
    expect(selectedDates[0]?.toString()).toBe('2023-06-10');
  });
});

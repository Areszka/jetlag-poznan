import { expect, test } from "vitest";
import { formatTime } from "@/app/helpers";

test("formatTime", () => {
  expect(formatTime(0)).toBe("00:00");
  expect(formatTime(0, { showHours: true })).toBe("00:00:00");
  expect(formatTime(1000)).toBe("00:01");
  expect(formatTime(1000, { showHours: true })).toBe("00:00:01");
  expect(formatTime(30000)).toBe("00:30");
  expect(formatTime(30000, { showHours: true })).toBe("00:00:30");
  expect(formatTime(60000)).toBe("01:00");
  expect(formatTime(60000, { showHours: true })).toBe("00:01:00");
  expect(formatTime(10 * 60 * 1000)).toBe("10:00");
  expect(formatTime(60 * 60 * 1000)).toBe("01:00:00");
  expect(formatTime(60 * 60 * 1000, { showHours: true })).toBe("01:00:00");
  expect(formatTime(23487623, { showHours: true })).toBe("06:31:27");
  expect(formatTime(123 * 60 * 60 * 1000)).toBe("123:00:00");
});

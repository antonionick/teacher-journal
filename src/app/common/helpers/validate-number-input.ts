import { KeyCheck } from '../models/Key-check';

/*
  keys from 0 to 9:
    - 48-57: top of keyboard
    - 96-105: right of keyboard
  8: backspace
  38: keyUP
  40: keyDown
  13: enter
*/
const validKeyCodesInteger: Array<KeyCheck> = [
  new KeyCheck({
    from: 48,
    to: 57,
    range: true,
  }),
  new KeyCheck({
    from: 96,
    to: 105,
    range: true,
  }),
  new KeyCheck({
    value: 8,
  }),
  new KeyCheck({
    value: 38,
  }),
  new KeyCheck({
    value: 40,
  }),
  new KeyCheck({
    value: 13,
  }),
];

function checkValidKeyCodes(codes: Array<KeyCheck>, code: number): boolean {
  return codes.some((item) => {
    if (item.range) {
      return code >= item.from && code <= item.to;
    }

    return code === item.value;
  });
}

function setMinMax(value: number, min: number, max: number): number {
  if (+value < min) {
    return min;
  } else if (+value > max) {
    return max;
  }

  return value;
}

function checkValidKeyDown(keyCodes: Array<KeyCheck>, event: KeyboardEvent): boolean {
  if (!checkValidKeyCodes(keyCodes, event.keyCode)) {
    return false;
  }

  return true;
}

export { validKeyCodesInteger, checkValidKeyCodes, checkValidKeyDown, setMinMax };

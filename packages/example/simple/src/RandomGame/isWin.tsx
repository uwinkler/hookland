export function isWin(luckyNumber: number) {
  return [111, 222, 333, 444, 555, 666, 777, 888, 999].some(
    (n) => luckyNumber === n
  );
}

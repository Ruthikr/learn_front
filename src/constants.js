export const ACCESS_TOKEN="access";
export const REFRESH_TOKEN="refresh";

const min = 1;
const max = 9999999;
const randomIntInRange = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(randomIntInRange);
export const RANDOM_ID=randomIntInRange;
/**
 * Returns random item from array
 * @param {array} array Array
 * @returns {any} Item from array
 */
export const randomArray = (array: any[]): any => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Returns random value between min and max
 * @param {number} min Minimum
 * @param {number} max Maximum
 * @returns {number} Random value
 */
export const random = (min: number = 0, max: number = 1): number => {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1))
}

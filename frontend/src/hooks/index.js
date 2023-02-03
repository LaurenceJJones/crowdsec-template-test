import jsonData from '../assets/testData.json'
export const fetchFormat = (t) => {
  return formatWrapper(JSON.stringify({ "formatString": t, "alerts": jsonData }))
}
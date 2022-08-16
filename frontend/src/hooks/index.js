import jsonData from '../assets/testData.json'
export const fetchFormat = async (t) => {
  const res = await fetch("/api/v1/format", {
    body: JSON.stringify({
      "formatString": t,
      "alerts": jsonData
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  })
  return await res.text()
}
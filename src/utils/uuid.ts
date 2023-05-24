let UUID = 1

export default function UniqueID() {
  const getID = () => {
    UUID++
    return String(UUID)
  }

  return {
    getID
  }
}

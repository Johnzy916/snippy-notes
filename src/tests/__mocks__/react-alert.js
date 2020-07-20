const useAlert = jest.fn(() => ({
  show: jest.fn((message) => message)
}))

export { useAlert }
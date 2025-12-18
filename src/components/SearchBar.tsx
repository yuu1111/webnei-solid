import { useCallback, useRef } from 'react'
import { useAppState } from '~/hooks/useAppState'

export default function SearchBar() {
  const { setSearch } = useAppState()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setSearch(value)
      }, 250)
    },
    [setSearch]
  )

  return (
    <input
      type="text"
      placeholder="Search"
      className="w-full h-full bg-transparent text-white border border-gray-600 px-3 focus:outline-none focus:border-blue-400"
      onChange={handleInput}
    />
  )
}

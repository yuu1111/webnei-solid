import { useEffect } from 'react'
import { useAppState } from '~/hooks/useAppState'
import NEIBrowser from '~/components/NEIBrowser'
import Sidebar from '~/components/Sidebar'

const GAP = 6
const TOP_HEIGHT = 50

export default function App() {
  const { height, width, setWindowSize } = useAppState()

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setWindowSize])

  const lowerHeight = height - TOP_HEIGHT - GAP
  const rightWidth = width / 2 - GAP

  return (
    <main className="h-screen bg-black p-0 m-0">
      <div
        className="grid h-full"
        style={{
          gridTemplateRows: `${TOP_HEIGHT}px 1fr`,
          gap: `${GAP}px`,
        }}
      >
        <div className="bg-[#2b2d42]" />

        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gap: `${GAP}px`,
            height: `${lowerHeight}px`,
          }}
        >
          <div className="bg-[#001219] overflow-hidden overflow-y-auto">
            <NEIBrowser />
          </div>

          <div className="bg-[#001219]">
            <Sidebar ownWidth={rightWidth} ownHeight={lowerHeight} />
          </div>
        </div>
      </div>
    </main>
  )
}

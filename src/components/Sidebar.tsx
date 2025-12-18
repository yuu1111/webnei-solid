import Items from '~/components/Items'
import SearchBar from '~/components/SearchBar'

interface SidebarProps {
  ownHeight: number
  ownWidth: number
}

const SEARCH_BOX_HEIGHT = 50

export default function Sidebar({ ownHeight, ownWidth }: SidebarProps) {
  return (
    <div
      className="grid h-full"
      style={{
        gridTemplateRows: `1fr ${SEARCH_BOX_HEIGHT}px`,
        height: ownHeight,
      }}
    >
      <div className="bg-[#2b2d42] flex justify-center overflow-hidden">
        <Items ownHeight={ownHeight - SEARCH_BOX_HEIGHT} ownWidth={ownWidth} />
      </div>
      <div className="bg-[#2b2d42]">
        <SearchBar />
      </div>
    </div>
  )
}

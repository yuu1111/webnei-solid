import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { graphqlClient, SIDEBAR_ITEMS_QUERY } from '~/lib/graphql'
import { useAppState } from '~/hooks/useAppState'
import type { SidebarItemInterface } from '~/types'
import ClickableItem from './ClickableItem'

const BOX_WIDTH = 40

interface ItemsProps {
  ownWidth: number
  ownHeight: number
}

export default function Items({ ownWidth, ownHeight }: ItemsProps) {
  const { search } = useAppState()

  const gridSideWidth = Math.floor(ownWidth / BOX_WIDTH)
  const gridSideHeight = Math.floor(ownHeight / BOX_WIDTH)
  const numBoxes = useMemo(
    () => gridSideWidth * gridSideHeight,
    [gridSideWidth, gridSideHeight]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['sidebarItems', numBoxes, search],
    queryFn: async () => {
      const result = await graphqlClient.request<{
        getNSidebarItems: SidebarItemInterface[]
      }>(SIDEBAR_ITEMS_QUERY, {
        limit: numBoxes,
        search: search,
        mode: 'contains',
      })
      return result.getNSidebarItems
    },
    enabled: numBoxes > 0,
  })

  const items = data ?? []

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${gridSideHeight}, ${BOX_WIDTH}px)`,
        gridTemplateColumns: `repeat(${gridSideWidth}, ${BOX_WIDTH}px)`,
      }}
    >
      {!isLoading &&
        Array.from({ length: numBoxes }).map((_, index) => {
          const item = items[index]
          const tooltipLabel = item?.tooltip ?? ''

          const basicDisplayInfo =
            item?.itemId && item?.localizedName && item?.imageFilePath
              ? {
                  itemId: item.itemId,
                  localizedName: item.localizedName,
                  tooltip: item.tooltip ?? '',
                  imageFilePath: item.imageFilePath,
                }
              : undefined

          return (
            <ClickableItem
              key={index}
              tooltipLabel={tooltipLabel}
              basic_display_info={basicDisplayInfo}
              divClass="cell"
              scaleFactor={1}
            />
          )
        })}
    </div>
  )
}

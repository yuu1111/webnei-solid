import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppState } from '~/hooks/useAppState'

interface ClickableItemProps {
  tooltipLabel: string
  basic_display_info?: {
    itemId: string
    localizedName: string
    tooltip: string
    imageFilePath: string
  }
  scaleFactor: number
  divClass?: string
  advanced_display_info?: {
    quantity: number
    clickableType: string
  }
}

const BASE_IMAGE_PATH = './nei_images'

export default function ClickableItem({
  tooltipLabel,
  basic_display_info,
  scaleFactor,
  divClass,
  advanced_display_info,
}: ClickableItemProps) {
  const { imageWidth, setCurrentItem } = useAppState()
  const [showTooltip, setShowTooltip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMakeClick = useCallback(() => {
    if (basic_display_info) {
      setCurrentItem(basic_display_info, 'make')
    }
  }, [basic_display_info, setCurrentItem])

  const handleUseClick = useCallback(() => {
    if (basic_display_info) {
      setCurrentItem(basic_display_info, 'use')
    }
  }, [basic_display_info, setCurrentItem])

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        handleMakeClick()
      } else if (event.key === 'u' || event.key === 'U') {
        handleUseClick()
      }
    },
    [handleMakeClick, handleUseClick]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKey(e)
    if (showTooltip) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showTooltip, handleKey])

  const fullClickableWidth = (imageWidth + 2) * scaleFactor
  const imgWidth = imageWidth * scaleFactor

  let quantityLabel = ''
  if (advanced_display_info) {
    const quant = advanced_display_info.quantity
    quantityLabel = quant.toString()
    if (advanced_display_info.clickableType === 'fluid') {
      if (quant >= 1_000_000) {
        quantityLabel = (quant / 1_000_000).toFixed(0) + 'ML'
      } else if (quant >= 1_000) {
        quantityLabel = (quant / 1_000).toFixed(0) + 'kL'
      } else {
        quantityLabel = quantityLabel + 'L'
      }
    }
  }

  const showQuantity =
    advanced_display_info &&
    (advanced_display_info.quantity > 1 ||
      advanced_display_info.clickableType === 'fluid')

  const quantityDisplayWidth = Math.min(
    fullClickableWidth,
    advanced_display_info ? quantityLabel.length * 10 : 0
  )

  const parseTooltip = (label: string) => {
    try {
      const escaped = label
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
      return JSON.parse(`{"str": "${escaped}"}`).str
    } catch {
      return label
    }
  }

  const divClassName = divClass === 'cell' ? 'cell' : 'cell-no-outline'

  if (!basic_display_info) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={`${divClassName} relative`}
      onClick={handleMakeClick}
      onContextMenu={(e) => {
        e.preventDefault()
        handleUseClick()
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: fullClickableWidth, height: fullClickableWidth }}
      >
        <img
          src={`${BASE_IMAGE_PATH}/${basic_display_info.imageFilePath}`}
          width={imgWidth}
          height={imgWidth}
          loading="lazy"
          decoding="async"
          alt={basic_display_info.localizedName}
        />
      </div>

      {showQuantity && (
        <div
          className="absolute bottom-0 right-0 bg-white flex items-center justify-center text-xs"
          style={{ width: quantityDisplayWidth, height: 15 }}
        >
          {quantityLabel}
        </div>
      )}

      {showTooltip && tooltipLabel && (
        <div className="absolute z-50 left-full ml-2 top-0 bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-pre-wrap max-w-xs pointer-events-none">
          {parseTooltip(tooltipLabel)}
        </div>
      )}
    </div>
  )
}

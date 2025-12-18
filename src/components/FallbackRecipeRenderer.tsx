import { useAppState } from '~/hooks/useAppState'
import ClickableItem from './ClickableItem'
import type {
  BaseRecipeInterface,
  BasicDimensionsInterface,
  FluidInterface,
  GTRecipeInterface,
  ItemInterface,
} from '~/types'

interface FallbackRecipeRendererProps {
  recipe: BaseRecipeInterface | GTRecipeInterface
  recipeType: string
}

const SCALE_FACTOR = 1.25
const GAP = 2

export default function FallbackRecipeRenderer({
  recipe,
  recipeType,
}: FallbackRecipeRendererProps) {
  const { imageWidth } = useAppState()

  const boxCountToGridSize = (boxSize: number) => {
    return (imageWidth + 2) * SCALE_FACTOR * boxSize + GAP * (boxSize - 1)
  }

  const baseRecipe =
    recipeType === 'GT'
      ? (recipe as GTRecipeInterface).baseRecipe
      : (recipe as BaseRecipeInterface)

  const maxInputBoxWidth = Math.max(
    baseRecipe.dimensions.itemInputDims.width,
    baseRecipe.dimensions.fluidInputDims.width
  )
  const inputWidth = boxCountToGridSize(maxInputBoxWidth)

  const maxOutputBoxWidth = Math.max(
    baseRecipe.dimensions.itemOutputDims.width,
    baseRecipe.dimensions.fluidOutputDims.width
  )
  const outputWidth = boxCountToGridSize(maxOutputBoxWidth)

  const inputHeight =
    boxCountToGridSize(baseRecipe.dimensions.itemInputDims.height) +
    boxCountToGridSize(baseRecipe.dimensions.fluidInputDims.height) +
    GAP
  const outputHeight =
    boxCountToGridSize(baseRecipe.dimensions.itemOutputDims.height) +
    boxCountToGridSize(baseRecipe.dimensions.fluidOutputDims.height) +
    GAP
  const maxHeight = Math.max(inputHeight, outputHeight)

  let gtRecipeInfo = null
  if (recipeType === 'GT') {
    const gtRecipe = recipe as GTRecipeInterface
    const infoBuffer: string[] = []

    const totalEU = gtRecipe.amperage * gtRecipe.voltage * gtRecipe.durationTicks
    const tickInfo =
      gtRecipe.durationTicks < 20 ? ` (${gtRecipe.durationTicks} ticks)` : ''

    infoBuffer.push(`Total: ${totalEU.toLocaleString()} EU`)
    infoBuffer.push(
      `Voltage: ${gtRecipe.voltage.toLocaleString()} EU/t (${gtRecipe.voltageTier})`
    )
    infoBuffer.push(
      `Time: ${(gtRecipe.durationTicks / 20).toLocaleString()} secs${tickInfo}`
    )
    if (gtRecipe.requiresCleanroom) {
      infoBuffer.push('Needs Cleanroom')
    }
    if (gtRecipe.requiresLowGravity) {
      infoBuffer.push('Needs Low Gravity')
    }
    if (gtRecipe.additionalInfo) {
      infoBuffer.push(gtRecipe.additionalInfo)
    }

    gtRecipeInfo = (
      <p className="text-white whitespace-pre-wrap text-left mt-4 pb-4">
        {infoBuffer.join('\n')}
      </p>
    )
  }

  return (
    <div className="border border-[#f7ede2] mb-2.5">
      <div
        className="grid bg-[#001219]"
        style={{
          gridTemplateColumns: `${inputWidth}px 60px ${outputWidth}px`,
          height: `${maxHeight}px`,
        }}
      >
        <div className="flex items-center justify-center">
          <ItemAndFluidGrid
            items={baseRecipe.inputItems}
            fluids={baseRecipe.inputFluids}
            itemDims={baseRecipe.dimensions.itemInputDims}
            fluidDims={baseRecipe.dimensions.fluidInputDims}
            boxCountToGridSize={boxCountToGridSize}
          />
        </div>

        <div className="flex items-center justify-center">
          <p className="text-white text-4xl m-0">⇒</p>
        </div>

        <div className="flex items-center justify-center">
          <ItemAndFluidGrid
            items={baseRecipe.outputItems}
            fluids={baseRecipe.outputFluids}
            itemDims={baseRecipe.dimensions.itemOutputDims}
            fluidDims={baseRecipe.dimensions.fluidOutputDims}
            boxCountToGridSize={boxCountToGridSize}
          />
        </div>
      </div>
      {gtRecipeInfo}
    </div>
  )
}

interface ItemAndFluidGridProps {
  items: ItemInterface[]
  fluids: FluidInterface[]
  itemDims: BasicDimensionsInterface
  fluidDims: BasicDimensionsInterface
  boxCountToGridSize: (boxSize: number) => number
}

function ItemAndFluidGrid({
  items,
  fluids,
  itemDims,
  fluidDims,
  boxCountToGridSize,
}: ItemAndFluidGridProps) {
  const positionToItemMapping = items.reduce((map, obj) => {
    map.set(obj.position, obj)
    return map
  }, new Map<number, ItemInterface>())

  const positionToFluidMapping = fluids.reduce((map, obj) => {
    map.set(obj.position, obj)
    return map
  }, new Map<number, FluidInterface>())

  const constructGrid = (
    dimension: BasicDimensionsInterface,
    positionMapping: Map<number, ItemInterface | FluidInterface>
  ) => {
    return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${dimension.width}, 1fr)`,
          gridTemplateRows: `repeat(${dimension.height}, 1fr)`,
          gap: GAP,
          height: boxCountToGridSize(dimension.height),
          width: boxCountToGridSize(dimension.width),
        }}
      >
        {Array.from({ length: dimension.width * dimension.height }).map(
          (_, index) => {
            const indexObj = positionMapping.get(index)

            if (indexObj) {
              let clickableType = ''
              let quantity = -1

              if ('stackSize' in indexObj) {
                clickableType = 'item'
                quantity = (indexObj as ItemInterface).stackSize
              } else if ('liters' in indexObj) {
                clickableType = 'fluid'
                quantity = (indexObj as FluidInterface).liters
              }

              const tooltipLabel =
                clickableType === 'item'
                  ? (indexObj as ItemInterface).tooltip
                  : ''

              return (
                <div
                  key={index}
                  className="bg-[#343a40] flex items-center justify-center"
                >
                  <ClickableItem
                    tooltipLabel={indexObj.localizedName}
                    basic_display_info={{
                      itemId: indexObj.id,
                      localizedName: indexObj.localizedName,
                      tooltip: tooltipLabel,
                      imageFilePath: indexObj.imageFilePath,
                    }}
                    divClass="cellNoOutline"
                    scaleFactor={SCALE_FACTOR}
                    advanced_display_info={{
                      quantity: quantity,
                      clickableType: clickableType,
                    }}
                  />
                </div>
              )
            }

            return <div key={index} className="bg-[#343a40]" />
          }
        )}
      </div>
    )
  }

  const itemGrid = constructGrid(itemDims, positionToItemMapping)
  const fluidGrid = constructGrid(fluidDims, positionToFluidMapping)

  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: `${boxCountToGridSize(itemDims.height)}px ${boxCountToGridSize(fluidDims.height)}px`,
        gap: GAP,
      }}
    >
      {itemGrid}
      {fluidGrid}
    </div>
  )
}

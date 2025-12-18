export interface BasicDimensionsInterface {
  width: number
  height: number
}

export interface RecipeDimensionInterface {
  itemInputDims: BasicDimensionsInterface
  itemOutputDims: BasicDimensionsInterface
  fluidInputDims: BasicDimensionsInterface
  fluidOutputDims: BasicDimensionsInterface
}

export interface ItemInterface {
  id: string
  itemId: number
  position: number
  stackSize: number
  imageFilePath: string
  internalName: string
  itemDamage: number
  localizedName: string
  maxDamage: number
  maxStackSize: number
  modId: string
  nbt: string
  tooltip: string
  unlocalizedName: string
  input: boolean
  outputProbability: number
}

export interface FluidInterface {
  id: string
  position: number
  liters: number
  density: number
  fluidId: number
  gaseous: boolean
  imageFilePath: string
  internalName: string
  localizedName: string
  luminosity: number
  modId: string
  nbt: string
  temperature: number
  unlocalizedName: string
  viscosity: number
  input: boolean
  outputProbability: number
}

export interface BaseRecipeInterface {
  recipeId: string
  iconId: string
  recipeType: string
  dimensions: RecipeDimensionInterface
  inputItems: ItemInterface[]
  inputFluids: FluidInterface[]
  outputItems: ItemInterface[]
  outputFluids: FluidInterface[]
}

export interface GTRecipeInterface {
  recipeId: string
  baseRecipe: BaseRecipeInterface
  localizedMachineName: string
  iconInfo: string
  iconId: string
  shapeless: boolean
  additionalInfo: string
  amperage: number
  durationTicks: number
  requiresCleanroom: boolean
  requiresLowGravity: boolean
  voltage: number
  voltageTier: string
}

export interface AssociatedRecipesInterface {
  singleId: string
  GTRecipes: GTRecipeInterface[]
  OtherRecipes: BaseRecipeInterface[]
}

export interface SidebarItemInterface {
  itemId?: string
  imageFilePath?: string
  localizedName?: string
  tooltip?: string
}

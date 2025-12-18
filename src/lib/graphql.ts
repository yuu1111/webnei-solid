import { GraphQLClient } from 'graphql-request'

export const graphqlClient = new GraphQLClient('http://localhost:5000/graphql')

export const SIDEBAR_ITEMS_QUERY = `
  query SidebarItems($limit: Int!, $search: String!, $mode: String!) {
    getNSidebarItems(limit: $limit, search: $search, mode: $mode) {
      itemId
      localizedName
      tooltip
      imageFilePath
    }
  }
`

const RECIPE_FRAGMENTS = `
  fragment NEIFluidFragment on NEI_Fluid {
    density
    fluidId
    gaseous
    id
    imageFilePath
    input
    internalName
    localizedName
    liters
    luminosity
    modId
    nbt
    outputProbability
    position
    temperature
    unlocalizedName
    viscosity
  }

  fragment NEIItemFragment on NEI_Item {
    id
    localizedName
    stackSize
    imageFilePath
    input
    internalName
    itemDamage
    itemId
    maxDamage
    maxStackSize
    modId
    nbt
    outputProbability
    position
    tooltip
    unlocalizedName
  }

  fragment RecipeDimensionFragment on NEI_Recipe_Dimensions {
    height
    width
  }

  fragment NEIDimensionFragment on NEI_All_Dimensions {
    itemInputDims {
      ...RecipeDimensionFragment
    }
    itemOutputDims {
      ...RecipeDimensionFragment
    }
    fluidInputDims {
      ...RecipeDimensionFragment
    }
    fluidOutputDims {
      ...RecipeDimensionFragment
    }
  }

  fragment NEIBaseRecipeFragment on NEI_Base_Recipe {
    recipeId
    recipeType
    iconId
    dimensions {
      ...NEIDimensionFragment
    }
    inputItems {
      ...NEIItemFragment
    }
    outputItems {
      ...NEIItemFragment
    }
    inputFluids {
      ...NEIFluidFragment
    }
    outputFluids {
      ...NEIFluidFragment
    }
  }
`

const RECIPE_CORE = `
  singleId
  gtRecipes {
    localizedMachineName
    amperage
    voltage
    durationTicks
    baseRecipe {
      ...NEIBaseRecipeFragment
    }
    additionalInfo
    recipeId
    requiresCleanroom
    requiresLowGravity
    shapeless
    voltageTier
  }
  otherRecipes {
    ...NEIBaseRecipeFragment
  }
`

export const MAKE_RECIPES_QUERY = `
  query MakeItems($single_id: String!) {
    getRecipesThatMakeSingleId(itemId: $single_id) {
      ${RECIPE_CORE}
    }
  }
  ${RECIPE_FRAGMENTS}
`

export const USE_RECIPES_QUERY = `
  query UseItems($single_id: String!) {
    getRecipesThatUseSingleId(itemId: $single_id) {
      ${RECIPE_CORE}
    }
  }
  ${RECIPE_FRAGMENTS}
`

import { GraphQLClient, gql } from 'graphql-request'

export const graphqlClient = new GraphQLClient('http://localhost:5000/graphql')

export { gql }

export const SIDEBAR_ITEMS_QUERY = gql`
  query SidebarItems($limit: Int!, $search: String!, $mode: String!) {
    getNSidebarItems(limit: $limit, search: $search, mode: $mode) {
      itemId
      localizedName
      tooltip
      imageFilePath
    }
  }
`

const RECIPE_FRAGMENTS = gql`
  fragment NEIFluidFragment on NEIFluid {
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

  fragment NEIItemFragment on NEIItem {
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

  fragment RecipeDimensionFragment on NEIRecipeDimensions {
    height
    width
  }

  fragment NEIDimensionFragment on NEIAllDimensions {
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

  fragment NEIBaseRecipeFragment on NEIBaseRecipe {
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
  GTRecipes {
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
  OtherRecipes {
    ...NEIBaseRecipeFragment
  }
`

export const MAKE_RECIPES_QUERY = gql`
  query MakeItems($single_id: String!) {
    getRecipesThatMakeSingleId(itemId: $single_id) {
      ${RECIPE_CORE}
    }
  }
  ${RECIPE_FRAGMENTS}
`

export const USE_RECIPES_QUERY = gql`
  query UseItems($single_id: String!) {
    getRecipesThatUseSingleId(itemId: $single_id) {
      ${RECIPE_CORE}
    }
  }
  ${RECIPE_FRAGMENTS}
`

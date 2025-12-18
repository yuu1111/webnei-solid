import { useState, useMemo } from 'react'
import FallbackRecipeRenderer from './FallbackRecipeRenderer'
import type {
  AssociatedRecipesInterface,
  BaseRecipeInterface,
  GTRecipeInterface,
} from '~/types'

export default function MachineTabs({
  gtRecipes,
  otherRecipes,
}: AssociatedRecipesInterface) {
  const [activeTab, setActiveTab] = useState(0)

  const { iconKeys, iconToRecipes, iconToLocalizedName } = useMemo(() => {
    if (!gtRecipes || !otherRecipes) {
      return { iconKeys: [], iconToRecipes: new Map(), iconToLocalizedName: new Map() }
    }

    const allRecipes: [string, BaseRecipeInterface | GTRecipeInterface][] = []
    for (const recipe of otherRecipes) {
      allRecipes.push(['Other', recipe])
    }
    for (const recipe of gtRecipes) {
      allRecipes.push(['GT', recipe])
    }

    const iconToRecipesMap = new Map<
      string,
      [string, BaseRecipeInterface | GTRecipeInterface][]
    >()
    const iconToLocalizedNameMap = new Map<string, string>()

    for (const data of allRecipes) {
      const recipeType = data[0]
      const recipe = data[1]
      const baseRecipe =
        recipeType === 'GT'
          ? (recipe as GTRecipeInterface).baseRecipe
          : (recipe as BaseRecipeInterface)

      const iconId = baseRecipe.iconId

      if (iconToRecipesMap.has(iconId)) {
        iconToRecipesMap.get(iconId)?.push(data)
      } else {
        iconToRecipesMap.set(iconId, [data])
      }

      iconToLocalizedNameMap.set(iconId, baseRecipe.recipeType)
    }

    return {
      iconKeys: Array.from(iconToRecipesMap.keys()),
      iconToRecipes: iconToRecipesMap,
      iconToLocalizedName: iconToLocalizedNameMap,
    }
  }, [gtRecipes, otherRecipes])

  if (!gtRecipes || !otherRecipes) {
    return null
  }

  const activeRecipes = iconToRecipes.get(iconKeys[activeTab]) ?? []

  return (
    <div className="mt-2.5 mx-1.5">
      <div className="flex overflow-x-auto overflow-y-hidden border-b border-gray-600">
        {iconKeys.map((iconId, index) => (
          <button
            key={iconId}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === index
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {iconToLocalizedName.get(iconId)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeRecipes.map(
          (
            [recipeType, recipe]: [string, BaseRecipeInterface | GTRecipeInterface],
            index: number
          ) => (
            <FallbackRecipeRenderer
              key={index}
              recipeType={recipeType}
              recipe={recipe}
            />
          )
        )}
      </div>
    </div>
  )
}

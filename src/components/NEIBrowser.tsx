import { useQuery } from '@tanstack/react-query'
import { graphqlClient, MAKE_RECIPES_QUERY, USE_RECIPES_QUERY } from '~/lib/graphql'
import { useAppState } from '~/hooks/useAppState'
import MachineTabs from './MachineTabs'
import type { AssociatedRecipesInterface } from '~/types'

interface MakeQueryResponse {
  getRecipesThatMakeSingleId: AssociatedRecipesInterface
}

interface UseQueryResponse {
  getRecipesThatUseSingleId: AssociatedRecipesInterface
}

export default function NEIBrowser() {
  const { currentBasicSidebarItem, makeOrUse } = useAppState()

  const itemId = currentBasicSidebarItem?.itemId ?? ''

  const { data: makeData, isLoading: makeLoading } = useQuery({
    queryKey: ['makeRecipes', itemId],
    queryFn: async () => {
      const result = await graphqlClient.request<MakeQueryResponse>(
        MAKE_RECIPES_QUERY,
        { single_id: itemId }
      )
      return result.getRecipesThatMakeSingleId
    },
    enabled: makeOrUse === 'make' && !!itemId,
  })

  const { data: useData, isLoading: useLoading } = useQuery({
    queryKey: ['useRecipes', itemId],
    queryFn: async () => {
      const result = await graphqlClient.request<UseQueryResponse>(
        USE_RECIPES_QUERY,
        { single_id: itemId }
      )
      return result.getRecipesThatUseSingleId
    },
    enabled: makeOrUse === 'use' && !!itemId,
  })

  if (makeOrUse === 'make' && !makeLoading && makeData) {
    return <MachineTabs {...makeData} />
  }

  if (makeOrUse === 'use' && !useLoading && useData) {
    const showLoadAll =
      (useData.gtRecipes?.length === 100) ||
      (useData.otherRecipes?.length === 100)

    return (
      <>
        <MachineTabs {...useData} />
        {showLoadAll && (
          <>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded mt-4">
              Load all recipes (may take a LONG time)
            </button>
            <div className="h-24" />
          </>
        )}
      </>
    )
  }

  return null
}

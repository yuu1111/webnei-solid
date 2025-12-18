import { createStore } from 'solid-js/store'
import { SidebarItemInterface } from '~/components/Interfaces';


interface AppStateInterface {
  height: number;
  width: number;
  search: string;
  currentBasicSidebarItem: SidebarItemInterface
  makeOrUse?: string;
  gql_recipe_response: string;
  export_version: string;
  imageWidth: number;
}


const isClient = typeof window !== 'undefined';

const [appState, setAppState] = createStore<AppStateInterface>({
  height: isClient ? window.innerHeight : 800,
  width: isClient ? window.innerWidth : 1200,
  search: '',
  currentBasicSidebarItem: {},
  gql_recipe_response: '',
  export_version: '2.2.8',
  imageWidth: 40 - 2,
  makeOrUse: '',
});

export {appState, setAppState}
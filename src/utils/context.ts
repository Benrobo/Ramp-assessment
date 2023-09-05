import { createContext } from "react"

export const AppContext = createContext<AppContextProps>({
  setError: () => {},
  setIsScrollbarVisible: () => {},
})

type AppContextProps = {
  setError: (error: string) => void
  cache?: React.MutableRefObject<Map<string, string>>
  isScrollbarVisible?: boolean
  setIsScrollbarVisible: (value: boolean) => void
}

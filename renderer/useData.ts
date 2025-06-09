import { usePageContext } from "vike-react/usePageContext"

// https://vike.dev/useData
export { useData }


/** https://vike.dev/useData */
function useData<Data>() {
  const { data } = usePageContext()
  return data as Data
}

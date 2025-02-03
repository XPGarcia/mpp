import { useEffect,useState } from "react"

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener("change", handleChange)
    setMatches(mediaQueryList.matches)

    return () => {
      mediaQueryList.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

export default useMediaQuery

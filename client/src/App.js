import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import HomePage from "scenes/homePage"
import LoginPage from "scenes/loginPage"
import ProfilePage from "scenes/profilePage"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { createTheme } from "@mui/material/styles"
import { themeSettings } from "./theme"



function App() {
  const mode = useSelector((state) => state.mode) /* Grab the mode value in the state*/
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]) /* Set up the theme */

  return <div className="app">
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} /> {/* :userId = param that we can set, if you go profile/[userid] we hit this route */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </div>
}

export default App;

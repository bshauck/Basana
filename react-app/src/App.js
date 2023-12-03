import React from "react";
import SideBar from "./components/SideBar";
// eslint-disable-next-line
import Main from "./components/Main";
import Header from "./components/Header";
import { ContentLoadedProvider } from "./context/ContentLoaded";

function App() {

  return (
    <ContentLoadedProvider>
      <div className="PageGridContainer">
        <header className="HeaderContainer"><Header /></header>
        <div className="SideBarContainer"><SideBar /></div>
        {/* <main className="MainContainer"><Main /></main> */}
      </div>
    </ContentLoadedProvider>
  );
}

export default App;

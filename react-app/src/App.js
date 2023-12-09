import SideBar from "./components/SideBar";
import Main from "./components/Main";
import Header from "./components/Header";


export default function App() {


  return (
      <div className="PageGridContainer">
        <header className="HeaderContainer"><Header /></header>
        <div className="SideBarContainer"><SideBar /></div>
        <main className="MainContainer"><Main /></main>
      </div>
  );
}

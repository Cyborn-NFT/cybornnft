// import custom components
import Footer from './../components/CybornFooter';
import Header from './../components/CybornHeader';
// import SideBar from "./Sidebar";
export default function Layout({ children }) {
  // styles the main html tag
  // const styles = {
  //   display: 'flex',
  //   flexDirection: 'row',
  // };
  return (
    <>
      <Header />
      <main>
        <section>{children}</section>
      </main>
      <Footer />
    </>
  );
}

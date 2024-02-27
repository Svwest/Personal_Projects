import React from "react";
import {ItemList} from "./components/ItemList"
import Items from "./components/Items";
import Header from "./components/Header";
import Footer from "./components/Footer";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {ItemList}
  }
  render(){
  return (
    <div className="wrapper">
      <Header/>
      <Items items={this.state.ItemList}/>
      <Footer/>
    </div>
  );
}
}
export default App;

import React from "react";
import {ItemList} from "./components/ItemList"
import Items from "./components/Items";
import Header from "./components/Header";
import Footer from "./components/Footer";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {ItemList, orders:[]}
    this.addToOrders = this.addToOrders.bind(this)
  }
  render(){
  return (
    <div className="wrapper">
      <Header orders={this.state.orders}/>
      <Items items={this.state.ItemList} onAdd={this.addToOrders}/>
      <Footer/>
    </div>
  );
}
addToOrders(item){
  this.setState({orders:[...this.state.orders, item]})
}
}
export default App;

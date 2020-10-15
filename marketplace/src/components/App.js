import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
import History from './History'
import SeeProducts from './SeeProducts';
import AddProduct from './AddProduct';
import { BrowserRouter as Router,Route,Switch,Link} from "react-router-dom";
import Register from './Register';
import Dashboard from './Dashboard';
import Cart from './Cart';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  render() {
    return (
      // <div>
      //   <Router>
      //   <Navbar account={this.state.account} />
      //   <Switch>
      //       <Route path="/see" component={SeeProducts}/>
      //       {/* <Route path="/" component={History}/> */}


      //     </Switch>
      //   </Router>
      //   <div className="container-fluid mt-5">
      //     <div className="row">
      //     <main role="main" className="col-lg-12 d-flex">
      //       { this.state.loading
      //         ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
      //         // : <Main
      //         //   products={this.state.products}
      //         //   createProduct={this.createProduct}
      //         //   purchaseProduct={this.purchaseProduct} />
      //         :  
      //         <div>
      //         <History products={this.state.products}></History>
      //         <SeeProducts products={this.state.products}
      //                       purchaseProduct={this.purchaseProduct}>
      
      //         </SeeProducts>
      //          <AddProduct createProduct={this.createProduct}>
      //         </AddProduct>
      //         </div>
      //       }
      //     </main>
            
      //     </div>
      //   </div>

      // </div>
         <div className="App"> 
         
         <div class="mb-0 jumbotron text-center">
           <h1 >TransEcom</h1>      
            <p>A Transparent Medical E-Commerce platform</p>
         </div>  
         {/* <Navbar account={this.state.account} /> */}
         <Router>
             <nav className="navbar navbar-dark navbar-expand-sm  bg-dark flex-md-nowrap p-0 shadow">
               <ul className="navbar-nav px-3">
                 <li className="nav-item active">
                   <Link to="/" className="nav-link">Home</Link>
                 </li>
                 <li className="nav-item">
                   <Link to="/addProduct" className="nav-link">Add Product</Link>
                 </li>
                 <li className="nav-item">
                   <Link to="/register" className="nav-link">Register</Link>
                 </li>
                 <li className="nav-item">
                   <Link to="/dashboard" className="nav-link">Dashboard</Link>
                 </li>
                 <li className="nav-item">
                   <Link to="/mycart" className="nav-link">Cart</Link>
                 </li>
                 <li className="nav-item">
                    <Link to="/history" className="nav-link">History</Link>
                 </li>
               </ul>
               <ul class="navbar-nav ml-auto px-3">
                  <li class="nav-item">
                  <small className="text-white ml-2"><span className="ml-5" id="account">Account: {this.state.account}</span></small>
                  </li>
               </ul>
             </nav>
             <Switch>
               <Route path="/"  exact component={SeeProducts}/>
               <Route path="/addProduct" component={AddProduct}/>
               <Route path="/register" component={() => (<Register account={this.state.account} />)}/> 
               <Route path="/dashboard" component={() => (<Dashboard account={this.state.account} />)} />
               <Route path="/mycart" component={Cart}/>
               <Route path="/history" component={History}/>          
             </Switch>
         </Router> 
         </div>
    );
  }
}

export default App;
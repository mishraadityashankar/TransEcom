import React, { Component } from 'react';
import Web3 from 'web3'
import Marketplace from '../abis/Marketplace.json'
import axios from 'axios';
class Cart extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
        await this.loadDBdata()
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
          this.setState({ loading: false})
        } else {
          window.alert('Marketplace contract not deployed to detected network.')
        }
      }
      
      loadDBdata()
      {
        axios.get('/user/getCartItems/'+this.state.account)
        .then(response => {
            this.setState({products: response.data});
        })
        .catch(function (error) {
            console.log(error);
        })  
      }
    
      constructor(props) {
        super(props)
        this.state = {
          account: '',
          products: [],
          loading: true
        }
        
        this.purchaseProduct = this.purchaseProduct.bind(this)
      }
    
      purchaseProduct(id, price) {
        alert(price)
        this.setState({ loading: true })
        this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })

        axios.post('/user/removeFromCart/',{
            account: this.state.account,
            _id: id
        })
        .then(response => {
            alert("Item purchased")
            window.location.reload();

        })
        .catch(function (error) {
            console.log(error);
        }) 


      }
    render() {
        return (
            <div className="container pt-5 pb-5 pr-5 pl-5">
                       <h2 className="text-center">Cart Products</h2>
                        <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Owner</th>
                            <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody id="productList">
                            { this.state.products.map((product, key) => {
                                if(!product.purchased){
                                return(
                                    <tr key={key}>
                                    <th scope="row">{product._id.toString()}</th>
                                    <td>{product.pname}</td>
                                    <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                                    <td>{product.owner}</td>
                                    <td>
                                         <button
                                          className="btn btn-success"
                                          type="button"
                                            name={product._id}
                                            value={product.price}
                                            onClick={(event) => {
                                                this.purchaseProduct(event.target.name, event.target.value)
                                            }}
                                            >
                                            Buy
                                            </button>
                                      
                                        
                                        </td>
                                    </tr>
                                )}
                            })}
                        </tbody>
                        </table> 
            </div>
        );
    }
}
export default Cart;
import React, { Component } from 'react';
import Web3 from 'web3'
import Marketplace from '../abis/Marketplace.json'
class History extends Component {
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
            <div className="container pt-5 pb-5 pr-5 pl-5">
               <h2 className="text-center">Product History</h2>
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Owner</th>
                    </tr>
                </thead>
                <tbody id="productList">
                    { this.state.products.map((product, key) => {
                        if(product.purchased){
                        return(
                            
                            <tr key={key}>
                            <th scope="row">{product.id.toString()}</th>
                            <td>{product.name}</td>
                            <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                            <td>{product.owner}</td>
                            </tr>
                        )
                       }
                    })}
                </tbody>
                </table>
            </div>
        );
    }
}

export default History;
import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Warranty from '../abis/Warranty.json';
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
    const accounts = await web3.eth.getAccounts();
    this.setState({ retailer_id: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Warranty.networks[networkId];
    if(networkData) {
      const abi = Warranty.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      retailer_id: '',
      productName: '',
      serialNumer: '',
      conditionsLink: '',
      transfered_allowed: 0,
      imageUrl: '',
      contract: null
    }

    this.handleChangepName = this.handleChangepName.bind(this);
    this.handleChangeSnum = this.handleChangeSnum.bind(this);
    this.handleChangeconLink = this.handleChangeconLink.bind(this);
    this.handleChangeTallowed = this.handleChangeTallowed.bind(this);
    this.handleChangeIurl = this.handleChangeIurl.bind(this);
  }

  handleChangepName(event) {
    this.setState({productName: event.target.value});
  }

  handleChangeSnum(event) {
    this.setState({serialNumer: event.target.value});
  }

  handleChangeconLink(event) {
    this.setState({conditionsLink: event.target.value});
  }

  handleChangeTallowed(event) {
    this.setState({transfered_allowed: event.target.value});
  }

  handleChangeIurl(event) {
    this.setState({imageUrl: event.target.value});
  }

  add = (product,
    serial, linkCond, transfered, image) =>{
      this.state.contract.methods.addDetails(product,
        serial,
        linkCond,
        transfered,
        image).send({from: this.state.retailer_id})
        .once('receipt', (receipt) => {
          console.log("Successfull");
        })
    }



  render() {
    return (

      <div className="container pt-5 pb-5">
      <h1 className="BUY">BUY</h1>
          <button>BUY NOW</button>


          <h1 className="form-heading">Add Product</h1>
      <form id="myForm" onSubmit={(event) => {
                  event.preventDefault()
                  const product = this.state.productName;
                  const serial = this.state.serialNumer;
                  const linkCond = this.state.conditionsLink;
                  const transfered = this.state.transfered_allowed;
                  const image = this.state.imageUrl;
                  this.add(product,
                    serial, linkCond, transfered, image)
                }}>
        <div className="mb-3">
          <label htmlFor="productName">Product name</label>
          <input type="text" value={this.state.productName} onChange={this.handleChangepName} className="form-control" id="productName" />
          <p id="nameErrMsg" className="error-message"></p>
        </div>
        <div className="mb-3">
          <label htmlFor="serialNumber">Serial number</label>
          <input type="text" value={this.state.serialNumer} onChange={this.handleChangeSnum} className="form-control" id="serialNumber" />
          <p id="serialErrMsg" className="error-message"></p>
        </div>
        <div className="mb-3">
            <label htmlFor="conditions">Link to warranty conditions</label>
            <input type="url" value={this.state.conditionsLink} onChange={this.handleChangeconLink} className="form-control" id="conditions" />
        </div>
        <div className="mb-3">
            <label htmlFor="transactions_allowed">Transactions Allowed</label>
            <input type="number" value={this.state.transfered_allowed} onChange={this.handleChangeTallowed} id="transactions_allowed" name="allowed_transactions" min="1" max="10" step="1" />
        </div>
        <div className="mb-3">
            <label htmlFor="imgUrl">Image Url</label>
            <input type="url" value={this.state.imageUrl} onChange={this.handleChangeIurl} id="imgUrl" name="imgUrl" />
          </div>
        <button className="btn btn-primary" id="submitBtn">Submit</button>
      </form>
    </div>
    );
  }
}

export default App;

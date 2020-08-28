import React, { Component } from "react";
import "./App.css";

const FIVE_SEC = 5000;
const ONE_MIN = 60000;
const FIVE_MIN = 300000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      rates: {},
      increasingRates: [],
      increasing: true,
    };
  }

  componentDidMount() {
    fetch("./currencies.json")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            rates: result.rates,
          });
          this.onUpdateRates = setInterval(this.onUpdateRates, FIVE_SEC);
          this.toggleIncreasing = setInterval(this.toggleIncreasing, ONE_MIN);
          setTimeout(() => {
            clearInterval(this.onUpdateRates);
            clearInterval(this.toggleIncreasing);
          }, FIVE_MIN);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  toggleIncreasing = () => {
    if (this.state.increasing) {
      this.setState({
        increasing: false,
      });
    } else {
      this.setState({
        increasing: true,
      });
    }
  };

  onUpdateRates = () => {
    const rates = this.state;
    let ratesArr = Object.keys(rates).map((i) => rates[i])[2];
    let incrRateBG = [];
    const reatesStep = 0.0001 / 12;

    for (var key in ratesArr) {
      if (this.state.increasing) {
        let increasedRate = ratesArr[key] + reatesStep;

        if (ratesArr[key].toFixed(4) < increasedRate.toFixed(4)) {
          incrRateBG[key] = true;
          this.setState({
            increasingRates: incrRateBG,
          });
        }
        ratesArr[key] = increasedRate;
        this.setState({
          rates: ratesArr,
        });
      } else {
        let decreasedRate = ratesArr[key] - reatesStep;

        if (ratesArr[key].toFixed(4) > decreasedRate.toFixed(4)) {
          incrRateBG[key] = false;
          this.setState({
            increasingRates: incrRateBG,
          });
        }
        ratesArr[key] = decreasedRate;
        this.setState({
          rates: ratesArr,
        });
      }
    }
  };

  createTable = () => {
    const rates = this.state;
    let ratesArr = Object.keys(rates).map((i) => rates[i])[2];
    let table = [];
    let children = [];
    let reatesClass;

    for (let key in ratesArr) {
      if (this.state.increasingRates[key] === true) {
        reatesClass = "increased-rates";
      } else if (this.state.increasingRates[key] === false) {
        reatesClass = "decreased-rates";
      } else {
        reatesClass = "default-rates";
      }
      if (ratesArr.hasOwnProperty(key)) {
        children.push(
          <tr>
            <td>
              <img className="flag" src="./images/eur.svg" alt={key} />
              <img className="flag" src={`./images/${key}.svg`} alt={key} />
            </td>
            <td>EUR{key}</td>
            <td className="currencyRates">
              <span className={reatesClass}>{ratesArr[key].toFixed(4)}</span>
            </td>
          </tr>
        );
      }
    }
    table.push(<tbody>{children}</tbody>);

    return table;
  };

  render() {
    const { error, isLoaded } = this.state;

    if (error) {
      return <div>{error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <main>
          <div className="App-body">
            <table className="currencyTable">{this.createTable()}</table>
          </div>
        </main>
      );
    }
  }
}

export default App;

import React, { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import Web3 from "web3";
import "./css/style.scss";
import "./App.css";
import { useHistory, useParams } from "react-router-dom";

import AOS from "aos";
import { focusHandling } from "cruip-js-toolkit";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import OfferRide from "./pages/OfferRide";
import RideDetail from "./pages/RideDetail";
import MyRides from "./pages/MyRides";
import MyDriver from "./pages/MyDriver";
import Profile from "./pages/Profile";

let accounts;
let web3;
function App() {
  const location = useLocation();
  let history = useHistory();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });
  async function metamaskConnection() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    await window.ethereum.enable();
  }
  window.ethereum.on("accountsChanged", async function (accounts) {
    // document.location.reload();
    let acc = await web3.eth.getAccounts();
    if (
      localStorage.getItem("walletAddress") &&
      localStorage.getItem("walletAddress") !== acc
    ) {
      localStorage.clear();
      history.push("/");
    }
  });

  useEffect(() => {
    metamaskConnection();

    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
    focusHandling("outline");
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/search" exact component={Search} />
        <Route path="/offerride" exact component={OfferRide} />
        <Route path="/ridedetail/:id" exact component={RideDetail} />
        <Route path="/myrides" exact component={MyRides} />
        <Route path="/mydriver" exact component={MyDriver} />
        <Route path="/profile" component={Profile} />

        {!localStorage.getItem("walletAddress") ? (
          <>
            <Redirect from="*" exact to="/signin" />
          </>
        ) : (
          <>
            <Redirect from="*" to="/search" />
          </>
        )}
      </Switch>
    </>
  );
}

export default App;

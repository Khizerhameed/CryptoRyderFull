import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import config from "../../config";

const auth = require("../../contracts/Authentication.json");
let web3;
let authentication;
let accounts;
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

function MainSignIn() {
  const history = useHistory();
  const classes = useStyles();
  const [notAccount, setNotAccount] = useState(false);
  const [walletAccount, setWalletAccount] = useState("");
  const [username, setUsername] = useState("");
  const [signupDiv, setSignupDiv] = useState(false);
  async function metamaskConnection() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    await window.ethereum.enable();
    setWalletAccount(accounts[0]);

    console.log(walletAccount);
  }
  useEffect(() => {
    metamaskConnection();
  }, []);
  window.ethereum.on("accountsChanged", async function (accounts) {
    // document.location.reload();
    accounts = await web3.eth.getAccounts();
    setWalletAccount(accounts[0]);
    window.location.reload();
  });

  async function ConnectWallet() {
    accounts = await web3.eth.getAccounts();
    setWalletAccount(accounts[0]);
    authentication = new web3.eth.Contract(auth.abi, config.Authentication);

    try {
      let result = await authentication.methods
        .login()
        .call({ from: accounts[0] });
      let name = await authentication.methods.bytes32ToString(result).call();
      console.log("userLogined");
      localStorage.setItem("username", name);
      localStorage.setItem("walletAddress", accounts);
      history.push({
        pathname: "/",
        // state: { walletAccount },
      });
    } catch (error) {
      console.log(error);
      setNotAccount(true);
    }
  }
  async function handleSignUp() {
    // localStorage.setItem("username", username);
    // localStorage.setItem("walletAddress", walletAccount);

    try {
      let bytes32 = await authentication.methods
        .stringToBytes32(username)
        .call();
      try {
        let result = await authentication.methods
          .signup(bytes32)
          .send({ from: accounts[0] });
        localStorage.setItem("username", username);
        localStorage.setItem("walletAddress", accounts);
        history.push({
          pathname: "/",
          // state: { walletAccount },
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function myFunction() {
    setSignupDiv(true);
    var x = document.getElementById("oops");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  function validateForm() {
    return username.length > 0;
  }
  return (
    <>
      <div>
        <div className="max-w-6xl  text-center mb-32 mt-32 mx-auto px-4 sm:px-6">
          {/* Top area: Blocks */}
          {!notAccount ? (
            <div>
              <div className=" gridsm:grid-cols-12">
                <span className=" text-5xl font-medium" data-aos="zoom-y-out">
                  Welcome!
                </span>
              </div>
              <div className="max-w-xs mx-auto ">
                <span
                  className=" lg: text-5xl mb-8 leading-normal font-medium "
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                  Let's begin with your wallet.
                </span>
                <div
                  className="max-w-xs mt-4 mx-auto sm:max-w-none sm:flex sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <button
                    className="btn btn-primary text-center"
                    onClick={ConnectWallet}
                    style={{
                      fontSize: "12px",
                      padding: 22,
                      width: 300,
                      backgroundColor: "black",
                      borderColor: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    SELECT A WALLET
                  </button>
                </div>
                <div className="max-w-xs mt-4 mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <a
                    className="text-sm"
                    href="#"
                    style={{
                      textDecoration: "none",
                      borderBottom: "solid 0.5px",
                      color: "black",
                    }}
                  >
                    First time setting up a wallet?
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="oops" id="oops">
              <div className="max-w-xs mx-auto ">
                <div className="pb-8">
                  <span
                    className=" lg: text-2xl mb-8 leading-normal font-medium "
                    data-aos="zoom-y-out"
                    data-aos-delay="150"
                  >
                    Oops! It looks like there's no account linked to that
                    address.
                  </span>
                </div>
                <div className="box-content  text-left bg-gray-200 h-42 w-42 p-2 py-3">
                  <p className="text-xxs font-semibold mt-2 ml-2">ADDRESS</p>
                  <p className="text-xxs font-semibold mt-2 ml-2">
                    {walletAccount}
                  </p>
                  <div
                    className="max-w-xs mt-4 mx-auto sm:max-w-none sm:flex sm:justify-center"
                    data-aos="zoom-y-out"
                    data-aos-delay="300"
                  >
                    <button
                      className="btn btn-primary text-center"
                      style={{
                        fontSize: "12px",
                        padding: 20,
                        width: 300,
                        backgroundColor: "black",
                        borderColor: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      SWITCH ADDRESS
                    </button>
                  </div>{" "}
                </div>

                <div className="max-w-xs mt-4 mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <a
                    href="#"
                    className="text-xs"
                    style={{
                      textDecoration: "none",
                      borderBottom: "solid 0.5px",
                      color: "black",
                    }}
                    onClick={myFunction}
                  >
                    Would you like to sign up instead?
                  </a>
                </div>
              </div>
            </div>
          )}
          {/*SignUp DIV */}
          {signupDiv ? (
            <div>
              <div className="max-w-xs mx-auto ">
                <span
                  className=" lg: text-5xl font-Lobster mb-8 leading-normal  "
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                  Create a CarVi Account
                </span>
                <div className="box-content rounded-lg text-left bg-gray-200 h-42 w-42 p-2 ">
                  <p className="text-xxs font-semibold mt-2 ml-2">ADDRESS</p>
                  <p className="text-xxs font-semibold mt-2 ml-2">
                    {walletAccount}
                  </p>
                </div>
                <div className="mt-4">
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      id="standard-basic"
                      label="Username *"
                      onChange={(e) => setUsername(e.target.value)}
                      style={{ width: 300 }}
                    />
                  </form>
                </div>
                <div
                  className="max-w-xs mt-5 mx-auto sm:max-w-none sm:flex sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <button
                    className="btn btn-primary text-center"
                    onClick={handleSignUp}
                    style={{
                      fontSize: "12px",
                      padding: 20,
                      width: 300,
                      backgroundColor: "black",
                      borderColor: "black",
                      fontWeight: "bold",
                    }}
                    disabled={!validateForm()}
                  >
                    {" "}
                    SIGN UP
                  </button>
                </div>{" "}
                <div className="max-w-xs mt-4 mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <span className="text-xs">
                    By clicking sign up you indicate that you have read and
                    agree to our{" "}
                    <a
                      href="#"
                      style={{
                        textDecoration: "underline",
                        color: "black",
                      }}
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      style={{
                        textDecoration: "underline",

                        color: "black",
                      }}
                    >
                      Privacy Policy
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
export default MainSignIn;

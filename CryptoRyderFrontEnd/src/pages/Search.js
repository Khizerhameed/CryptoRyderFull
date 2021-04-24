import React, { useEffect, useState } from "react";
import CardSocialTraffic from "../components/CardSocialTraffic";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import * as Icons from "phosphor-react";
import Web3 from "web3";
import ReactStars from "react-rating-stars-component";
import config from "../config";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import "../css/form.css";

let web3;
let accounts;
let authentication;
let rideShare;
let rideShareJson = require("../contracts/Rideshare.json");
const auth = require("../contracts/Authentication.json");

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "30ch",
    },
  },
}));

function Search() {
  const classes = useStyles();

  const [Rides, setRides] = useState([]);
  const [Driver, setDriver] = useState([]);
  const [LoaderSpin, setLoader] = useState(true);
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
  });
  //submitSearch
  const submitSearch = async (event) => {
    event.preventDefault();
    setLoader(true);

    try {
      let rideCount = await rideShare.methods.getRideCount().call();
      console.log(rideCount);
      let promiseArr = [];
      let promiseArr2 = [];
      let driverName = [];
      let rideId = [];
      let driverRating = [];
      let j = 0;

      try {
        for (let i = 0; i < rideCount; i++) {
          let res = await rideShare.methods.rides(i).call();
          // console.log(res.originAddress);
          // console.log(res.destAddress);
          console.log(res);
          if (
            res.originAddress === searchForm.origin &&
            res.destAddress === searchForm.destination
          ) {
            promiseArr.push(res);
            let d = promiseArr[j].driver;
            promiseArr2.push(await authentication.methods.users(d).call());

            let name = promiseArr2[j].name;

            driverRating.push(promiseArr2[j].driverRating);

            driverName.push(
              await authentication.methods.bytes32ToString(name).call()
            );
            rideId.push(i);
            j++;
          }
        }
        Promise.all(promiseArr).then((response) => {
          Promise.all(promiseArr2).then(async (res) => {
            let driver = res.map((item, index) => {
              return {
                item: item,
                name: driverName[index],
                driverRating: driverRating[index],
              };
            });
            setDriver(driver);
            let data = response.map((item, index) => {
              let dep = convertDateTime(item.departureTime);

              let arr = convertDateTime(item.arrivaltime);

              return {
                item: item,
                rideId: rideId[index],

                departureTime: dep,
                arrivalTime: arr,
              };
            });
            setRides(data);
            setLoader(false);
          });
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //onCHange
  const onChangeInput = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };
  //convertDateTime
  function convertDateTime(time) {
    let covertedArrivalHours, convertedArrivalMinutes;

    var dA = parseInt(time);
    var dAA = new Date(dA);

    if (dAA.getHours() >= 0 && dAA.getHours() < 10) {
      covertedArrivalHours = "0" + dAA.getHours();
    } else {
      covertedArrivalHours = dAA.getHours();
    }
    if (dAA.getMinutes() >= 0 && dAA.getMinutes() < 10) {
      convertedArrivalMinutes = "0" + dAA.getMinutes();
    } else {
      convertedArrivalMinutes = dAA.getMinutes();
    }
    let arrivalTime = covertedArrivalHours + ":" + convertedArrivalMinutes;
    return arrivalTime;
  }
  //metamask and startup loader
  async function metamaskConnection() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    await window.ethereum.enable();
    authentication = new web3.eth.Contract(auth.abi, config.Authentication);
    rideShare = new web3.eth.Contract(rideShareJson.abi, config.RideShare);

    try {
      let rideCount = await rideShare.methods.getRideCount().call();
      let promiseArr = [];
      let promiseArr2 = [];
      let driverName = [];
      let rideId = [];
      let driverRating = [];

      try {
        for (let i = 0; i < rideCount; i++) {
          let res = await rideShare.methods.rides(i).call();

          promiseArr.push(res);
          let d = promiseArr[i].driver;

          promiseArr2.push(
            await authentication.methods.users(d).call({ from: accounts[0] })
          );

          let name = promiseArr2[i].name;
          driverRating.push(promiseArr2[i].driverRating);
          console.log(promiseArr2[i].driverRating);

          driverName.push(
            await authentication.methods.bytes32ToString(name).call()
          );
          rideId.push(i);
        }
        Promise.all(promiseArr).then((response) => {
          Promise.all(promiseArr2).then(async (res) => {
            let driver = res.map((item, index) => {
              return {
                item: item,
                name: driverName[index],
                driverRating: driverRating[index],
              };
            });
            setDriver(driver);
            let data = response.map((item, index) => {
              let dep = convertDateTime(item.departureTime);

              let arr = convertDateTime(item.arrivaltime);

              return {
                item: item,
                rideId: rideId[index],

                departureTime: dep,
                arrivalTime: arr,
              };
            });
            setRides(data);
            setLoader(false);
          });
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    metamaskConnection();
  }, []);

  return (
    <>
      <div>
        <Header />
        <div className="relative">
          {/* Header */}
          <div
            className="relative  md:pt-32 pb-8 "
            style={{
              paddingTop: 200,
              backgroundImage:
                "url(https://cdn.blablacar.com/kairos/assets/build/images/carpool_only_large-1fb250954893109fa160f6fb41c3ef3d.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          >
            <div className="px-4 text-center md:px-10 mx-auto w-full mb-12 ">
              <div>
                <h1 className="font-Lobster text-white sm:text-6xl">
                  Where to Go?
                </h1>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-10 mx-auto w-full -m-24">
            <div className="flex  flex-wrap mt-12">
              <div className="w-full xl:w-12/12 px-4">
                {/* <CardSocialTraffic /> */}
                <div className="relative flex pb-5 flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                  <div className="block w-full text-center">
                    {/* Projects table */}
                    <form className={classes.root} autoComplete="on">
                      <div className="mt-5 ">
                        <TextField
                          onChange={(e) => onChangeInput(e)}
                          className="mx-5"
                          name="origin"
                          required
                          id="standard-required"
                          label="Origin"
                        />
                        <TextField
                          onChange={(e) => onChangeInput(e)}
                          className="mx-5"
                          name="destination"
                          required
                          id="standard-required"
                          label="Destination"
                        />

                        {/* <TextField
                          id="date"
                          label="Date"
                          type="date"
                          defaultValue="today"
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        /> */}
                      </div>
                      <div className="text-center mt-5">
                        <button
                          onClick={submitSearch}
                          className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                        >
                          SEARCH
                        </button>{" "}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="relative mt-40 ">
          {/* Section background (needs .relative class on parent and next sibling elements) */}

          <div className="absolute left-0 right-0 bottom-0 m-auto transform translate-y-1/2"></div>

          {!LoaderSpin ? (
            <>
              <div className="relative max-w-6xl mx-auto  sm:px-6">
                <div className="py-2 md:py-20">
                  {/* Items */}

                  <div className="  mx-3 grid gap-12 md:grid-cols-1 lg:grid-cols-2  md:max-w-2xl lg:max-w-none">
                    {/* 1st item */}

                    {Rides.map((d, key) => {
                      return (
                        <Link to={`/ridedetail/${d.rideId}`}>
                          <button
                            style={{ backgroundColor: "blue", color: "white" }}
                            className="btn btn-item  relative flex flex-col py-5    rounded shadow-2xl "
                          >
                            {/* First Line */}
                            <div className=" grid gap-6 grid-cols-12 border-b border-black">
                              <div className="col-span-2 mb-3 font-bold">
                                <p>{d.departureTime}</p>
                                <p>{d.arrivalTime}</p>
                              </div>
                              <div className="col-span-2 mt-2">
                                <Icons.Path size={68} className="-mt-2" />
                              </div>
                              <div className="col-span-3 text-left font-bold">
                                <p>{d.item.originAddress}</p>
                                <p>{d.item.destAddress}</p>
                              </div>
                              <div className="col-span-4 mt-3 text-right ">
                                <span className="text-base font-extrabold">
                                  {d.item.drivingCost} WEI
                                </span>
                              </div>
                            </div>
                            {/* Second Line */}
                            <div className=" mt-3 grid gap-6  grid-cols-12 border-b border-black">
                              <div className="col-span-2 mt-2 mb-4">
                                <Icons.UserCircle size={48} />
                              </div>
                              <div className="col-span-3 text-left -ml-5 mt-2">
                                <span className="text-sm uppercase font-extrabold text-black-1000">
                                  {Driver[key].name}
                                </span>
                                <ReactStars
                                  count={5}
                                  size={20}
                                  edit={false}
                                  activeColor="#ffd700"
                                  value={Driver[key].driverRating}
                                />
                              </div>
                              <div className="col-span-6 mt-3 text-right ">
                                <span className="text-base font-extrabold">
                                  {/* {d.rideId} Places Left */}
                                </span>
                              </div>
                            </div>
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="container text-center">
              <Loader type="Circles" color="blue" height={100} width={100} />
            </div>
          )}
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Search;

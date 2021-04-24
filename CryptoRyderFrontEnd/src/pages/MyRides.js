import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import * as Icons from "phosphor-react";

import Web3 from "web3";
import ReactStars from "react-rating-stars-component";
import config from "../config";
import { Link } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "../css/form.css";
import { number } from "prop-types";
let rideId;
let web3;
let accounts;
let authentication;
let rideShare;
let expectedPayment;
let rideShareJson = require("../contracts/Rideshare.json");
const auth = require("../contracts/Authentication.json");

function MyRides() {
  let history = useHistory();
  const [driverRating, setDriverRating] = useState(0);
  const [rating, setRating] = useState("");
  const [DateHeader, setDateHeader] = useState("");
  const [noRide, setNoRide] = useState(false);
  const [RideData, setRideData] = useState("");
  const [itemData, setItemData] = useState("");
  const [passengerStatus, setPassengerStatus] = useState({
    initital: false,
    driverMet: false,
    completed: false,
    enRoute: false,
  });
  const [driverData, setDriverData] = useState("");
  const [LoaderSpin, setLoader] = useState(true);
  function RatingSetter(e) {
    let val = e;
    if (val === 5) {
      val = val - 1;
    }
    setRating(val);
  }
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
  async function metamaskConnection() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    await window.ethereum.enable();
    authentication = new web3.eth.Contract(auth.abi, config.Authentication);
    rideShare = new web3.eth.Contract(rideShareJson.abi, config.RideShare);
    rideId = await rideShare.methods
      .getRiderData()
      .call({ from: localStorage.getItem("walletAddress") });
    if (rideId > 0) {
      rideId = rideId - 1;

      let status = await rideShare.methods
        .getPassengerRideState(rideId, localStorage.getItem("walletAddress"))
        .call();
      if (status === "initial") {
        setPassengerStatus({ initital: true });
      } else if (status === "driverConfirmed") {
        setPassengerStatus({ driverMet: true });
      } else if (status === "completion") {
        setPassengerStatus({ completed: true });
      } else if (status === "enRoute") {
        setPassengerStatus({ enRoute: true });
      }
      try {
        let promiseArr;
        let promiseArr2;
        let driverName;
        let driverRating;
        try {
          promiseArr = await rideShare.methods.rides(rideId).call();

          let d = promiseArr.driver;
          expectedPayment = parseInt(promiseArr.drivingCost);

          promiseArr2 = await authentication.methods.users(d).call();

          let name = promiseArr2.name;
          driverRating = promiseArr2.driverRating;

          driverName = await authentication.methods
            .bytes32ToString(name)
            .call();

          Promise.all([promiseArr, promiseArr2, driverName, driverRating]).then(
            (res) => {
              let dep = convertDateTime(promiseArr.departureTime);
              let depD = new Date(parseInt(res[0].departureTime)).toString();
              let depDate = depD.split(" ");
              let display = depDate[0] + ", " + depDate[1] + " " + depDate[2];
              setDateHeader(display);

              let arr = convertDateTime(promiseArr.arrivaltime);

              let data = [];

              data.departureTime = dep;
              data.arrivalTime = arr;
              data.driverName = driverName;
              setDriverRating(driverRating);
              setItemData(res[0]);
              setDriverData(res[1]);
              setRideData(data);
              setLoader(false);
            }
          );
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setNoRide(true);
    }
  }
  async function CancelRide() {
    try {
      let res = await rideShare.methods
        .cancelRide(rideId)
        .send({ from: accounts[0] });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function driverMet() {
    let res = await rideShare.methods
      .confirmDriverMet(rideId)
      .send({ from: accounts[0] });
    console.log(res);
    window.location.reload();
  }
  async function Arrived() {
    let res = await rideShare.methods
      .arrived(rideId, rating)
      .send({ from: accounts[0] });
    window.location.reload();
  }
  useEffect(() => {
    metamaskConnection();
  }, []);
  return (
    <>
      {LoaderSpin ? (
        <div className="container text-center">
          <Loader type="Circles" color="blue" height={100} width={100} />
        </div>
      ) : (
        <>
          {!noRide ? (
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
                          Book a Ride?
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="relative mt-40 ">
                  {/* Section background (needs .relative class on parent and next sibling elements) */}

                  <div className="absolute left-0 right-0 bottom-0 m-auto transform translate-y-1/2"></div>
                  <h1>{noRide}</h1>
                  <div className="relative max-w-2xl mx-auto  sm:px-6">
                    <div className="py-2 md:py-20">
                      {/* Items */}
                      <div className="  mx-3 grid gap-6 md:grid-cols-1 lg:grid-cols-1  md:max-w-2xl lg:max-w-none">
                        {/* 1st item */}
                        <div
                          style={{ backgroundColor: "blue", color: "white" }}
                          className=" p-5 relative flex flex-col py-5 rounded shadow-2xl "
                        >
                          {/* First Line */}
                          <div className="text-center mb-5 text-3xl font-bold font-Lobster">
                            <span>{DateHeader}</span>
                          </div>
                          <div className="  grid gap-6 grid-cols-12 border-b border-black">
                            <div className="col-span-2 mb-3 font-bold">
                              <p>{RideData.departureTime}</p>
                              <p>{RideData.arrivalTime}</p>
                            </div>
                            <div className="col-span-2 mt-2">
                              <Icons.Path size={68} className="-mt-2" />
                            </div>
                            <div className="col-span-3 font-bold">
                              <p>{itemData.originAddress}</p>
                              <p>{itemData.destAddress}</p>
                            </div>
                            <div className="col-span-4 mt-3 text-right ">
                              <span className="text-base font-extrabold">
                                {itemData.drivingCost} WEI
                              </span>
                            </div>
                          </div>

                          {/* Second Line */}
                          <div className=" mt-3 grid gap-6  grid-cols-12 border-b border-black">
                            <div className="col-span-10 ml-3 text-left mt-3 ">
                              <span className="text-sm uppercase font-extrabold text-black-1000">
                                {RideData.driverName}
                              </span>
                              <ReactStars
                                count={5}
                                size={20}
                                edit={false}
                                activeColor="#ffd700"
                                value={driverRating}
                              />
                            </div>

                            <div className="col-span-2 -ml-5 mt-2 mb-4">
                              <Icons.UserCircle size={48} />
                            </div>
                          </div>

                          {/* Third Line */}
                          <div className=" mt-3 grid gap-6  grid-cols-12 border-b border-black">
                            <div className="col-span-10 ml-3 text-left mt-3 ">
                              <span className="text-base uppercase font-extrabold text-black-1000">
                                {itemData.carName}
                              </span>
                              <p>White</p>
                            </div>

                            <div className="col-span-2 -ml-5 mt-2 mb-4">
                              <Icons.Car size={48} />
                            </div>
                          </div>
                          {passengerStatus.initital ? (
                            <>
                              <div
                                className="text-right
                   mt-20"
                              >
                                <button
                                  onClick={CancelRide}
                                  className="btn btn-danger mr-4"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={driverMet}
                                  className="btn btn-primary px-5 p-2"
                                >
                                  Confirm Driver Met
                                </button>
                              </div>
                            </>
                          ) : null}
                          {passengerStatus.driverMet ? (
                            <>
                              <div
                                className="text-right
                   mt-20"
                              >
                                <h5 style={{ color: "red" }}>
                                  Waiting for Driver Response!
                                </h5>
                              </div>
                            </>
                          ) : null}
                          {/*div*/}
                          {passengerStatus.enRoute ? (
                            <>
                              <div className="mt-20">
                                <ReactStars
                                  onChange={RatingSetter}
                                  count={5}
                                  size={20}
                                  activeColor="#ffd700"
                                />
                              </div>
                              <div>
                                <button
                                  onClick={Arrived}
                                  className="btn btn-success px-5 p-2"
                                >
                                  Arrived
                                </button>
                              </div>
                            </>
                          ) : null}

                          {passengerStatus.completed ? (
                            <>
                              <div
                                className="text-right
                   mt-20"
                              >
                                <h5 style={{ color: "red" }}>Ride Completed</h5>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Footer />
              </div>
            </>
          ) : (
            <h1>No Ride Found!!</h1>
          )}
        </>
      )}{" "}
    </>
  );
}

export default MyRides;

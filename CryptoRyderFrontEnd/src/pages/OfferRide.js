import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Web3 from "web3";
import "../css/form.css";
import config from "../config";
import Swal from "sweetalert2";
let web3;
let accounts;
let rideShare;
let rideShareJson = require("../contracts/Rideshare.json");
function OfferRide() {
  const [rideForm, setRideForm] = useState({
    carName: "",
    capacity: "",
    origin: "",
    destination: "",
    departureDate: Date,
    departureTime: "",
    confirmedBy: "",
    arrivalDate: Date,
    arrivalTime: "",
    expectedPayment: "",
  });
  const onChangeInput = (e) => {
    setRideForm({ ...rideForm, [e.target.name]: e.target.value });
  };

  async function SubmitForm() {
    var ArrivalTime = rideForm.arrivalTime.split(":");
    var DepartureTime = rideForm.departureTime.split(":");
    let ArrivalHours = ArrivalTime[0];
    let ArrivalMinutes = ArrivalTime[1];
    let DepartureHours = DepartureTime[0];
    let DepartureMinutes = DepartureTime[1];

    var ArrivalDate = new Date(rideForm.arrivalDate);
    var DepartureDate = new Date(rideForm.departureDate);

    ArrivalDate.setHours(ArrivalHours);
    ArrivalDate.setMinutes(ArrivalMinutes);
    DepartureDate.setHours(DepartureHours);
    DepartureDate.setMinutes(DepartureMinutes);

    const ArrivalTimeStamp = ArrivalDate.getTime();
    const DepartureTimeStamp = DepartureDate.getTime();
    let d = new Date();
    let hours = d.getHours() + 3;
    d.setHours(hours);
    const unpaidTimeStamp = d.getTime();
    try {
      let res = await rideShare.methods
        .createRide(
          rideForm.carName,
          rideForm.expectedPayment,
          rideForm.capacity,
          rideForm.origin,
          rideForm.destination,
          rideForm.confirmedBy,
          0,
          DepartureTimeStamp,
          ArrivalTimeStamp
        )
        .send({ from: accounts[0] });
      console.log(res);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "RideShare Created Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }
  async function metamaskConnection() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();

    await window.ethereum.enable();
    rideShare = new web3.eth.Contract(rideShareJson.abi, config.RideShare);
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
                  Offer Ride?
                </h1>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-10 mx-auto w-full -m-24">
            <div className="min-w-screen mt-32 min-h-screen flex items-center justify-center  py-5">
              <div
                className=" text-gray-500 rounded-3xl  w-full overflow-hidden"
                style={{ maxWidth: "1000px" }}
              >
                <div className="md:flex w-full">
                  <div className="hidden md:block w-1/2  py-10 mt-32">
                    <img src="https://cdn.blablacar.com/kairos/assets/build/images/indicate-your-route-fef6b1a4c9dac38c77c092858d73add3.svg" />
                  </div>
                  <div className="w-full shadow-2xl md:w-1/2 py-10 px-5 md:px-10">
                    <div className="text-center mb-10">
                      <h1 className="font-bold font-Lobster text-3xl text-gray-900">
                        Create RideShare
                      </h1>
                      <p>Enter your information to create</p>
                    </div>
                    <div>
                      <div className="flex -mx-3">
                        <div className="w-1/2 px-3 mb-5">
                          <label for="" className="text-xs font-semibold px-1">
                            Car Name
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              type="text"
                              name="carName"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Toyota"
                            />
                          </div>
                        </div>
                        <div className="w-1/2 px-3 mb-5">
                          <label for="" className="text-xs font-semibold px-1">
                            Capacity
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              name="capacity"
                              type="number"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              defaultValue={0}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex -mx-3">
                        <div className="w-1/2 px-3 mb-5">
                          <label for="" className="text-xs font-semibold px-1">
                            Origin
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                              <i className="fas fa-map-marker-alt text-gray-400 text-lg"></i>
                            </div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              type="text"
                              name="origin"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Origin"
                            />
                          </div>
                        </div>
                        <div className="w-1/2 px-3 mb-5">
                          <label for="" className="text-xs font-semibold px-1">
                            Destination
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                              <i className="fas fa-map-marker-alt text-gray-400 text-lg"></i>
                            </div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              type="text"
                              name="destination"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Destination"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex -mx-3">
                        <div className="w-1/2 ">
                          <label for="" className="text-xs font-semibold px-1">
                            Departure Date
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              type="date"
                              name="departureDate"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Origin"
                            />
                          </div>
                        </div>
                        <div className="w-1/2 px-3 ">
                          <label for="" className="text-xs font-semibold px-1">
                            Departure Time
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              type="time"
                              name="departureTime"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Origin"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex -mx-3 mt-5">
                        <div className="w-1/2 ">
                          <label for="" className="text-xs font-semibold px-1">
                            Arrival Date
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              name="arrivalDate"
                              type="date"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Origin"
                            />
                          </div>
                        </div>
                        <div className="w-1/2 px-3 ">
                          <label for="" className="text-xs font-semibold px-1">
                            Arrival Time
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              name="arrivalTime"
                              type="time"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Origin"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex -mx-3 mt-5">
                        <div className="w-full px-3 mb-12">
                          <label for="" className="text-xs font-semibold px-1">
                            Confirmed By
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              name="confirmedBy"
                              type="input"
                              className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              placeholder="Confirmed At"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex -mx-3">
                        <div className="w-full px-3 mb-5">
                          <label for="" className="text-xs font-semibold px-1">
                            Expected Payment
                          </label>
                          <div className="flex">
                            <div className="w-10 z-10 pl-5 text-center pointer-events-none flex items-center justify-center">
                              <i>wei</i>
                            </div>
                            <input
                              onChange={(e) => onChangeInput(e)}
                              name="expectedPayment"
                              type="number"
                              className="w-full -ml-10 pl-20 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                              defaultValue="0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex -mx-3">
                        <div className="w-full px-3 mb-5">
                          <button
                            onClick={SubmitForm}
                            className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                          >
                            CREATE NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*check*/}

        <Footer />
      </div>
    </>
  );
}

export default OfferRide;

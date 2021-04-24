import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black-100">
      <div className="max-w-10xl mt-32 mx-auto px-4 sm:px-6 ">
        {/* Top area: Blocks */}
        <div className=" text-white mb-10" >
          <div className="text-center pt-5">
            <span className="text-2xl tracking-wider ">
              Subscribe to our newsletter
            </span>
          </div>
          <div className="text-center pt-4 pb-5 ">
            <input
              name="field_name"
              style={{ width: 350, color: "black" }}
              className="text-sm rounded px-3 py-2 mb-2"
              type="text"
              placeholder="Email address"
            />
            <a
              className="btn btn-primary "
              style={{
                fontSize: 13,
                fontWeight: "bold",
                width: 150,
                padding: 9,
                backgroundColor: "black",
                borderStyle: "outset",
                borderColor: "rgb(118, 118, 118)",
                borderImage: "initial",
              }}
            >
              SUBSCRIBE{" "}
            </a>
          </div>
        </div>
        <div className=" grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200">
          {/* 1st block */}
          <div className="mt-5 pl-5 sm:col-span-12 lg:col-span-3 ">
            <div className="mb-2 ">
              {/* Logo */}
              <Link to="/" className="inline-block" aria-label="Cruip">
                <h3 className="font-Lobster text-4xl">CarVi</h3>
              </Link>
            </div>
            <div className="text-sm text-white">
              <Link
                to="#"
                className="text-white hover:text-white hover:underline transition duration-150 ease-in-out"
              >
                Terms
              </Link>{" "}
              ·{" "}
              <Link
                to="#"
                className="text-white hover:text-white hover:underline transition duration-150 ease-in-out"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* 2nd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
            <h6 className="text-white font-medium mb-2">COMMUNITY</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Editorial
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Discord{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Instagram{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Twitter{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Blog{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Help Center{" "}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3rd block */}

          {/* 4th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
            <h6 className="text-white font-medium mb-2">LEGAL</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Community Guidelines
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Terms of Service{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Privacy Policy{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-white hover:text-white transition duration-150 ease-in-out"
                >
                  Report Content
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

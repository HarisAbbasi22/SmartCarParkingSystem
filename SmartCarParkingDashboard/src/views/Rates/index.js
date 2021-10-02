import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CInput,
  CDropdown,
  CRow,
  CWidgetDropdown,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
const axios = require("axios");

/**
 * @author
 * @function Rates
 **/
const Rates = (props) => {
  const [perHour, setPerHour] = useState(null);
  const [newPerHour, setNewPerHour] = useState();

  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getRatePerHour();
    handleGetPackages();
  }, []);

  async function getRatePerHour() {
    db.collection("Rates")
      .doc("wzvQ6c3xUsVgtCt1P1Sc")
      .get()
      .then((snapshot) => {
        console.log(snapshot.data().rate_per_hour);
        setPerHour(snapshot.data().rate_per_hour);
      })
      .catch((error) => {
        console.log(error, "error from getRatePerHour");
      });
  }

  async function handleSetRatePerHour() {
    db.collection("Rates")
      .doc("wzvQ6c3xUsVgtCt1P1Sc")
      .update({
        rate_per_hour: newPerHour,
      })
      .then(() => {
        console.log("success");
        getRatePerHour();
      })
      .catch((error) => {
        console.log(error, "error from handleSetRatePerHour");
      });
  }

  async function handleGetPackages() {
    db.collection("Packages")
      .get()
      .then((snapshot) => {
        console.log(snapshot.docs[0].data());
        const packageData = [];
        snapshot.forEach((doc) => {
          packageData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log(packageData);
        setPackages(...[packageData]);

        // setPerHour(snapshot.data().rate_per_hour);
      })
      .catch((error) => {
        console.log(error, "error from handleGetPackages");
      });
  }

  return (
    <>
      <CRow>
        <h2>Rate per hour for Visitor Parkers</h2>
      </CRow>
      <CRow>
        <CCol md="4">
          <CCard>
            <CCardHeader>Add Rate</CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CCol md="6">
                  <CFormGroup className="pr-1">
                    <CInput
                      id="exampleInputName2"
                      required
                      value={newPerHour}
                      onInput={(e) => setNewPerHour(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                onClick={() => handleSetRatePerHour()}
              >
                <CIcon name="cil-scrubber" /> Add
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>

        <div className={"row mt-15"}>
          <div className={"col-30"}>
            <CWidgetDropdown
              color="gradient-primary"
              header="Rate per hour"
              text={perHour ? <> ${perHour} </> : "loading"}
              footerSlot={
                <div
                  className={"text-center"}
                  style={{ height: "122px", width: "250px" }}
                ></div>
              }
            >
              <CDropdown>
                <CDropdownToggle color="transparent">
                  <CIcon name={"cilSettings"} size={"md"} />
                </CDropdownToggle>
                <CDropdownMenu className="p-0" placement="bottom-end">
                  <CDropdownItem>Delete rate</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CWidgetDropdown>
          </div>
        </div>
      </CRow>
      <CRow>
        <h2>Packages Rates for Season Parkers</h2>
      </CRow>
      {packages.map((el, idx) => (
        <RateCard key={idx} {...el} handleGetPackages={handleGetPackages} />
      ))}{" "}
    </>
  );
};

export default Rates;

const RateCard = ({ id, name, rate, handleGetPackages }) => {
  const [inputValue, setinputValue] = useState("");

  async function handleSetPackage(id) {
    console.log(id);
    db.collection("Packages")
      .doc(id)
      .update({
        rate: inputValue,
      })
      .then(() => {
        console.log("success");
        handleGetPackages();
        setinputValue("");
      })
      .catch((error) => {
        console.log(error, "error from handleSetRatePerHour");
        setinputValue("");
      });
  }
  return (
    <CRow>
      <CCol md="4">
        <CCard>
          <CCardHeader>Add Rate</CCardHeader>
          <CCardBody>
            <CForm action="" method="post">
              <CCol md="6">
                <CFormGroup className="pr-1">
                  <CInput
                    id="exampleInputName2"
                    required
                    value={inputValue}
                    onInput={(e) => setinputValue(e.target.value)}
                  />
                </CFormGroup>
              </CCol>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              color="primary"
              onClick={() => handleSetPackage(id)}
            >
              <CIcon name="cil-scrubber" /> Add
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <div className={"row mt-15"}>
        <div className={"col-30"}>
          <CWidgetDropdown
            color="gradient-primary"
            header={name}
            text={rate ? <>${rate}</> : "loading"}
            footerSlot={
              <div
                className={"text-center"}
                style={{ height: "122px", width: "250px" }}
              ></div>
            }
          >
            <CDropdown>
              <CDropdownToggle color="transparent">
                <CIcon name={"cilSettings"} size={"md"} />
              </CDropdownToggle>
              <CDropdownMenu className="p-0" placement="bottom-end">
                <CDropdownItem>Delete rate</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CWidgetDropdown>
        </div>
      </div>
    </CRow>
  );
};

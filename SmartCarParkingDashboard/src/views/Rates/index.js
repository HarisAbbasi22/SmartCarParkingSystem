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
  CDataTable,
  CSwitch,
  CLabel,
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
      {/* <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Package List</h2>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={packages}
                fields={[
                  { key: "id", _classes: "text-center" },
                  "name",
                  "rate",
                  "isAvailable",
                  {
                    key: 'count',
                    _classes: "text-center",
                    label: 'Sold',
                  }
                ]}
                // loading={loading}
                dark
                hover
                striped
                bordered
                size="sm"
                itemsPerPage={10}
                pagination
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
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
                  <CDropdownItem>Edit rate</CDropdownItem>
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

const RateCard = ({ id, count, name, isAvailable, rate, handleGetPackages }) => {
  const [inputValue, setinputValue] = useState("");
  const [isAvailableValue, setIsAvailableValue] = useState(isAvailable);


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

  async function handleSetAvailability(value) {

    setIsAvailableValue(value);
    db.collection("Packages")
      .doc(id)
      .update({
        isAvailable: value,
      })
      .then(() => {
        console.log("success");
        // handleGetPackages();

      })
      .catch((error) => {
        console.log(error, "error from handleSetAvailability");
        // setinputValue("");
      });
  }
  return (
    <CRow className="mb-4">
      <CCol md="4" className="pr-0">
        <CCard className="h-100">
          <CCardHeader>Add Rate</CCardHeader>
          <CCardBody>
            <CForm action="" method="post">
              <CCol md="12">
                <CFormGroup className="pr-1 d-flex">
                  <CInput
                    id="rate"
                    required
                    value={inputValue}
                    onInput={(e) => setinputValue(e.target.value)}
                  />

                </CFormGroup>
                <CFormGroup className="d-flex align-items-center">
                  <CLabel className="mr-2" htmlFor="floor">Available</CLabel>
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    defaultChecked={isAvailableValue}
                    onChange={(event) =>
                      handleSetAvailability(
                        event.target.checked,
                      )
                    }
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
              <CIcon name="cil-scrubber" /> Edit
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>

      <CCol md="4" className="pl-0 ">
        <CWidgetDropdown
          style={{ height: "100%" }}
          color="gradient-primary"
          header={name}
          text={rate ? <>${rate}</> : "loading"}
          footerSlot={
            <div

              className="text-center mb-4"
            >
              <h2>Sold: {count}</h2>
            </div>
          }
        >
          <CDropdown>
            <CDropdownToggle color="transparent">
              <CIcon name={"cilSettings"} size={"md"} />
            </CDropdownToggle>
            <CDropdownMenu className="p-0" placement="bottom-end">
              <CDropdownItem>Delete Package</CDropdownItem>
              <CDropdownItem>Edit Package</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>



    </CRow >
  );
};

import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query } from "@firebase/firestore";
import { db } from "../../firebase";

import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CProgress,
  CRow,
  CCallout,
  CWidgetDropdown,
  CWidgetProgressIcon,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import ChartLineSimple from "../charts/ChartLineSimple";

const Dashboard = () => {
  const [parkers, setparkers] = useState({});
  const [vehicle, setvehicle] = useState([]);
  const [allSlots, setallSlots] = useState([]);
  useEffect(() => {
    getParkersData();
    getAllregisteredVehicles();
    getAllSlots();
  }, []);

  const getAllregisteredVehicles = async () => {
    try {
      onSnapshot(collection(db, "RegisteredVehicles"), (snapshot) => {
        const vehicleData = [];
        snapshot.forEach((doc) => {
          vehicleData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setvehicle(...[vehicleData]);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getAllSlots = async () => {
    try {
      onSnapshot(collection(db, "AllSlots"), (snapshot) => {
        const slotData = [];
        snapshot.forEach((doc) => {
          slotData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setallSlots(...[slotData]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getParkersData = () => {
    try {
      const dataQuery = query(collection(db, "Users"));
      onSnapshot(dataQuery, (snapshot) => {
        const parkerData = [];
        snapshot.forEach((doc) => {
          parkerData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        const visitorParker = parkerData.filter((parker) => {
          return parker.seasonParker === false;
        });
        const seasonParker = parkerData.filter((parker) => {
          return parker.seasonParker === true;
        });
        console.log({ parkerData, visitorParker, seasonParker });
        setparkers({ parkerData, visitorParker, seasonParker });
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <CRow>
        <CCol sm="7" md="3">
          <CWidgetProgressIcon
            header={parkers?.visitorParker?.length}
            text="Visitor Parkers"
            color="gradient-info"
          >
            <CIcon name="cil-people" height="36" />
          </CWidgetProgressIcon>
        </CCol>

        <CCol sm="7" md="3">
          <CWidgetProgressIcon
            header={parkers?.seasonParker?.length}
            text="Season Parkers"
            color="green"
          >
            <CIcon name="cil-people" height="36" />
          </CWidgetProgressIcon>
        </CCol>
        <CCol sm="7" lg="3">
          <CWidgetDropdown
            color="gradient-primary"
            header={vehicle.length}
            text="Vehicles Registered"
            footerSlot={
              <ChartLineSimple
                className="mt-3"
                style={{ height: "70px" }}
                backgroundColor="rgba(255,255,255,.2)"
                dataPoints={[70, 90, 150, 200, 300, 400, 460]}
                options={{ elements: { line: { borderWidth: 2.5 } } }}
                pointHoverBackgroundColor="warning"
              />
            }
          ></CWidgetDropdown>
        </CCol>
        <CCol sm="7" lg="3">
          <CWidgetDropdown
            color="gradient-info"
            header={allSlots.length}
            text=" Total Parking Slots"
            footerSlot={
              <ChartLineSimple
                className="mt-3"
                style={{ height: "70px" }}
                backgroundColor="rgba(255,255,255,.2)"
                dataPoints={[50, 50, 50, 50, 50, 50, 50]}
                options={{ elements: { line: { borderWidth: 2.5 } } }}
              />
            }
          ></CWidgetDropdown>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs="12" md="6" xl="6">
                  <CRow>
                    <CCol sm="6">
                      <CCallout color="info">
                        <small className="text-muted">Visitor Parkers</small>
                        <br />
                        <strong className="h4">
                          {parkers?.visitorParker?.length}
                        </strong>
                      </CCallout>
                    </CCol>
                    <CCol sm="6">
                      <CCallout color="danger">
                        <small className="text-muted">Season Parkers</small>
                        <br />
                        <strong className="h4">
                          {parkers?.seasonParker?.length}
                        </strong>
                      </CCallout>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Monday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="34"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="78"
                      />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Tuesday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="56"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="94"
                      />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Wednesday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="12"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="67"
                      />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Thursday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="43"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="91"
                      />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Friday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="22"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="73"
                      />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Saturday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="53"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="82"
                      />
                    </div>
                  </div>
                  <div className="progress-group mb-4">
                    <div className="progress-group-prepend">
                      <span className="progress-group-text">Sunday</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress
                        className="progress-xs"
                        color="info"
                        value="9"
                      />
                      <CProgress
                        className="progress-xs"
                        color="danger"
                        value="69"
                      />
                    </div>
                  </div>
                  <div className="legend text-center">
                    <small>
                      <sup className="px-1">
                        <CBadge shape="pill" color="info">
                          &nbsp;
                        </CBadge>
                      </sup>
                      Visitor Parkers &nbsp;
                      <sup className="px-1">
                        <CBadge shape="pill" color="danger">
                          &nbsp;
                        </CBadge>
                      </sup>
                      Season Parkers
                    </small>
                  </div>
                </CCol>
              </CRow>

              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "@firebase/firestore";
import { db } from "../../../firebase";

import moment from "moment";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";

import entranceData from "../../users/EntranceData";

const fields = [
  {
    key: "LicensePlateNo",
    label: "licensePlateNumber",
  },

  {
    key: "CarModel",
    label: "Car Model",
  },
  {
    key: "time",
    label: "Entrance Time",
  },
];

/**
 * @author
 * @function Entrance
 **/
const Entrance = (props) => {
  const [entranceRecords, setEntranceRecords] = useState("");

  useEffect(() => {
    getEntranceRecords();
  }, []);

  async function getEntranceRecords() {
    const dataQuery = query(collection(db, "Users"), where("time", "!=", null));
    onSnapshot(dataQuery, (snapshot) => {
      const seasonData = [];
      snapshot.forEach((doc) => {
        seasonData.push({
          id: doc.id,
          ...doc.data(),
          time: moment(doc.data().time).format("LTS"),
        });
        console.log(seasonData);
        setEntranceRecords(...[seasonData]);
      });
    });
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Entrance Records</h2>
              <h3> Date: {moment().format("L")}</h3>
            </CCardHeader>

            {entranceData ? (
              <CCardBody>
                <CDataTable
                  items={entranceRecords}
                  fields={fields}
                  dark
                  hover
                  striped
                  bordered
                  size="sm"
                  itemsPerPage={10}
                  pagination
                />
              </CCardBody>
            ) : (
              <>
                <h1>no Records</h1>
              </>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Entrance;

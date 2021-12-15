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
  "name",
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
  const [entranceRecords, setEntranceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEntranceRecords();

  }, []);

  async function getEntranceRecords() {
    setLoading(true);

    const dataQuery = query(collection(db, "Users"));

    // , where("time", "!=", null)
    onSnapshot(dataQuery, (snapshot) => {
      snapshot.forEach((doc) => {
        getParkingHistory(doc.data(), doc.id);
      });
    });
  }

  const getParkingHistory = (doc1, id) => {
    db.collection("Users")
      .doc(id)
      .collection("parkingHistory")
      .orderBy("endTime", "desc")
      .get()
      .then((snapshot) => {
        const data = entranceRecords;
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
            ...doc1,
            time: moment(doc.data().startTime).format("llll"),
          });
        });
        setEntranceRecords([...data]);
        setLoading(false)

      })
      .catch((error) => {
        setLoading(false)

        console.log(error, "error from get Parking History");
      });
  };


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
                  loading={loading}
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

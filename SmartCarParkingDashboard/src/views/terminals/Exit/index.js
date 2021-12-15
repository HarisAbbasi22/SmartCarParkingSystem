import React, { useState, useEffect } from "react";
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
    label: "Exit Time",
  },
];
/**
 * @author
 * @function Exit
 **/
const Exit = () => {
  const [exitRecords, setExitRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getExitRecords();
  }, []);

  async function getExitRecords() {
    setLoading(true);

    const dataQuery = query(collection(db, "Users"));
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
        const data = exitRecords;
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
            ...doc1,
            time: moment(doc.data().endTime).format("llll"),
          });
        });
        setExitRecords([...data]);
        setLoading(false)

      })
      .catch((error) => {
        console.log(error, "error from get Parking History");
        setLoading(false)

      });
  };


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Exit Records</h2>
              <h3> Date: {moment().format("L")}</h3>
            </CCardHeader>
            {exitRecords ? (
              <CCardBody>
                <CDataTable
                  items={exitRecords}
                  fields={fields}
                  dark
                  hover
                  striped
                  bordered
                  loading={loading}
                  size="sm"
                  itemsPerPage={10}
                  pagination
                />
              </CCardBody>
            ) : (
              <></>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Exit;

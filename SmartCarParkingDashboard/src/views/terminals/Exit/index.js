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
  const [exitRecords, setExitRecords] = useState("");

  useEffect(() => {
    getExitRecords();
  }, []);

  async function getExitRecords() {
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
        setExitRecords(...[seasonData]);
      });
    });
  }

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

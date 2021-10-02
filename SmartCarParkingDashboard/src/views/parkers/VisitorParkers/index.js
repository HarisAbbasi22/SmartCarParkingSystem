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

// import usersData from "../../users/UsersData";

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
    key: "totalTime",
    label: "Parking Duration",
  },

  "parkingFees",
];

/**
 * @author
 * @function VisitorParkers
 **/
const VisitorParkers = () => {
  const [visitors, setVisitors] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    getVisitors();
  }, []);

  const getVisitors = () => {
    // setloading(true);

    // try {
    //   const dataQuery = query(
    //     collection(db, "Users"),
    //     where("seasonParker", "==", false)
    //   );
    //   onSnapshot(dataQuery, (snapshot) => {
    //     snapshot.forEach((doc) => {
    //       getParkingHistory(doc);
    //     });
    //     setloading(false);
    //   });
    // } catch (error) {
    //   console.log(error);
    //   setloading(false);
    // }

    db.collection("Users")
      .where("seasonParker", "==", false)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          getParkingHistory(doc.data(), doc.id);
        });
      })
      .catch((error) => {
        console.log(error, "Error from get Visitor");
      });
  };

  const getParkingHistory = (doc, id) => {
    db.collection("Users")
      .doc(id)
      .collection("parkingHistory")
      .orderBy("endTime", "desc")
      .get()
      .then((snapshot) => {
        getRate({
          id,
          totalTime: snapshot.docs[0].data().totalTime,
          ...doc,
        });
      })
      .catch((error) => {
        console.log(error, "error from get Parking History");
        setloading(false);
      });
  };
  const getRate = (doc) => {
    db.collection("Rates")
      .doc("wzvQ6c3xUsVgtCt1P1Sc")
      .get()
      .then((snapshot) => {
        const visitorsData = [];
        visitorsData.push({
          ...doc,
          parkingFees: snapshot.data().rate_per_hour,
        });
        setloading(false);
        setVisitors(...[visitorsData]);
      })
      .catch((error) => {
        console.log(error, "error form get Rate");
        setloading(false);
      });
  };

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h1>Visitor Parkers List</h1>
              <h3> Date: {moment().format("L")}</h3>
            </CCardHeader>

            {visitors ? (
              <CCardBody>
                <CDataTable
                  items={visitors}
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
              <h2>No visitors</h2>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default VisitorParkers;

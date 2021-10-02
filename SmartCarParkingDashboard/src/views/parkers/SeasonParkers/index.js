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
    key: "parkingPackage",
    label: "Parking Package",
  },
];

/**
 * @author
 * @function SeasonParkers
 **/
const SeasonParkers = (props) => {
  const [seasonParker, setSeasonParker] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    getSeasonParker();
  }, []);

  const getSeasonParker = () => {
    setloading(true);

    try {
      const dataQuery = query(
        collection(db, "Users"),
        where("seasonParker", "==", true)
      );
      onSnapshot(dataQuery, (snapshot) => {
        const seasonData = [];
        snapshot.forEach((doc) => {
          seasonData.push({
            id: doc.id,
            parkingPackage: doc.data().packages,
            ...doc.data(),
          });
        });
        setloading(false);
        setSeasonParker(...[seasonData]);
      });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  // const getUserPackage = (doc) => {
  //   const id = doc.data().package_id;
  //   db.collection("Packages")
  //     .doc(id)
  //     .get()
  //     .then((snapshot) => {
  //       console.log(snapshot.data(), "daas");
  //       const seasonData = [];
  //       seasonData.push({
  //         id: doc.id,
  //         parkingPackage: snapshot.data().name,
  //         ...doc.data(),
  //       });
  //       setloading(false);
  //       setSeasonParker(...[seasonData]);
  //     })
  //     .catch((error) => {
  //       console.log(error, "error form getUserPackage");
  //       setloading(false);
  //     });
  // };

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Season Parkers List</h2>
              <h3> Date: {moment().format("L")}</h3>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={seasonParker}
                fields={fields}
                loading={loading}
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
      </CRow>
    </>
  );
};

export default SeasonParkers;

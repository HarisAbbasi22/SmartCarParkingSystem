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
    getPackages();

  }, []);

  const getPackages = async () => {
    const packages = await db.collection("Packages").get();
    const packagesArray = packages.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    getSeasonParker(packagesArray);
  };


  const handlePackageName = (id, packagesArray) => {
    const packageName = packagesArray.find((item) => item.id === id);
    return packageName?.name ? packageName.name : "none";
  };


  const getSeasonParker = (packagesArray) => {
    setloading(true);

    try {
      const dataQuery = query(
        collection(db, "Users"),
        where("parker_type", "==", "season")

      );
      onSnapshot(dataQuery, (snapshot) => {
        const seasonData = [];
        snapshot.forEach((doc) => {

          console.log(doc.data().package_id)
          seasonData.push({
            id: doc.id,
            parkingPackage: handlePackageName(doc.data().package_id, packagesArray),
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

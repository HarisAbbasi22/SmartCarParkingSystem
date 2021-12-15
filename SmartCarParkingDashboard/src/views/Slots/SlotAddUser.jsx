import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query } from "@firebase/firestore";
import { db } from "../../firebase";

// components
import AddSlot from "./Components/AddSlot";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from "@coreui/react";
import moment from "moment";
import EditSlot from "./Components/EditSlot";
import AssignSlot from "./Components/AssignSlot";

/**
 * @author
 * @function SlotAddUser
 **/

const fields = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "LicensePlateNo",
    label: "License Plate Number",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "parker_type",
    label: "Type",
  },
  {
    key: "slot",
    label: "Slot",
  },
  {
    key: "assign",
    label: "Assign",
  },
  "remove",
];

export default function SlotAddUser() {
  const [allUser, SetAllUser] = useState(null);
  const [allSlot, SetAllSlot] = useState(null);
  const [loading, setloading] = useState(false);

  // assign model
  const [assignModel, setAssignModel] = useState(false);
  const [assignModelData, setAssignModelData] = useState(null);

  useEffect(() => {
    getUsersData();
    getSlotData();
  }, []);

  const getSlotData = () => {
    setloading(true);

    try {
      const dataQuery = query(collection(db, "AllSlots"));
      onSnapshot(dataQuery, (snapshot) => {
        const seasonData = [];
        snapshot.forEach((doc) => {
          seasonData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setloading(false);
        SetAllSlot(...[seasonData]);
      });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  const getUsersData = () => {
    setloading(true);

    try {
      const dataQuery = query(collection(db, "Users"));
      onSnapshot(dataQuery, (snapshot) => {
        const seasonData = [];
        snapshot.forEach((doc) => {
          seasonData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setloading(false);
        SetAllUser(...[seasonData]);
      });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const GetUserSlot = (userSID) => {
    const data = allSlot?.filter((item) => item.slot_id === userSID);

    return data ? data[0].slot : "none";
  };

  const handleFloorName = (floor) => {
    if (floor === "1") {
      return "Visitor Parking";
    } else if (floor === "2") {
      return "Season Parking";
    } else if (floor === "3") {
      return "Disabled Parking";
    } else {
      return "";
    }
  };

  async function DeleteSlotFirebase(value) {
    db.collection("Users")
      .doc(value.uid)
      .update({
        ...value,
        slot_id: "",
      })
      .then(() => {
        console.log("success");
        db.collection("AllSlots").doc(value.slot_id).update({ booked: false });
      })
      .catch((error) => {
        console.log(error, "error from edit slot");
      });
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>All Users</h2>
                <h5> Date: {moment().format("L")}</h5>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={allUser}
              fields={fields}
              loading={loading}
              dark
              hover
              striped
              bordered
              size="sm"
              sorter={"asc"}
              itemsPerPage={10}
              pagination
              scopedSlots={{
                slot: (item) => (
                  <td>
                    <h5>{item.slot_id ? GetUserSlot(item.slot_id) : ""}</h5>
                  </td>
                ),
                floor: (item) => (
                  <td>
                    <span className="badge badge-success">
                      {handleFloorName(item.floor)}
                    </span>
                  </td>
                ),
                booked: (item) => (
                  <td>
                    {item.booked ? (
                      <span className="badge badge-success">Yes</span>
                    ) : (
                      <span className="badge badge-danger">No</span>
                    )}
                  </td>
                ),

                assign: (item, key) => (
                  <td>
                    <CButton
                      onClick={() => {
                        setAssignModel(true);
                        setAssignModelData(item);
                      }}
                      size="sm"
                      shape="pill"
                      color="primary"
                      block
                    >
                      Assign new Slot
                    </CButton>
                  </td>
                ),
                remove: (item, key) => (
                  <td>
                    <CButton
                      onClick={() => {
                        DeleteSlotFirebase(item);
                      }}
                      size="sm"
                      shape="pill"
                      color="danger"
                      block
                    >
                      Remove Slot
                    </CButton>
                  </td>
                ),
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      {assignModel && (
        <AssignSlot
          value={assignModelData}
          allSlot={allSlot}
          show={assignModel}
          handleClose={() => setAssignModel(false)}
        />
      )}
    </CRow>
  );
}

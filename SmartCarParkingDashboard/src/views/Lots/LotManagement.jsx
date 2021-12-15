import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query } from "@firebase/firestore";
import { db } from "../../firebase";

// components
import AddSlot from "./Components/AddLot";

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
import EditSlot from "./Components/EditLot";

/**
 * @author
 * @function LotManagement
 **/

const fields = [
  {
    key: "name",
    label: "Lot Name",
  },
  "edit",
  "delete",
];
export default function LotManagement() {
  const [lotData, setLotData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [EditShow, setEditShow] = useState(false);
  const [EditValue, setEditValue] = useState(null);

  useEffect(() => {
    getSlotData();
  }, []);

  const getSlotData = () => {
    setLoading(true);

    try {
      const dataQuery = query(collection(db, "Floors"));
      onSnapshot(dataQuery, (snapshot) => {
        const LotData = [];
        snapshot.forEach((doc) => {
          LotData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setLoading(false);
        setLotData(...[LotData]);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  async function deleteSlot(id) {
    db.collection("Floors")
      .doc(id)
      .delete()
      .then(() => {
        console.log("success");
        getSlotData();

        db.collection("AllSlots")
          .where("floor", "==", id)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              doc.ref.delete();
            });
          });
      })
      .catch((error) => {
        console.log(error, "error from Delete Lots");
      });
  }

  const handleFloorName = (floor) => {
    console.log(floor);
    if (floor === 1) {
      return <span className="badge badge-success">Visitor Parking</span>;
    } else if (floor === 2) {
      return <span className="badge badge-warning">Season Parking</span>;
    } else if (floor === 3) {
      return <span className="badge badge-secondary">Disabled Parking</span>;
    } else {
      return "";
    }
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>Parking Lots</h2>
                <h5> Date: {moment().format("L")}</h5>
              </div>
              <div>
                <AddSlot />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={lotData}
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
                    <div>
                      <div>
                        <h5>{item.slot}</h5>
                      </div>
                    </div>
                  </td>
                ),
                floor: (item) => <td>{handleFloorName(item.floor)}</td>,
                booked: (item) => (
                  <td>
                    {item.booked ? (
                      <span className="badge badge-success">Yes</span>
                    ) : (
                      <span className="badge badge-danger">No</span>
                    )}
                  </td>
                ),
                edit: (item, key) => (
                  <td>
                    <CButton
                      onClick={() => {
                        setEditShow(true);
                        setEditValue(item);
                      }}
                      // disabled={item.type === "disabled"}
                      size="sm"
                      shape="pill"
                      color="primary"
                      block
                    >
                      Edit
                    </CButton>
                  </td>
                ),
                delete: (item, key) => (
                  <td>
                    <CButton
                      onClick={() => {
                        deleteSlot(item.id);
                      }}
                      // disabled={item.type === "disabled"}
                      size="sm"
                      shape="pill"
                      color="danger"
                      block
                    >
                      delete
                    </CButton>
                  </td>
                ),
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <EditSlot
        value={EditValue}
        show={EditShow}
        handleClose={() => setEditShow(false)}
      />
    </CRow>
  );
}

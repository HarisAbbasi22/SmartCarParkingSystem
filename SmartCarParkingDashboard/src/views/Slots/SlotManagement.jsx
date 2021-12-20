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

/**
 * @author
 * @function SlotManagement
 **/

const fields = [
  {
    key: "serialNumber",
    _style: { width: "20%" },
    label: "Serial Number",
    filter: false,
    sorter: false,
  },
  {
    key: "slot",
    label: "Slot Name",
    _style: { width: "20%" },
    _props: { color: "primary", className: "fw-semibold" },
  },
  {
    key: "floor",
    label: "Floor Name",
  },
  {
    key: "booked",
    label: "Booked",
    _style: { width: "20%" },
  },
  {
    key: "edit",
    label: "",
    filter: false,
    sorter: false,
  },
  {
    key: "delete",
    label: "",
    filter: false,
    sorter: false,
  },
];
export default function SlotManagement() {
  const [seasonParker, setSeasonParker] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [loading, setloading] = useState(false);

  const [EditShow, setEditShow] = useState(false);
  const [EditValue, setEditValue] = useState(null);

  useEffect(() => {
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
        setSeasonParker(...[seasonData]);
        getAllFloorName();
      });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const getAllFloorName = () => {
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
        setloading(false);
        setLotData(...[LotData]);
      });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const GetFloorData = (floorID) => {
    const data = lotData?.filter((item) => item.floor_id === floorID);
    console.log(data);
    // return "none";
    return data !== undefined && data.length > 0 ? data[0].name : "none";
  };

  async function deleteSlot(id) {
    db.collection("AllSlots")
      .doc(id)
      .delete()
      .then(() => {
        console.log("success");
        getSlotData();
      })
      .catch((error) => {
        console.log(error, "error from AllSlots");
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
                <h2>All Slots</h2>
                <h5> Date: {moment().format("L")}</h5>
              </div>
              <div>
                <AddSlot lotData={lotData} />
              </div>
            </div>
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
              columnFilter
              columnSorter
              tableFilter
              sorterValue={{ column: "slot", state: "asc" }}
              size="sm"
              columnFilterValue={["slot", "floor", "booked"]}
              // tableFilter
              // tableFilterOptions={{
              //   names: ["slot", "floor", "booked", "edit", "delete"],
              // }}
              sorter
              itemsPerPageSelect
              itemsPerPage={10}
              pagination
              scopedSlots={{
                serialNumber: (item, idx) => (
                  <td>
                    <span className="">{idx + 1}</span>
                  </td>
                ),
                slot: (item) => (
                  <td>
                    <div>
                      <div>
                        <h5>{item.slot}</h5>
                      </div>
                    </div>
                  </td>
                ),
                floor: (item) => <td>{GetFloorData(item.floor)}</td>,
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
        lotData={lotData}
        handleClose={() => setEditShow(false)}
      />
    </CRow>
  );
}

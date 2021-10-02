import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CInput,
  CDropdown,
  CRow,
  CWidgetDropdown,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
const axios = require("axios");
/**
 * @author
 * @function Announcements
 **/
const Announcements = (props) => {
  const [announcement, setAnnouncement] = useState([]);
  const [stateChanger, setStateChanger] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [newAnnouncementAmmount, setNewAnnouncementAmmount] = useState("");

  useEffect(() => {
    getAnnouncement();
  }, [stateChanger]);

  function stateReload() {
    if (stateChanger === false) {
      setStateChanger(true);
    } else if (stateChanger === true) {
      setStateChanger(false);
    }
  }

  async function getAnnouncement() {
    db.collection("Announcements")
      .get()
      .then((snapshot) => {
        const announcementData = [];
        snapshot.forEach((doc) => {
          announcementData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAnnouncement(announcementData);
      })
      .catch((error) => {
        console.log(error, "error from getAnnouncement");
      });
  }

  async function addAnnouncement() {
    console.log(newAnnouncement);
    if (newAnnouncement !== "") {
      console.log("in post function");

      db.collection("Announcements")

        .add({
          name: newAnnouncement,
          amount: newAnnouncementAmmount,
        })
        .then(() => {
          console.log("success");
          stateReload();
        })
        .catch((error) => {
          console.log(error, "error from addAnnouncement");
        });
    } else {
      console.log("Error field empty");
    }
  }

  async function deleteAnnouncement(id) {
    db.collection("Announcements")
      .doc(id)
      .delete()
      .then(() => {
        console.log("success");
        stateReload();
      })
      .catch((error) => {
        console.log(error, "error from deleteAnnouncement");
      });
  }

  return (
    <>
      <CRow>
        <h2>Announcements</h2>
      </CRow>

      <CRow>
        <CCol md="6">
          <CCard>
            <CCardHeader>Add New Announcement</CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CCol md="12">
                  <CFormGroup className="pr-1">
                    <CInput
                      value={newAnnouncement}
                      onInput={(e) => setNewAnnouncement(e.target.value)}
                      placeholder="Announcement"
                      required
                    />
                    <CInput
                      className="mt-4"
                      value={newAnnouncementAmmount}
                      onInput={(e) => setNewAnnouncementAmmount(e.target.value)}
                      placeholder="Amount"
                      required
                    />
                  </CFormGroup>
                </CCol>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                onClick={() => addAnnouncement()}
              >
                <CIcon name="cil-scrubber" /> Add
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <div className={"row mt-3"}>
        <div className={"col-5"}>
          {announcement !== null ? (
            <>
              {announcement.map((value, index) => (
                <CWidgetDropdown
                  color="gradient-info"
                  header={value.name}
                  footerSlot={
                    <div
                      className={"text-center"}
                      style={{ height: "100px", width: "90px" }}
                    >
                      {value.amount}
                    </div>
                  }
                >
                  <CDropdown>
                    <CDropdownToggle color="transparent">
                      <CIcon name={"cilSettings"} size={"md"} />
                    </CDropdownToggle>
                    <CDropdownMenu className="p-0" placement="bottom-end">
                      <CDropdownItem
                        onClick={() => deleteAnnouncement(value.id)}
                      >
                        Delete
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CWidgetDropdown>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Announcements;

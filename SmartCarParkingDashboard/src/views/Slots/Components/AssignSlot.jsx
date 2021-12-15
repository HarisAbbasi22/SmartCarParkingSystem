import React from "react";
import { db } from "../../../firebase";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
  CSwitch,
} from "@coreui/react";

export default function AssignSlot({ show, handleClose, value, allSlot }) {
  console.log(value);

  const [selectedSlot, setSelectedSlot] = React.useState(value?.slot_id);

  async function AssignSlotFirebase() {
    db.collection("Users")
      .doc(value.uid)
      .update({
        ...value,
        slot_id: selectedSlot,
      })
      .then(() => {
        console.log("success");
        db.collection("AllSlots").doc(value?.slot_id).update({ booked: false });
        db.collection("AllSlots").doc(selectedSlot).update({ booked: true });
      })
      .catch((error) => {
        console.log(error, "error from edit slot");
      });

    handleClose();
  }

  return (
    <>
      <CModal show={show} onClose={() => handleClose()} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Assign Slot</CModalTitle>
        </CModalHeader>
        {value && (
          <>
            <CModalBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <h1>{value.name}</h1>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="floor">Slots</CLabel>
                    <CSelect
                      onChange={(event) => setSelectedSlot(event.target.value)}
                      value={selectedSlot}
                      custom
                      name="slots"
                    >
                      <option>Select floor</option>
                      {allSlot.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.slot}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>

            <CModalFooter>
              <CButton
                color="primary"
                type="submit"
                // disabled={!isValid}
                onClick={() => AssignSlotFirebase()}
              >
                Edit Slot
              </CButton>{" "}
              <CButton color="secondary" onClick={() => handleClose()}>
                Cancel
              </CButton>
            </CModalFooter>
          </>
        )}{" "}
      </CModal>
    </>
  );
}

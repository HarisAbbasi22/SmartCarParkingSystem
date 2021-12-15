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

import { Formik } from "formik";
import * as Yup from "yup";

export default function EditSlot({ show, handleClose, value, lotData }) {
  console.log(value);

  const initialState = {
    slot: value?.slot,
    floor: value?.floor,
    booked: value?.booked,
    slot_id: value?.slot_id,
  };
  const initialStateEmpty = {
    slot: "",
    floor: 1,
    booked: false,
    slot_id: "",
  };

  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    // if (!state.slot_id) {
    setState(initialState);
    // }

    return () => {
      setState(initialStateEmpty);
    };
  }, [value]);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  async function UodateSlotFirebase() {
    console.log(state);
    db.collection("AllSlots")
      .doc(state.slot_id)
      .update({
        slot_id: state.slot_id,
        slot: state.slot,
        floor: state.floor,
        booked: Boolean(state.booked),
      })
      .then(() => {
        console.log("success");
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
          <CModalTitle>Edit Slot</CModalTitle>
        </CModalHeader>
        {value && (
          <>
            <CModalBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="slot">Slot Name</CLabel>
                    <CInput
                      name="slot"
                      value={state.slot}
                      onChange={handleChange}
                      placeholder="Enter slot name"
                      required
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="floor">Floors</CLabel>
                    <CSelect
                      onChange={(event) =>
                        setState({
                          ...state,
                          ["floor"]: event.target.value,
                        })
                      }
                      value={state.floor}
                      custom
                      name="floor"
                    >
                      <option>Select floor</option>
                      {lotData?.map((el) => (
                        <option value={el.floor_id}>{el.name}</option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="floor">Booked</CLabel>
                    <br />
                    <CSwitch
                      className="mr-1"
                      color="primary"
                      defaultChecked={state.booked}
                      onChange={(event) =>
                        setState({
                          ...state,
                          ["booked"]: event.target.checked,
                        })
                      }
                    />{" "}
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>

            <CModalFooter>
              <CButton
                color="primary"
                type="submit"
                // disabled={!isValid}
                onClick={() => UodateSlotFirebase()}
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

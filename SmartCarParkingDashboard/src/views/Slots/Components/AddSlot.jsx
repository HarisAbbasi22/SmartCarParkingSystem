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
} from "@coreui/react";

import { Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  slot: "",
  floor: "",
  booked: false,
  slot_id: "",
};

const valuesSchema = Yup.object().shape({
  slot: Yup.string().required("Slot Name is Required"),
  floor: Yup.string().required("Floor is required is Required"),
});

export default function AddSlot({ lotData }) {
  const [large, setLarge] = React.useState(false);

  async function AddSlotFirebase(values) {
    db.collection("AllSlots")
      .add({
        slot: values.slot,
        floor: values.floor,
        booked: values.booked,
      })
      .then((docRef) => {
        console.log("success");
        db.collection("AllSlots").doc(docRef.id).update({ slot_id: docRef.id });
      })
      .catch((error) => {
        console.log(error, "error from add slot");
      });

    setLarge(!large);
  }

  return (
    <>
      <CButton color="primary" onClick={() => setLarge(true)}>
        Add Slot
      </CButton>

      <CModal show={large} onClose={() => setLarge(!large)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Add Slot</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={initialValues}
          initialErrors={initialValues}
          validationSchema={valuesSchema}
          onSubmit={(values, { resetForm }) => {
            AddSlotFirebase({ ...values, floor: values.floor });
            resetForm();
          }}
        >
          {({
            isValid,
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <>
              <CModalBody>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel htmlFor="slot">Slot Name</CLabel>
                      <CInput
                        name="slot"
                        value={values.slot}
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
                        value={values.floor}
                        onChange={handleChange}
                        custom
                        name="floor"
                      >
                        <option>Select floor</option>
                        {lotData?.map((el) => (
                          <option value={el.floor_id}>{el.name}</option>
                        ))}

                        {/* <option value="1">Visitor Parker Floor</option>
                        <option value="2">Season Parker Floor</option>
                        <option value="3">Disabled Parker Floor</option> */}
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CModalBody>

              <CModalFooter>
                <CButton
                  color="primary"
                  type="submit"
                  disabled={!isValid}
                  onClick={() => handleSubmit()}
                >
                  Add Slot
                </CButton>{" "}
                <CButton color="secondary" onClick={() => setLarge(!large)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </>
          )}
        </Formik>
      </CModal>
    </>
  );
}

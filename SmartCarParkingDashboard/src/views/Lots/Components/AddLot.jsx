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
  name: "",
  type: "Enabled",
  floor_id: "",
};

const valuesSchema = Yup.object().shape({
  name: Yup.string().required("Lot Name is Required"),
});

export default function AddSlot() {
  const [large, setLarge] = React.useState(false);

  async function AddSlotFirebase(values) {
    db.collection("Floors")
      .add({
        name: values.name,
        type: values.type,
      })
      .then((docRef) => {
        console.log("success");
        db.collection("Floors").doc(docRef.id).update({ floor_id: docRef.id });
      })
      .catch((error) => {
        console.log(error, "error from add Lot");
      });

    setLarge(!large);
  }

  return (
    <>
      <CButton color="primary" onClick={() => setLarge(true)}>
        Add Lot
      </CButton>

      <CModal show={large} onClose={() => setLarge(!large)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Add Lot</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={initialValues}
          initialErrors={initialValues}
          validationSchema={valuesSchema}
          onSubmit={(values, { resetForm }) => {
            AddSlotFirebase({ ...values });
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
                      <CLabel htmlFor="slot">Lot Name</CLabel>
                      <CInput
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Enter Lot name"
                        required
                      />
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
                  Add Lot
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

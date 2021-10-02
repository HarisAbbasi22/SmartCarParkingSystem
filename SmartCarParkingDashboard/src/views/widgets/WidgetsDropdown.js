import React from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol,
 
} from '@coreui/react'

import ChartLineSimple from '../charts/ChartLineSimple'


const WidgetsDropdown = () => {
  
  return (
    <CRow>
     

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-primary"
          header="460"
          text="Vehicles Registered"
          footerSlot={
            <ChartLineSimple
              className="mt-3"
              style={{height: '70px'}}
              backgroundColor="rgba(255,255,255,.2)"
              dataPoints={[70, 90, 150, 200, 300, 400, 460]}
              options={{ elements: { line: { borderWidth: 2.5 }}}}
              pointHoverBackgroundColor="warning"
            
            />
          }
        >
          
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-info"
          header="800"
          text=" Total Parking Slots"
          footerSlot={
          <ChartLineSimple
          className="mt-3"
          style={{height: '70px'}}
          backgroundColor="rgba(255,255,255,.2)"
          dataPoints={[50, 50, 50, 50, 50, 50, 50]}
          options={{ elements: { line: { borderWidth: 2.5 }}}}
         
          
        />
      }
          
        >
         
        </CWidgetDropdown>
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown

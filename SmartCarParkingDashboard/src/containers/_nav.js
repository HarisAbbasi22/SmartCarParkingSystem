// import React from 'react'
// import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    // icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Parkers',
    route: '/parkers',
    
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Visitor Parkers',
        to: '/parkers/visitor-parkers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Season Parkers',
        to: '/parkers/season-parkers',
      },
]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Rates',
    route: '/rates',
    to: '/rates'


    
   
  },

  {
    _tag: 'CSidebarNavItem',
    name: 'Announcements',
    route: '/announcements',
    to : '/announcements',
   
  },
  
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Terminals',
    route: '/terminal',
    
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Entrance',
        to: '/terminal/entrance',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Exit',
        to: '/terminal/exit',
      },
]
  }
];

export default _nav;

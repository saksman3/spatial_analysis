import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Cookies from "js-cookie";


const LogoutModal = ({show, handleClose, handleLogout})=>{
/*   const handleLogout = e=>{
    e.preventDefault();
    console.log("handle Logout");
    fetch(`${BACKEND_HOST}/api/logout`,{
        method:'POST',
        credentials:"include",
        headers: {
            'Content-Type':'application/json'

        }
        
    }).then(res=>res.json())
    .then(data=>{
        console.log(data);
        Cookies.remove('token');
        Cookies.remove('access_token');
        window.location.replace(`${FRONTEND_HOST}`);
    });
}; */


  return(
    <Dialog
    open={show}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"Confirm Logoff?"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to logout?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>No</Button>
      <Button onClick={handleLogout} autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  )
}
export default LogoutModal;
import Cookies from "js-cookie";
import React,{useState,useEffect} from "react";
import  LogoutModal from './LogOutModal';
const FRONTEND_HOST = `${process.env.REACT_APP_FRONTEND_HOST}`
const BACKEND_HOST = `${process.env.REACT_APP_BACKEND_HOST}`

const Logout = ({shown})=>{
    const [loading,setLoading] = useState(true);
    const [show, setShow] = useState(shown);
    useEffect(()=>{
        if(Cookies.get('token')===undefined){
            window.location.replace(`${FRONTEND_HOST}`);
        }else{
            setLoading(false);
        }
    },[]);
    // New code
/*     const handleShow = (e)=>{
        setShow(true);
    } */
    
    const handleClose = () => {
        setShow(false);
        window.location.replace(`${FRONTEND_HOST}/dashboard/currentLocation`);
      };
    // end here 
    const handleLogout = e=>{
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
    };
    console.log("Logout");
    return (
        <div>
            {loading === false && (
                
                    <LogoutModal
                     show={show}
                     handleClose={handleClose} 
                     handleLogout={handleLogout}/>
                
            )}
        </div>
    );
};



export default Logout;
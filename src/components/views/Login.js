import Cookies from "js-cookie";
import {useState,useEffect} from "react";

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../css/main.css'

const FRONTEND_HOST = `${process.env.REACT_APP_FRONTEND_HOST}`
const BACKEND_HOST = `${process.env.REACT_APP_BACKEND_HOST}`

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.sataxi.co.za/">
          SA Taxi 
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const theme = createTheme({
    palette:{
        sataxi_color:{
            main:'#0205ab'
        }
    }
});

const Login = ()=>{
   const [email,setEmail] = useState('');
   const [password,setPassword] = useState('');
   const [errors,setErrors] = useState(null);
   const [loading, setLoading] = useState(true);
   
   useEffect(() =>{
       if(Cookies.get('token')){
           console.log(Cookies.get('access_token'));
           window.location.replace(`${FRONTEND_HOST}/dashboard/currentlocation`);
       }else{
           setLoading(false);
       }
   },[]);
   const handleSubmit = e =>{
       e.preventDefault();
       const user = {
           email,
           password
       };
       if(user.email&&user.password){

        setLoading(true);

       }
       // start of fetch
            fetch(`${BACKEND_HOST}/api/login`,{
                method:'POST',
                
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(user)
            }).then(res=>res.json())
            .then(data => {
                if(data.token && data.access_token){
                    Cookies.set('token',data.token);
                    Cookies.set('access_token', data.access_token)
                    console.log(Cookies.get('token'), Cookies.get("access_token"));

                    window.location.replace(`${FRONTEND_HOST}/dashboard/currentlocation`);
                    
                }else{
                    setEmail('');
                    setPassword('');
                    Cookies.remove('token');
                    console.log(data)
                    setErrors(data.detail);
                    setLoading(false);
                    
                }

            })

        

 /// end of login api call
  }
   return (
     <>
    {

    loading? <Backdrop
    sx={{ color: '#0205ab', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open
    
  >
    <CircularProgress color="inherit" />
  </Backdrop>:
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#0205ab' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {
            errors !==null &&(
              <Alert severity="error">{errors}</Alert>
            )
        }
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e=>{setEmail(e.target.value)}}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e=>{setPassword(e.target.value)}}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="sataxi_color"
            sx={{ mt: 3, mb: 2 }}
            value="login"
            style={{ color: '#FFFFFF'}}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  </ThemeProvider>
      }
               
  </> );
};
export default Login;
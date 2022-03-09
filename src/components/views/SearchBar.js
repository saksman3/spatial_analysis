import { Style } from '@material-ui/icons';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import '../css/searchstyle.css'


const SearchBar = ({placeholder, data,RetrieveData})=>{

    const [filtered, setFiltered] = useState([]);
    const [val,setVal] = useState("");
    const handleFilter = (e)=>{
        // filters accounts based on what users typed on the search bar.
        const searchWord = e.target.value;
        setVal(searchWord); // tracks the value displayed on the 
        const newFilteredData = data.filter((value)=>{
              return value.AccountNumber.includes(searchWord);
        });
        if (searchWord===""){
            setFiltered([]);
        }else{
            setFiltered(newFilteredData);
        }
        
    }
   const handleItemClick = (e)=>{
        // handles account item click
        console.log(e.target.innerHTML);
        const item = e.target.innerHTML;
        setVal(item);
        setFiltered([]);

   }
   const handleRetrieveData = ()=>{
        RetrieveData(val);
   }
   return  (
       <div className="SearchBar">
             <div className="SearchInput">
                 <TextField id="outlined-search" 
                 label="Search Account" 
                 type="search" 
                 size="small" 
                 value={val}
                 onChange={handleFilter}/>

                 <Button variant="outlined" 
                 onClick={handleRetrieveData}
                 >Search</Button>

            </div>
            { filtered.length !=0 &&(
                <div className="suggestion">
               { 
                  filtered.slice(0,15).map(account=>{
                      return <div className='Item'  key={account.AccountNumber}><p onClick={handleItemClick}>{account.AccountNumber}</p></div>
                  })
               }
               
            </div> )}
       </div>
   );
}
export default SearchBar;
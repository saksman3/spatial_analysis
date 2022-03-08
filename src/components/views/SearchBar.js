import { Style } from '@material-ui/icons';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import '../css/searchstyle.css'


const SearchBar = ({placeholder, data})=>{
    const [filtered, setFiltered] = useState([]);
    const [selected, setSelected] = useState("");
    const handleFilter = (e)=>{
        const searchWord = e.target.value;
        const newFilteredData = data.filter((value)=>{
              return value.AccountNumber.includes(searchWord);
        });
        if (searchWord===""){
            setFiltered([]);
        }else{
            setFiltered(newFilteredData);
        }
        
    }
    const handleClick = (e)=>{
        console.log(e.target.innerHTML);
        const chosen = e.target.innerHTML;
        setSelected(chosen);
        setFiltered([]);

    }
   return  (
       <div className="SearchBar">
             <div className="SearchInput">
             {/*<input type="text" placeholder={placeholder}/> */}
                 <TextField id="outlined-search" 
                 label="Search Account" 
                 type="search" 
                 size="small" 
                 
                 onChange={handleFilter}/>
            </div>
            { filtered.length !=0 &&(
                <div className="suggestion">
               { 
                  filtered.slice(0,15).map(account=>{
                      return <div className='Item'  key={account.AccountNumber}><p>{account.AccountNumber}</p></div>
                  })
               }
               
            </div> )}
       </div>
   );
}
export default SearchBar;
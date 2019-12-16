import React, {useState} from 'react'

export default props => {
   const [value, setValue] = useState('')
   
   const valueChangeHandler = e => {
      setValue(e.target.value)
   }
   
   return (
      <div className="input-group mb-3 mt-3">
         <div className="input-group-prepend">
            <button 
               className="btn btn-outline-secondary"
            onClick={() => props.onSearch(value)}>Search</button>
         </div>
         <input type="text" 
                className="form-control" 
                value={value} 
                onChange={valueChangeHandler}/>
      </div>
   )
}
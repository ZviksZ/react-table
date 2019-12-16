import React, {Component} from 'react';
import DetailRowView      from "./DetailRowView/DetailRowView";
import Loader             from "./Loader/Loader";
import Table              from "./Table/Table";
import _                  from 'lodash'

class App extends Component {

   state = {
      isLoading: true,
      data: [],
      sort: 'asc', //desc
      sortField: 'id', 
      row: null
   }

   async componentDidMount() {
      const response = await fetch(`http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D`)
      const data = await response.json()     
      
      
      this.setState({
         data: _.orderBy(data,  this.state.sortField, this.state.sort),
         isLoading: false
      })
   }

   onSort = sortField => {
      const clonedData = this.state.data.concat()
      const sortType = this.state.sort === 'asc' ? 'desc' : 'asc'
      
      const orderedDate = _.orderBy(clonedData, sortField, sortType);

      this.setState({
         data: orderedDate,
         sort: sortType,
         sortField
      })
   }

   onRowSelect = row => {
      this.setState({
         row
      })
   }

   render() {
      const {isLoading, data, sort, sortField, row} = this.state
      
      return (
         <div className="container">
            {isLoading
               ? <Loader/>
               : <Table
                  onSort={this.onSort}
                  data={data}
                  sort={sort}
                  sortField={sortField}
                  onRowSelect={this.onRowSelect}
               />
            }
            {
              row 
               ? <DetailRowView person={row} />
               : null
            }

         </div>
      )
   }


}

export default App;

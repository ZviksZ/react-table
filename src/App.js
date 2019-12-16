import React, {Component} from 'react';
import ReactPaginate      from 'react-paginate';
import DetailRowView      from "./DetailRowView/DetailRowView";
import Loader             from "./Loader/Loader";
import ModeSelector       from "./ModeSelector/ModeSelector";
import Table              from "./Table/Table";
import TableSearch        from "./TableSearch/TableSearch";
import _                  from 'lodash'

class App extends Component {

   state = {
      isModeSelected: false,
      isLoading: false,
      data: [],
      search: '',
      sort: 'asc', //desc
      sortField: 'id',
      row: null,
      currentPage: 0
   }

   async fetchData(url) {
      const {sortField, sort} = this.state
      const response = await fetch(url)
      const data = await response.json()

      this.setState({ data: _.orderBy(data, sortField, sort), isLoading: false })
   }

   onSort = sortField => {
      const clonedData = [...this.state.data]
      const sort = this.state.sort === 'asc' ? 'desc' : 'asc'
      const data = _.orderBy(clonedData, sortField, sort);
      
      this.setState({data, sort, sortField})
   }

   onRowSelect = row => {
      this.setState({row})
   }
   pageChangeHandler = ({selected}) => {
      this.setState({currentPage: selected})
   }
   modeSelectHandler = url => {
      this.setState({ isModeSelected: true, isLoading: true })
      this.fetchData(url)
   }

   searchHandler = search => {
      this.setState({ search, currentPage: 0 })
   }

   getFilteredData() {
      const {data, search}= this.state
      if (!search) {
         return data
      } 
      return data.filter(item => {
         return item['firstName'].toLowerCase().includes(search.toLowerCase()) 
            || item['lastName'].toLowerCase().includes(search.toLowerCase()) 
            || item['email'].toLowerCase().includes(search.toLowerCase()) 
            || item['id'].toString().includes(search.toLowerCase()) 
            || item['phone'].toString().includes(search.toLowerCase()) 
      })
   }

   render() {
      const pageSize = 50;
      const {isModeSelected, isLoading, sort, sortField, row, currentPage} = this.state;
      const filteredData = this.getFilteredData()
      const pagesCount = Math.ceil(filteredData.length / pageSize)
      const displayData = _.chunk(filteredData, pageSize)[currentPage]
      
      if (!isModeSelected) {
         return (
            <div className="container">
               <ModeSelector onSelect={this.modeSelectHandler}/>
            </div>
         )
      }
      return (
         <div className="container">
            {isLoading
               ? <Loader/>
               : <>
                  <TableSearch onSearch={this.searchHandler}/>
                  <Table
                     onSort={this.onSort}
                     data={displayData}
                     sort={sort}
                     sortField={sortField}
                     onRowSelect={this.onRowSelect}
                  />
               </>
            }
            {
               this.state.data.length > pageSize
               && <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={pagesCount}
                  forcePage={currentPage}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.pageChangeHandler}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  pageClassName={'page-item'}
                  previousClassName={'page-item'}
                  nextClassName={'page-item'}
                  pageLinkClassName={'page-link'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
               />
            }
            {
               row
                  ? <DetailRowView person={row}/>
                  : null
            }

         </div>
      )
   }


}

export default App;

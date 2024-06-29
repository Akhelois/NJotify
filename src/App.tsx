import { useEffect, useState } from 'react'
import './App.css'
import GojekLogo from './assets/GojekLogo.svg'
import OpeningImage from './assets/careers-banner.svg'
import {CareerType, TableList} from './components/TableList'

function App() {
  const careerList = [{
    'title' : "Software Engineer",
    'department' : "ODS - Region",
    'location' : "Malang"
  }, 
  {
    'title' : "Account Executive (Malang)",
    'department' : "Finance",
    'location' : "Jakarta"
  },
  {
    'title' : "Social Media Lead",
    'department' : "Marketing",
    'location' : "Jakarta"
  }] 

  const [careerFetch, setCareerFetch] = useState<CareerType | null>(null)
  const [placeholdFetch, setPlaceholdFetch] = useState(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => {
        setPlaceholdFetch(json)
      })

      fetch('http://localhost:8080/careers')
      .then(response => response.json())
      .then(json => {
        setCareerFetch(json)
      })
  }, [])

  console.log(placeholdFetch)
  console.log(careerFetch)

  return (
    <>
      {/* <div id='main-bg'></div> */}
      <div id='main-container'>
        <div id='navbar'>
          <img src={GojekLogo} width={160} alt='Gojek Logo' />
        </div>
        <div id='main-content'>
          <img src={OpeningImage} width={380} alt='Banner Image' />
          <div id='text-content'>
            <div id='banner-main-text'>Hard to get into, <br /> harder to leave.</div>
            <div id='banner-sub-text'>(A chance to build Southeast Asia)</div>
          </div>
        </div>

        <div id='job-found'><b>93</b> open jobs found</div>
        <div id='open-position-table'>
          <div id='table-main-text'>Recent Open Position</div>
          <div id='table-grid'>
            <div className='table-header'>Job Title</div>
            <div className='table-header'>Department</div>
            <div className='table-header'>Location</div>
          </div>

          {/* Repeat This */}
          {careerList.map((career, key) => {
            return(
              <TableList career={career} key={key} />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App

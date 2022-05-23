import React, { useEffect, useState } from "react";
import { createSearchParams, useSearchParams,useNavigate } from "react-router-dom";
import "./style.css";
import axios from "axios";

const Table = () => {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);

  const [input, setInput] = useState("04-05-2022");

  const [filter, setFilter] = useState("");

  const [date,setNewDate]=useState('');

  const [api, setApi] = useState(
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=07-05-2022"
  );

  const handleChange = () => {
    const loc = new URL(api);
    let searchParams = new URL(api).search;
    let newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.get("date")) {
      const day = input.slice(0, 2);
      const month = input.slice(3, 5);

      if (month > 12 || day > 31) {
        alert("Enter Valid date");
        console.log(day);
      } else {
        setNewDate(input);
        newSearchParams.set("date", input);
      setApi(loc.origin + loc.pathname + "?" + newSearchParams.toString());
      const urln =
        loc.origin +
        "/api/v2/appointment/sessions/public/calendarByDistrict" +
        "?" +
      newSearchParams.toString();
      console.log("new", urln);

      //3 options
      setSearchParams(createSearchParams(urln));
      setSearchParams(createSearchParams({date:input}));
      navigate(`?${urln}`);

      setApi(urln);
      console.log(newSearchParams.get("date"), "DATE");
      }
      
    }

  };

  const loadData = ()=>{
    axios.get(api).then((response) => {
      console.log("Data", response.data.centers);
      setUsers(response.data.centers);
    });
  }

  const handleInputChange = (e)=>{
    const data = e.target.value;
    setFilter(data)
    console.log(data);
    if(data!=""){
    const filterData = users.filter((ent)=>ent.name.includes(data))
    console.log(filterData,"FIlter");
    setUsers(filterData)
    }
    else if (data=="") {
      loadData()
    }
  }


  useEffect(() => {
    loadData()

  }, [api,input]);

  return (
    <>
    <div className="container">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleChange}>Go</button>
      <input placeholder="Search" value={filter} onChange={handleInputChange}/>
      </div>
      <div className="container">
        <table>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Vaccine</th>
            <th>Available Capacity</th>
            <th>Slots</th>
          </tr>
          {users.map((vaccine) => {
            return (
              <tr>
                <td>{users.indexOf(vaccine) + 1}</td>
                <td>{vaccine.name}</td>
                <td>{vaccine.sessions[0].vaccine}</td>
                <td>{vaccine.sessions[0].available_capacity}</td>
                <td>{vaccine.sessions[0].slots[0].time}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Table;

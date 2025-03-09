const { getIndiaState, getIndiaDistrict } = require("india-state-district");
const { getCities } = require("state_city_pincode");
import { useState } from "react";
const { pincodeList } = require("state_city_pincode");

type StateProps = {
  state:string,
  code:string
}
export const LocationHelper = () => {
  const [states] = useState<StateProps[]>(getIndiaState());
  const [districts, setdistricts] = useState([]);
  const [cities, setCities] = useState([]); // Cities for the selected state
  const [pincodes, setPincodes] = useState([]); // Pincodes for the selected city

  const getDistrict = (state: string) => {
    const districts = getIndiaDistrict(state);
    setdistricts(districts);
  };

  const fetchCities = (state: string) => {
    const cities = getCities(state); // Replace with your city-fetching function
    setCities(cities);
  };

  const getDistrictByStateName = (state:string) => {
    const state_code = states.find((value:StateProps)=>value.state===state);
    if (state_code) {
      getDistrict(state_code.code)
    }
  }
  // Fetch pincodes based on city
  const fetchPincodes = (state: string, city: string) => {
    const pincodes = pincodeList(state, city);
    setPincodes(pincodes);
  };
  return {
    states,
    districts,
    cities,
    pincodes,
    getDistrict,
    fetchCities,
    fetchPincodes,
    getDistrictByStateName
  };
};

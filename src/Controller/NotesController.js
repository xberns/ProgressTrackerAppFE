import axios from "axios";
const baseURL = 'https://localhost:7270';

export function postNotes(params) {
  return axios.post(baseURL + "/api/Notes", params)
    .then(res => res.data)
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}

export function getNotes(params) {
   console.log('paaramas before getNotes:', params);
 axios.get(baseURL + "/api/Notes",  { params})
    .then(res => {
      console.log('res dataa:', res.data[0]); // or res.data if you only want the payload
      return res.data[0];
    })
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}


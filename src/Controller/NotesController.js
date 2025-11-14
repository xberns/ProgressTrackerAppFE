import axios from "axios";
const baseURL = "https://localhost:7270";

export function postNotes(params) {
  return axios
    .post(baseURL + "/api/Notes/PostNote", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function updateNotes(params) {
  return axios
    .put(baseURL + "/api/Notes/UpdateNote", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function getNotes(params) {
  return axios
    .get(baseURL + "/api/Notes/GetNote", { params })
    .then((res) => {
      if (res.data.note) {
        return res.data;
      }
      return res.data[0];
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function deleteNotes(params) {
  return axios
    .delete(baseURL + "/api/Notes/DeleteNote", { params })
    .then((res) => res.data[0])
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

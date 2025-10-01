import axios from "axios";
const baseURL = "https://localhost:7270";

export function postTaskContents(params) {
  return axios
    .post(baseURL + "/api/Task/SaveTaskContent", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function updateTasksOrder(params) {
  console.log(params, " this is params");
  return axios
    .put(baseURL + "/api/Task/UpdateTasksOrder", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function updateTaskContents(params) {
  return axios
    .put(baseURL + "/api/Notes", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function getTaskContents(params) {
  return axios
    .get(baseURL + "/api/Task/GetTaskContent", { params })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}
export function updateStatus(params) {
  return axios
    .put(baseURL + "/api/Task/UpdateTaskContentStatus", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function deleteNotes(params) {
  return axios
    .delete(baseURL + "/api/Notes", { params })
    .then((res) => res.data[0])
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

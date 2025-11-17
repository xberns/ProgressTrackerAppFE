import axios from "axios";
const baseURL = "https://localhost:7270";

export function getTaskTitle(param) {
  return axios
    .get(baseURL + "/api/Task/GetTaskTitle", { params: param })
    .then((res) => {
      console.log("res:", res);
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function postTaskTitle(params) {
  return axios
    .post(baseURL + "/api/Task/AddNewTaskTitle", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function modifyTaskTitle(params) {
  return axios
    .put(baseURL + "/api/Task/ModTaskTitle", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function deleteTaskTitle(param) {
  return axios
    .delete(baseURL + "/api/Task/DeleteTasksTitle", { params: param })
    .then((res) => res.data[0])
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

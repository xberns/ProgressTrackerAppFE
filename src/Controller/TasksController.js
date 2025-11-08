import axios from "axios";
const baseURL = "https://localhost:7270";

export function getTaskContents(params) {
  return axios
    .get(baseURL + "/api/Task/GetTaskContent", { params })
    .then((res) => {
      if (res.data.task) {
        return res.data.task;
      }
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function postTaskContents(params) {
  return axios
    .post(baseURL + "/api/Task/AddNewTaskContent", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function modifyTaskContent(params) {
  return axios
    .put(baseURL + "/api/Task/ModTaskContent", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function deleteTaskContent(params) {
  return axios
    .delete(baseURL + "/api/Task/DeleteTasksContent", {
      data: params,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data[0])
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function updateTasksOrder(params) {
  return axios
    .put(baseURL + "/api/Task/UpdateTasksOrder", params)
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

export function getAllSubTask(params) {
  return axios
    .get(baseURL + "/api/Task/GetAllSubTask", { params })
    .then((res) => {
      if (res.data.subtask) {
        console.log(res, " this is  res from api", res.data.subtask);
        return res.data.subtask;
      }
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function getSubTask(params) {
  return axios
    .get(baseURL + "/api/Task/GetSubTask", { params })
    .then((res) => {
      if (res.data.subtask) {
        return res.data.subtask;
      }
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function postSubTask(params) {
  return axios
    .post(baseURL + "/api/Task/AddNewSubTask", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function modifySubTask(params) {
  return axios
    .put(baseURL + "/api/Task/ModSubTask", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function deleteSubTask(params) {
  return axios
    .delete(baseURL + "/api/Task/DeleteSubTask", {
      data: params,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data[0])
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function updateSubTasksOrder(params) {
  return axios
    .put(baseURL + "/api/Task/UpdateSubTasksOrder", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

export function updateSubTaskStatus(params) {
  return axios
    .put(baseURL + "/api/Task/UpdateSubTaskStatus", params)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

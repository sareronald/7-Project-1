// Globals
let yearGroups = [];
let notices = [];
let canteenItems = [];
let activities = [];
const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";

// Elements
const yearGroupNameEl = document.getElementById("yearGroupName");
const confirmYearGroupEl = document.getElementById("confirmYearGroup");
const yearGroupListingEl = document.querySelector(".yearGroup-listing");
const noticeTextEl = document.getElementById("noticeText");
const confirmNoticeEl = document.getElementById("confirmNotice");
const noticeListingEl = document.querySelector(".notice-listing");
const alertContainerEl = document.querySelector(".alert-container");
const modalEl = document.querySelectorAll(".modal");
const timetableFormEl = document.querySelector(".timetable-form");
const confirmTimetableEl = document.getElementById("confirmTimetable");
const canteenItemNameEl = document.getElementById("canteenItemName");
const canteenItemPriceEl = document.getElementById("canteenItemPrice");
const canteenListingEl = document.querySelector(".canteen-listing");
const confirmCanteenEl = document.getElementById("confirmCanteen");
const activityNameEl = document.getElementById("activityName");
const activityLocationEl = document.getElementById("activityLocation");
const activityDateEl = document.getElementById("activityDate");
const activityTimeEl = document.getElementById("activityTime");
const activityListingEl = document.querySelector(".activities-listing");
const confirmActivityEl = document.getElementById("confirmActivity");

// Functions
const clearYearGroupResults = () => {
  yearGroups = [];
  yearGroupListingEl.innerHTML = "";
  yearGroupNameEl.value = "";
};

const clearNotices = () => {
  notices = [];
  noticeListingEl.innerHTML = "";
  noticeTextEl.value = "";
};

const clearCanteenItems = () => {
  canteenItems = [];
  canteenListingEl.innerHTML = "";
  canteenItemNameEl.value = "";
  canteenItemPriceEl.value = "";
};

const clearActivities = () => {
  activities = [];
  activityListingEl.innerHTML = "";
  activityNameEl.value = "";
  activityLocationEl.value = "";
  activityDateEl.value = "";
  activityTimeEl.value = "";
};

const clearAlert = () => {
  alertContainerEl.innerHTML = "";
};

const closeModal = () => {
  document.querySelector(".modal-backdrop").remove();
  modalEl.forEach((el) => {
    el.classList.remove("show");
  });
};

const clearTimetable = () => {
  timetableFormEl.innerHTML = "";
};

const alertHandler = (message, status) => {
  const alertEl = document.createElement("div");
  alertEl.setAttribute("role", "alert");
  switch (status) {
    case "ERROR":
      alertEl.setAttribute("class", "alert alert-danger");
      alertEl.textContent = `An error occured with status: ${message}`;
      break;
    case "SUCCESS":
      alertEl.setAttribute("class", "alert alert-success");
      alertEl.textContent = `Operation success with status: ${message}`;
      break;
    default:
      alertEl.setAttribute("class", "alert alert-primary");
      alertEl.textContent = message;
  }
  alertContainerEl.appendChild(alertEl);
};

const refreshAdmin = () => {
  clearYearGroupResults();
  clearNotices();
  clearCanteenItems();
  clearActivities();
  fetchData("NOTICE");
  fetchData("YEAR_GROUP");
  fetchData("CANTEEN");
  fetchData("ACTIVITIES");
};

const getCollection = (type) => {
  switch (type) {
    case "NOTICE":
      return "notices";
      break;
    case "CANTEEN":
      return "canteenItems";
      break;
    case "ACTIVITIES":
      return "activities";
      break;
    case "YEAR_GROUP":
      return "classes";
      break;
  }
};

const addHandler = (type) => {
  const collection = getCollection(type);
  let body = "";
  switch (type) {
    case "NOTICE":
      body = {
        noticeContent: noticeTextEl.value,
      };
      break;
    case "CANTEEN":
      body = {
        name: canteenItemNameEl.value,
        price: canteenItemPriceEl.value,
      };
      break;
    case "ACTIVITIES":
      body = {
        name: activityNameEl.value,
        location: activityLocationEl.value,
        date: activityDateEl.value,
        time: activityTimeEl.value,
      };
      break;
    case "YEAR_GROUP":
      body = {
        name: yearGroupNameEl.value,
        timetable: [],
      };
      break;
  }
  const queryUrl = apiUrlPrefix + `${collection}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    closeModal();
    refreshAdmin();
  });
};

// Delete handler
const deleteHandler = (id, type) => {
  const collection = getCollection(type);

  const queryUrl = apiUrlPrefix + `${collection}/${id}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "DELETE",
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    refreshAdmin();
  });
};

// Fetch data
const fetchData = (type) => {
  const collection = getCollection(type);
  const queryUrl = apiUrlPrefix + `${collection}.json` + apiSuffix;
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      for (let key in data) {
        switch (type) {
          case "NOTICE":
            notices.push({
              ...data[key],
              id: key,
            });
            break;
          case "CANTEEN":
            canteenItems.push({
              ...data[key],
              id: key,
            });
            break;
          case "ACTIVITIES":
            activities.push({
              ...data[key],
              id: key,
            });
            break;
          case "YEAR_GROUP":
            yearGroups.push({
              ...data[key],
              id: key,
            });
            break;
        }
      }
      renderData(type);
    });
};

// Output year groups
const createYearGroupRow = (yearGroup) => {
  const yearGroupRow = document.createElement("tr");
  const yearGroupName = document.createElement("td");
  yearGroupName.setAttribute("scope", "row");
  yearGroupName.textContent = yearGroup.name;
  const yearGroupConfig = document.createElement("td");
  yearGroupConfig.setAttribute("scope", "row");

  const yearGroupDelete = document.createElement("button");
  yearGroupDelete.setAttribute("class", "btn btn-sm btn-danger action");
  yearGroupDelete.setAttribute("id", "delete-button");
  yearGroupDelete.setAttribute("data-value", yearGroup.id);
  yearGroupDelete.textContent = "Delete";

  const manageTimetable = document.createElement("button");
  manageTimetable.setAttribute("class", "btn btn-sm btn-primary mr-1 action");
  manageTimetable.setAttribute("data-value", yearGroup.id);
  manageTimetable.setAttribute("id", "manageTimetable-button");
  manageTimetable.setAttribute("data-toggle", "modal");
  manageTimetable.setAttribute("data-target", "#timetableModal");
  manageTimetable.textContent = "Manage Timetable";

  yearGroupConfig.appendChild(manageTimetable);
  yearGroupConfig.appendChild(yearGroupDelete);
  yearGroupRow.appendChild(yearGroupName);
  yearGroupRow.appendChild(yearGroupConfig);
  yearGroupListingEl.appendChild(yearGroupRow);
};

// Output notices
const createNoticeRow = (notice) => {
  const noticeRow = document.createElement("tr");
  const noticeName = document.createElement("td");
  noticeName.setAttribute("scope", "row");
  noticeName.textContent = notice.noticeContent;
  const noticeConfig = document.createElement("td");
  noticeConfig.setAttribute("scope", "row");

  const noticeDelete = document.createElement("button");
  noticeDelete.setAttribute("class", "btn btn-sm btn-danger action");
  noticeDelete.setAttribute("id", "delete-button");
  noticeDelete.setAttribute("data-value", notice.id);
  noticeDelete.textContent = "Delete";

  noticeConfig.appendChild(noticeDelete);
  noticeRow.appendChild(noticeName);
  noticeRow.appendChild(noticeConfig);
  noticeListingEl.appendChild(noticeRow);
};

// Output canteen items
const createCanteenRow = (item) => {
  const canteenRowEl = document.createElement("tr");
  const canteenNameEl = document.createElement("td");
  canteenNameEl.setAttribute("scope", "row");
  canteenNameEl.textContent = item.name;
  const canteenPriceEl = document.createElement("td");
  canteenPriceEl.setAttribute("scope", "row");
  canteenPriceEl.textContent = item.price;
  const canteenConfigEl = document.createElement("td");
  canteenConfigEl.setAttribute("scope", "row");

  const canteenDeleteEl = document.createElement("button");
  canteenDeleteEl.setAttribute("class", "btn btn-sm btn-danger action");
  canteenDeleteEl.setAttribute("id", "delete-button");
  canteenDeleteEl.setAttribute("data-value", item.id);
  canteenDeleteEl.textContent = "Delete";

  canteenConfigEl.appendChild(canteenDeleteEl);
  canteenRowEl.appendChild(canteenNameEl);
  canteenRowEl.appendChild(canteenPriceEl);
  canteenRowEl.appendChild(canteenConfigEl);
  canteenListingEl.appendChild(canteenRowEl);
};

// Output activities
const createActivityRow = (item) => {
  const activityItemRowEl = document.createElement("tr");
  const activityItemNameEl = document.createElement("td");
  activityItemNameEl.setAttribute("scope", "row");
  activityItemNameEl.textContent = item.name;
  const activityItemLocationEl = document.createElement("td");
  activityItemLocationEl.setAttribute("scope", "row");
  activityItemLocationEl.textContent = item.location;
  const activityItemDateEl = document.createElement("td");
  activityItemDateEl.setAttribute("scope", "row");
  activityItemDateEl.textContent = item.date;
  const activityItemTimeEl = document.createElement("td");
  activityItemTimeEl.setAttribute("scope", "row");
  activityItemTimeEl.textContent = item.time;
  const activityItemConfigEl = document.createElement("td");
  activityItemConfigEl.setAttribute("scope", "row");

  const activityItemDeleteEl = document.createElement("button");
  activityItemDeleteEl.setAttribute("class", "btn btn-sm btn-danger action");
  activityItemDeleteEl.setAttribute("id", "delete-button");
  activityItemDeleteEl.setAttribute("data-value", item.id);
  activityItemDeleteEl.textContent = "Delete";

  activityItemConfigEl.appendChild(activityItemDeleteEl);
  activityItemRowEl.appendChild(activityItemNameEl);
  activityItemRowEl.appendChild(activityItemLocationEl);
  activityItemRowEl.appendChild(activityItemDateEl);
  activityItemRowEl.appendChild(activityItemTimeEl);
  activityItemRowEl.appendChild(activityItemConfigEl);
  activityListingEl.appendChild(activityItemRowEl);
};

// Render data
const renderData = (type) => {
  switch (type) {
    case "NOTICE":
      notices.forEach((notice) => {
        createNoticeRow(notice);
      });
      break;
    case "CANTEEN":
      canteenItems.forEach((item) => {
        createCanteenRow(item);
      });
      break;
    case "ACTIVITIES":
      activities.forEach((item) => {
        createActivityRow(item);
      });
      break;
    case "YEAR_GROUP":
      yearGroups.forEach((yearGroup) => {
        createYearGroupRow(yearGroup);
      });
      break;
  }
};

const getTimetableById = (id) => {
  const timetable = yearGroups.find((element) => element.id === id);
  if (timetable.timetable) {
    return timetable.timetable;
  } else {
    const tempTimetable = [];
    for (i = 0; i < 8; i++) {
      tempTimetable.push("Free Block");
    }
    return tempTimetable;
  }
};

// Manage timetable handler
const manageTimetableHandler = (id) => {
  const timetable = getTimetableById(id);
  clearTimetable();
  for (i = 0; i < 8; i++) {
    const timeValue = i + 9;
    const timeValueName = `time-${timeValue}`;
    const timeRowEl = document.createElement("div");
    timeRowEl.classList.add("row", "cq-row");
    const nameColEl = document.createElement("div");
    nameColEl.classList.add("col-md-6");
    const timeLabelEl = document.createElement("label");
    timeLabelEl.setAttribute("for", timeValueName);
    timeLabelEl.textContent = `${timeValue}:00`;
    const timeInputColEl = document.createElement("div");
    timeInputColEl.classList.add("col-md-6");
    const timeInputEl = document.createElement("input");
    timeInputEl.setAttribute("type", "text");
    timeInputEl.setAttribute("id", timeValueName);
    timeInputEl.classList.add("form-control");
    timetable[i]
      ? (timeInputEl.value = timetable[i])
      : (timeInputEl.value = "Free Block");

    timeInputColEl.appendChild(timeInputEl);
    nameColEl.appendChild(timeLabelEl);
    timeRowEl.appendChild(nameColEl);
    timeRowEl.appendChild(timeInputColEl);
    timetableFormEl.appendChild(timeRowEl);
  }
  confirmTimetableEl.setAttribute("data-value", id);
};

const saveTimetableHandler = (id) => {
  const updatedTimetable = {
    timetable: [],
  };
  const offset = 9;
  for (i = 0; i < 8; i++) {
    updatedTimetable.timetable.push(
      document.getElementById(`time-${i + offset}`).value
    );
  }

  const queryUrl = apiUrlPrefix + "classes/" + `${id}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "PATCH",
    body: JSON.stringify(updatedTimetable),
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    closeModal();
    refreshAdmin();
  });
};

// Event listeners
confirmTimetableEl.addEventListener("click", (event) => {
  event.preventDefault();
  saveTimetableHandler(event.target.getAttribute("data-value"));
});

confirmYearGroupEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("YEAR_GROUP");
});

confirmNoticeEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("NOTICE");
});

confirmCanteenEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("CANTEEN");
});

confirmActivityEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("ACTIVITIES");
});

noticeListingEl.addEventListener("click", (event) => {
  if (event.target.id === "delete-button") {
    deleteHandler(event.target.getAttribute("data-value"), "NOTICE");
  }
});

canteenListingEl.addEventListener("click", (event) => {
  if (event.target.id === "delete-button") {
    deleteHandler(event.target.getAttribute("data-value"), "CANTEEN");
  }
});

activityListingEl.addEventListener("click", (event) => {
  if (event.target.id === "delete-button") {
    deleteHandler(event.target.getAttribute("data-value"), "ACTIVITIES");
  }
});

yearGroupListingEl.addEventListener("click", (event) => {
  switch (event.target.id) {
    case "manageTimetable-button":
      manageTimetableHandler(event.target.getAttribute("data-value"));
      break;
    case "delete-button":
      deleteHandler(event.target.getAttribute("data-value"), "YEAR_GROUP");
      break;
  }
});

alertContainerEl.addEventListener("click", () => {
  clearAlert();
});

// Main Program
fetchData("YEAR_GROUP");
fetchData("NOTICE");
fetchData("CANTEEN");
fetchData("ACTIVITIES");

// Testing
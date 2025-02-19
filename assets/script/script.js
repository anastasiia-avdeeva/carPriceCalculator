const carForm = document.forms.carForm;
const makeInput = carForm.elements.make;
const makeError = document.getElementById("makeError");
const modelInput = carForm.elements.model;
const modelError = document.getElementById("modelError");
const fuelInput = carForm.elements.fuel;
const fuelError = document.getElementById("fuelError");
const volumeInput = carForm.elements.engineVolume;
const volumeError = document.getElementById("engineVolumeError");
const transmissionInput = carForm.elements.transmission;
const transmissionError = document.getElementById("transmissionError");

const models = {
  Renault: ["Renault Duster", "Renault Megane", "Renault Arkana"],
  Opel: ["Opel Astra", "Opel Insignia", "Opel Mokka"],
  Mazda: ["Mazda 3", "Mazda CX-5", "Mazda 6"],
  Jaguar: ["Jaguar F-type", "Jaguar XE", "Jaguar F-Pace"],
};

const formValidity = {
  make: false,
  model: false,
  fuel: false,
  volume: false,
  transmission: false,
  condition: false,
  payment: false,
};

// const formValues = {
//   make: undefined,
//   model: undefined,
//   fuel: undefined,
//   volume: undefined,
//   transmission: undefined,
//   condition: undefined,
//   payment: undefined,
// }

const errorMsgs = {
  noMakeErrorMsg: "Пожалуйста, выберите марку автомобиля",
  noModelErrorMsg: "Пожалуйста, выберите модель автомобиля",
  noFuelErrorMsg: "Пожалуйста, выберите тип топлива",
  noVolumeErrorMsg: "Пожалуйста, введите объем двигателя",
  invalidVolumeErrorMsg:
    "Объем двигателя не может быть меньше 1.1 литра и больше 3.5 литра",
  noTransmissionErrorMsg: "Пожалуйста, выберите тип коробки передач",
};

function updateValidity(key, isValid) {
  formValidity[key] = isValid;
}

function toggleDisabledState(element, disable = true) {
  disable
    ? element.setAttribute("disabled", true)
    : element.removeAttribute("disabled");
}

function hideOrShowElem(elem, hide = true) {
  hide ? (elem.display = "none") : (elem.display = "block");
}

function pasteMsg(element, message) {
  element.textContent = message;
}

function toggleErrorMsg(condition, element, msg) {
  if (condition) {
    pasteMsg(element, "");
    hideOrShowElem(element);
  } else {
    pasteMsg(element, msg);
    hideOrShowElem(element, false);
  }
}

function createModelOption(model) {
  const option = document.createElement("option");
  const className = "form__option";
  option.classList.add(className);
  option.value = model;
  option.textContent = model;
  modelInput.append(option);
}

function showModels(make) {
  models[make].forEach((item) => createModelOption(item));
  toggleDisabledState(modelInput, false);
}

// function processMakeChange() {
//   showModels(makeInput.value);
//   toggleErrorMsg(true, makeError, "");
//   if (!formValidity["make"]) {
//     updateValidity("make", true);
//   }
// }

// function processModelChange() {
//   toggleErrorMsg(true, modelError, "");
//   if (!formValidity["model"]) {
//     updateValidity("model", true);
//   }
// }

// function processFuelChange() {
//   toggleErrorMsg(true, fuelError, "");
//   if (!formValidity["fuel"]) {
//     updateValidity("fuel", true);
//   }
// }

function isVolumeValid() {
  const volume = volumeInput.value;
  let valid = true;
  let msg = "";

  if (!volume) {
    valid = false;
    msg = errorMsgs["noVolumeErrorMsg"];
  } else if (!volumeInput.checkValidity()) {
    valid = false;
    msg = errorMsgs["invalidVolumeErrorMsg"];
  }

  return [valid, msg];
}

function processVolumeChange() {
  //   const volume = Number(volumeStr);
  const [valid, msg] = isVolumeValid();
  toggleErrorMsg(valid, volumeError, msg);
  updateValidity("volume", valid);
}

// function processTransmissionChange() {
//   toggleErrorMsg(true, transmissionError, "");
//   if (!formValidity["transmission"]) {
//     updateValidity("transmission", true);
//   }
// }

function processRadioOrSelectChange(errorElem, name) {
  if (name === "make") {
    showModels(makeInput.value);
  }
  toggleErrorMsg(true, errorElem, "");
  if (!formValidity[name]) {
    updateValidity(name, true);
  }
}

function processFormChange(evt) {
  const input = evt.target;
  const inputTypeHandlers = new Map([
    ["make", () => processRadioOrSelectChange(makeError, "make")],
    ["model", () => processRadioOrSelectChange(modelError, "model")],
    ["fuel", () => processRadioOrSelectChange(fuelError, "fuel")],
    ["engineVolume", () => processVolumeChange()],
    [
      "transmission",
      () => processRadioOrSelectChange(transmissionError, "transmission"),
    ],
  ]);

  if (inputTypeHandlers.has(input.name)) {
    inputTypeHandlers.get(input.name)();
  } else {
    return;
  }
}

carForm.addEventListener("change", processFormChange);

let price = 0;
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
const conditionInput = carForm.elements.carCondition;
const conditionError = document.getElementById("conditionError");
const ownersField = document.getElementById("ownersField");
const ownersInput = carForm.elements.numOfOwners;
const ownersError = document.getElementById("ownersError");
const paymentInput = carForm.elements.payment;
const paymentError = document.getElementById("paymentError");

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
  carCondition: false,
  payment: false,
};

const errorMsgs = {
  noMakeErrorMsg: "Пожалуйста, выберите марку автомобиля",
  noModelErrorMsg: "Пожалуйста, выберите модель автомобиля",
  noFuelErrorMsg: "Пожалуйста, выберите тип топлива",
  noVolumeErrorMsg: "Пожалуйста, введите объем двигателя",
  invalidVolumeErrorMsg:
    "Объем двигателя не может быть меньше 1.1 литра и больше 3.5 литра",
  noTransmissionErrorMsg: "Пожалуйста, выберите тип коробки передач",
  noConditionErrorMsg: "Пожалуйста, выберите состояние автомобиля",
  noOwnersErrorMsg: "Пожалуйстаб выберите количество предыдущих владельцев",
  noPaymentErrorMsg: "Пожалуйста, выберите способ оплаты",
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
  hide ? (elem.style.display = "none") : (elem.style.display = "block");
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
  const [valid, msg] = isVolumeValid();
  toggleErrorMsg(valid, volumeError, msg);
  updateValidity("volume", valid);
}

function isChecked(nodeList) {
  const array = Array.from(nodeList);
  const isChecked = array.some((input) => input.checked);
  return isChecked;
}

function toggleOwnersState(conditionValue) {
  if (conditionValue === "used") {
    hideOrShowElem(ownersField, false);
    formValidity.numOfOwners = isChecked(ownersInput);
  } else if (conditionValue === "new") {
    hideOrShowElem(ownersField);
    delete formValidity.numOfOwners;
  }
}

function processRadioOrSelectChange(errorElem, name) {
  if (name === "make") {
    showModels(makeInput.value);
  } else if (name === "carCondition") {
    toggleOwnersState(conditionInput.value);
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
    [
      "carCondition",
      () => processRadioOrSelectChange(conditionError, "carCondition"),
    ],
    [
      "numOfOwners",
      () => processRadioOrSelectChange(ownersError, "numOfOwners"),
    ],
    ["payment", () => processRadioOrSelectChange(paymentError, "payment")],
  ]);

  if (inputTypeHandlers.has(input.name)) {
    inputTypeHandlers.get(input.name)();
  } else {
    return;
  }
}

carForm.addEventListener("change", processFormChange);

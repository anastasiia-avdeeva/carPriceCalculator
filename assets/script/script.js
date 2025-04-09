// let price = 0;
const carPriceInfo = {
  basePrice: 0,
  fuel: 1,
  volume: 1,
  transmission: 0,
  condition: 1,
  owners: 1,
};

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

const priceResultElem = document.getElementById("priceResult");

const models = {
  Renault: ["Renault Duster", "Renault Megane", "Renault Arkana"],
  Opel: ["Opel Astra", "Opel Insignia", "Opel Mokka"],
  Mazda: ["Mazda 3", "Mazda CX-5", "Mazda 6"],
  Jaguar: ["Jaguar F-type", "Jaguar XE", "Jaguar F-Pace"],
};

const basePrices = {
  "Renault Duster": 1200000,
  "Renault Megane": 1400000,
  "Renault Arkana": 1450000,
  "Opel Astra": 1000000,
  "Opel Insignia": 1400000,
  "Opel Mokka": 1300000,
  "Mazda 3": 1300000,
  "Mazda CX-5": 2000000,
  "Mazda 6": 1600000,
  "Jaguar F-type": 5000000,
  "Jaguar XE": 2500000,
  "Jaguar F-Pace": 3500000,
};

const fuelPriceFactor = {
  petrol: 1.0,
  diesel: 1.05,
  gas: 0.95,
  electricity: 1.2,
};

const engVolPriceFactor = {
  1.6: 1.0,
  2.0: 1.1,
  2.5: 1.2,
  3.5: 1.3,
};

const transmissionPriceChange = {
  manual: 0,
  automatic: 50000,
  cvt: 30000,
};

const conditionPriceFactor = {
  new: 1.0,
  used: 0.75,
};

const numOfOwnersPriceFactor = {
  "1-2": 1.0,
  "3+": 0.9,
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
  noOwnersErrorMsg: "Пожалуйста, выберите количество предыдущих владельцев",
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
  modelInput.innerHTML = "";
  models[make].forEach((item) => createModelOption(item));
  toggleDisabledState(modelInput, false);
}

function calculatePrice() {
  const { basePrice, fuel, volume, transmission, condition, owners } =
    carPriceInfo;
  const price = basePrice * fuel * volume + transmission * condition * owners;
  priceResultElem.textContent = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "rub",
  }).format(price);
}

function updateCarPriceInfo(key, value) {
  carPriceInfo[key] = value;
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
  switch (name) {
    case "make":
      showModels(makeInput.value);
      return;

    case "model":
      updateCarPriceInfo("basePrice", basePrices[modelInput.value]);
      break;

    case "fuel":
      updateCarPriceInfo("fuel", fuelPriceFactor[fuelInput.value]);
      break;

    case "carCondition":
      toggleOwnersState(conditionInput.value);
  }

  calculatePrice();
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

function submitForm(evt) {
  evt.preventDefault();
  // check if all inputs are valid
  regForm.reset();
}

carForm.addEventListener("change", processFormChange);
carForm.addEventListener("submit", submitForm);

const carForm = document.forms.carForm;
let price;

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

const resetBtn = document.getElementById("resetBtn");
const priceParElem = document.getElementById("pricePar");
const priceResultElem = document.getElementById("priceResult");

const models = {
  Renault: ["Renault Duster", "Renault Megane", "Renault Arkana"],
  Opel: ["Opel Astra", "Opel Insignia", "Opel Mokka"],
  Mazda: ["Mazda 3", "Mazda CX-5", "Mazda 6"],
  Jaguar: ["Jaguar F-type", "Jaguar XE", "Jaguar F-Pace"],
};

const initialCarPriceInfo = {
  basePrice: 0,
  fuel: 1,
  volume: 1,
  transmission: 0,
  condition: 1,
  owners: 1,
  payment: 1,
};

let carPriceInfo = { ...initialCarPriceInfo };

const initialFormValidity = {
  make: false,
  model: false,
  fuel: false,
  volume: false,
  transmission: false,
  carCondition: false,
  payment: false,
};

let formValidity = { ...initialFormValidity };

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
  factor1: 1.0,
  factor2: 1.1,
  factor3: 1.2,
  factor4: 1.3,
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

const ownersStates = {
  USED: "used",
  NEW: "new",
};

const numOfOwnersPriceFactor = {
  "1-2": 1.0,
  "3+": 0.9,
};

const paymentPriceFactor = { card: 1, cash: 0.95, invoice: 1.05 };

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

carForm.addEventListener("change", processFormChange);

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
  ["numOfOwners", () => processRadioOrSelectChange(ownersError, "numOfOwners")],
  ["payment", () => processRadioOrSelectChange(paymentError, "payment")],
]);

function processFormChange(evt) {
  hideOrShowElem(priceParElem);
  const input = evt.target;
  if (inputTypeHandlers.has(input.name)) {
    inputTypeHandlers.get(input.name)();
  } else {
    return;
  }
}

function hideOrShowElem(elem, hide = true) {
  hide ? (elem.style.display = "none") : (elem.style.display = "block");
}

const priceInfoUpdaters = {
  model: () => updateCarPriceInfo("basePrice", basePrices[modelInput.value]),
  fuel: () => updateCarPriceInfo("fuel", fuelPriceFactor[fuelInput.value]),
  transmission: () =>
    updateCarPriceInfo(
      "transmission",
      transmissionPriceChange[transmissionInput.value]
    ),
  carCondition: () => {
    updateCarPriceInfo("condition", conditionPriceFactor[conditionInput.value]);
    toggleOwnersState(conditionInput.value);
  },
  numOfOwners: () =>
    updateCarPriceInfo("owners", numOfOwnersPriceFactor[ownersInput.value]),
  payment: () =>
    updateCarPriceInfo("payment", paymentPriceFactor[paymentInput.value]),
};

function processRadioOrSelectChange(errorElem, name) {
  if (name === "make") {
    handleModelChange();
  }

  const updater = priceInfoUpdaters[name];
  if (updater) {
    updater();
    calculatePrice();
  }

  toggleErrorMsg(true, errorElem, "");
  if (!formValidity[name]) {
    updateValidity(name, true);
  }
}

function handleModelChange() {
  showModels(makeInput.value);
  carPriceInfo.basePrice = 0;
  updateValidity("model", false);
}

function createModelOption(model, placeholder = true) {
  const option = document.createElement("option");
  const className = "form__option";
  option.classList.add(className);
  if (placeholder) {
    option.value = "";
    option.setAttribute("disabled", true);
    option.setAttribute("selected", true);
    option.textContent = "-- Выберите модель автомобиля --";
  } else {
    option.value = model;
    option.textContent = model;
  }
  return option;
}

function showModels(make) {
  modelInput.innerHTML = "";
  modelInput.append(createModelOption("", true));
  models[make].forEach((item) =>
    modelInput.append(createModelOption(item, false))
  );
  toggleDisabledState(modelInput, false);
}

function toggleDisabledState(element, disable = true) {
  disable
    ? element.setAttribute("disabled", true)
    : element.removeAttribute("disabled");
}

function updateCarPriceInfo(key, value) {
  carPriceInfo[key] = value;
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

function calculatePrice() {
  const { basePrice, fuel, volume, transmission, condition, owners, payment } =
    carPriceInfo;
  price =
    basePrice * fuel * volume * condition * owners * payment + transmission;
}

function updateValidity(key, isValid) {
  formValidity[key] = isValid;
}

function processVolumeChange() {
  const volume = volumeInput.value;
  const [valid, msg] = isVolumeValid(volume);
  if (valid) {
    updateCarPriceInfo("volume", calcVolumePriceFactor(volume));
    calculatePrice();
  }
  updateValidity("volume", valid);
  toggleErrorMsg(valid, volumeError, msg);
}

function isVolumeValid(volume) {
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

function calcVolumePriceFactor(volume) {
  if (volume <= 1.6) {
    return engVolPriceFactor.factor1;
  } else if (volume <= 2.0) {
    return engVolPriceFactor.factor2;
  } else if (volume <= 2.5) {
    return engVolPriceFactor.factor3;
  } else {
    return engVolPriceFactor.factor4;
  }
}

function toggleOwnersState(conditionValue) {
  if (conditionValue === ownersStates.USED) {
    hideOrShowElem(ownersField, false);
    formValidity.numOfOwners = true;
  } else if (conditionValue === ownersStates.NEW) {
    hideOrShowElem(ownersField);
    delete formValidity.numOfOwners;
  }
}

carForm.addEventListener("submit", submitForm);

function submitForm(evt) {
  evt.preventDefault();
  if (isFormFilled()) {
    showPrice();
    return;
  }
  showMissingFields();
}

function isFormFilled() {
  return Object.values(formValidity).every((value) => !!value);
}

function showPrice() {
  priceResultElem.textContent = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "rub",
  }).format(price);
  hideOrShowElem(priceParElem, false);
}

const fieldErrors = {
  make: [makeError, errorMsgs.noMakeErrorMsg],
  model: [modelError, errorMsgs.noModelErrorMsg],
  fuel: [fuelError, errorMsgs.noFuelErrorMsg],
  volume: [volumeError, errorMsgs.noVolumeErrorMsg],
  transmission: [transmissionError, errorMsgs.noTransmissionErrorMsg],
  carCondition: [conditionError, errorMsgs.noConditionErrorMsg],
  numOfOwners: [ownersError, errorMsgs.noOwnersErrorMsg],
  payment: [paymentError, errorMsgs.noPaymentErrorMsg],
};

function showMissingFields() {
  for (let field in formValidity) {
    if (!formValidity[field] && fieldErrors[field]) {
      const [erElem, erMsg] = fieldErrors[field];
      toggleErrorMsg(false, erElem, erMsg);
    }
  }
}

resetBtn.addEventListener("click", resetForm);

function resetForm() {
  carForm.reset();
  deleteAllErrors();
  toggleOwnersState(ownersStates.NEW);
  hideOrShowElem(priceParElem);
  resetObject(carPriceInfo, initialCarPriceInfo);
  resetObject(formValidity, initialFormValidity);
  return;
}

function deleteAllErrors() {
  for (let field in fieldErrors) {
    const [erElem] = fieldErrors[field];
    toggleErrorMsg(true, erElem);
  }
}

function resetObject(currentObj, initialObject) {
  Object.assign(currentObj, initialObject);
}

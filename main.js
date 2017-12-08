let activeOptions = [
  {
    "title": "Variant 1",
    "id":"A01.B01.C02"
  },
  {
    "title": "Variant 2",
    "id":"A01.B02.C01"
  },
  {
    "title": "Variant 3",
    "id":"A01.B02.C02"
  },
  {
    "title": "Variant 4",
    "id":"A02.B01.C02"
  },
  {
    "title": "Variant 5",
    "id":"A03.B02.C01"
  }
];

// let activeOptions = ["A","B","C"];


let dynamicVariantLength = activeOptions[0] !== undefined ? activeOptions[0].id.split(".").length : 0;
var variantButtons = document.querySelectorAll('button[data-role="variant"]');

variantButtons.forEach((el)=>{  
  el.addEventListener("click", (e) => {    
    if(combinationIsAvailable(_getVariantOption(e).join("."))) {    
      selectVariantOption(e);  
      if(isFinalOption()) {
        markAvailableOptions(document.querySelector("#variantID").value);
      }   
    } else {
      alert ("This option is not available for the current combination");
    } 
 });

});

function _getVariantOptionIndex(arr,val){
  return arr
    .filter(el => {
      return (el.id).split(".").filter(x => {return x === val}).length > 0  
    })
    .map((el) => {return (el.id).split(".").indexOf(val)})[0];
}

function combinationIsAvailable(combination){ 
  if(combination === "") {
    return false;
  } else {
    return activeOptions.filter(el => {   
      return _verifyCombination(el.id,combination);
    }).length > 0 ? true : false;
  }
  
}

function markAvailableOptions(val) {  
  console.log(val);
  var filteredOptions = activeOptions
        .filter(el => {   
          return _verifyCombination(el.id,val);
        }).reduce((result, value, key) => {
          result = [...result].concat(value.id.split("."));
          return result;
        },[])
        .filter((el, i, a) => i === a.indexOf(el));
  let variantOptions = document.querySelectorAll('[data-role="variant"]');
  variantOptions.forEach(el => {
    el.classList.remove("disabled");
  });
  variantOptions.forEach(el => {
    let currentValue = el.value;
    if (filteredOptions.filter(x => x == currentValue).length == 0) {
      el.classList.add("disabled");
    }
  }); 
}

let _siblings = n => [...n.parentElement.children].filter(c=>c!=n);

function selectVariantOption(e){  
  let sibllingsArray = _siblings(e.currentTarget); 
  let isActive = (e.currentTarget.classList.contains("active"));
  let currentValue = e.currentTarget.value;
  if (!isActive) {
    sibllingsArray.map((elem) => {  
      elem.classList.remove("active");
    });
    e.target.classList.add("active");
    document.querySelector("#variantID").value = _getVariantOption(e).join(".");
  } else {
    e.target.classList.remove("active");
    document.querySelector("#variantID").value = _removeVariantOption(e).join(".");
  }
  
}
function _getVariantOption(e) {
  let val = e.currentTarget.value;
  let optionIndex = _getVariantOptionIndex(activeOptions, val);  
  let variantValueArray = document.querySelector("#variantID").value.split(".");    
  if (optionIndex !== undefined) {           
    if(variantValueArray.length < dynamicVariantLength) {     
      variantValueArray = _createEmptyVariantId(dynamicVariantLength);      
    }   
    variantValueArray[optionIndex] = val;
    return variantValueArray;
  } else {
    return [];
  }
} 
function _removeVariantOption(e){
  let val = e.currentTarget.value;    
  let variantValueArray = document.querySelector("#variantID").value.split("."); 
  return variantValueArray.reduce((result, value, key) => {
    if(value === val) {
      result.push("");
    } else {
      result.push(value);
    }
    return result;
  },[]);
}
function _createEmptyVariantId(arrayLength) {
  let arr = [];
  for (let i = 0; i < arrayLength; i++) {
    arr = [...arr,""];
  }
  return arr;
}

function _verifyCombination(variant, combination){  
  var foundArray = combination.split(".").reduce((result, value, key) => {
    variantOption = variant.split(".")[key];
    // console.log("combination",combinationOption,"value",value);
    if (value == "") {
      result.push(true);
    } else {
      if(value == variantOption) {
        result.push(true);
      } else {
        result.push(false);
      }
    }
    return result;
  },[]);  
  let result = !foundArray.includes(false);
  return result;
}

function isFinalOption() {
  return document.querySelector("#variantID").value.split(".").filter(x => x !== "").length <= dynamicVariantLength - 1;
}

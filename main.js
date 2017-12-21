let variantsPlaceholder = [
  {
    "title": "Variant 1",
    "id":"A01.B01.C02",
    "stock": 2
  },
  {
    "title": "Variant 2",
    "id":"A01.B02.C01",
    "stock": 0
  },
  {
    "title": "Variant 3",
    "id":"A01.B02.C02",
    "stock": 2
  },
  {
    "title": "Variant 4",
    "id":"A02.B01.C02",
    "stock": 2
  },
  {
    "title": "Variant 5",
    "id":"A03.B02.C01",
    "stock": 2
  }
];

// let activeOptions = ["A","B","C"];
let optionsObj = {
  "variants": variantsPlaceholder,
  "unavailableCombinationText": "This option is not available for the current combination"
}
function HandleVariants(options){
  // console.log(options);
  let activeOptions = options.variants;
  let unavailableCombinationText = options.unavailableCombinationText;
  let dynamicVariantLength = activeOptions[0] !== undefined ? activeOptions[0].id.split(".").length : 0;
  let variantButtons = document.querySelectorAll('button[data-role="variant"]');

  variantButtons.forEach((el)=>{  
    el.addEventListener("click", (e) => {  
      e.stopPropagation();  
      if(combinationIsAvailable(_getVariantOption(e).join("."))) {    
        selectVariantOption(e); 
        markAvailableOptions();     
      } else {        
        alert (unavailableCombinationText);
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
        return _verifyCombination(el.id,combination) && el.stock > 0;
      }).length > 0 ? true : false;
    }
    
  }
  function markAvailableOptions() {  
    let valArray = document.querySelector("#VariantID").value;    
    let variantOptions = document.querySelectorAll('[data-role="variant"]');
    var inactiveOptionsArray = [];
    variantOptions.forEach(el => {
      el.classList.remove("disabled");    
    });
    variantOptions.forEach(el => {
      if (!el.classList.contains("active")) {
        let obj = {};
        obj.value = el.value;
        obj.index = _getVariantOptionIndex(activeOptions, el.value) !== undefined ? _getVariantOptionIndex(activeOptions, el.value) : null;
        obj.node = el;
        inactiveOptionsArray = [...inactiveOptionsArray, obj];       
      } 
      
    });   
  
    inactiveOptionsArray.map((obj) => {
      let valArray = document.querySelector("#VariantID").value.split("."); 
      if (obj.index !== null) {
        valArray[obj.index] = obj.value;      
      }  else {
        //index not found, make first value of variant null = > no combination will be found
        valArray[0] = "XXXXX";
        
      }  
      let variant = valArray.join(".");      
      if(combinationIsAvailable(variant) === false) {
        obj.node.classList.add("disabled");
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
      e.currentTarget.classList.add("active");
      document.querySelector("#VariantID").value = _getVariantOption(e).join(".");
    } else {
      e.currentTarget.classList.remove("active");
      document.querySelector("#VariantID").value = _removeVariantOption(e).join(".");
    }
    
  }
  function _getVariantOption(e) {
    let val = e.currentTarget.value;
    let optionIndex = _getVariantOptionIndex(activeOptions, val);  
    let variantValueArray = document.querySelector("#VariantID").value.split(".");    
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
    let variantValueArray = document.querySelector("#VariantID").value.split("."); 
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
    let foundArray = combination.split(".").reduce((result, value, key) => {
      variantOption = variant.split(".")[key];  
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
    return document.querySelector("#VariantID").value.split(".").filter(x => x !== "").length >= dynamicVariantLength;
  }
}

//init
HandleVariants(optionsObj);
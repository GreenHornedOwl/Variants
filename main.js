let activeOptions = ["A01.B01.C02","A01.B02.C01","A01.B02.C02", "A02.B01.C02","A03.B02.C01"];

let dynamicVariantLength = activeOptions[0] !== undefined ? activeOptions[0].split(".").length : 0;

let options1 = getOptions(activeOptions);

console.log(options1);


var variantButtons = document.querySelectorAll("button");

variantButtons.forEach((el)=>{
 el.addEventListener("click", (e) => {
  let value = e.currentTarget.attributes["data-value"].value;
  selectVariantOption(e);
  updateVariantOption(value);
  var variantValue = document.querySelector("#variantID").value;
  console.log("value",variantValue);
  // if(variantValue.split(".").filter(el => { return el !== ""}).length !== dynamicVariantLength) { 
    markAvailableOptions(value);
        
  // }
  
  console.log(value);
 });

});




function markAvailableOptions(val) {
  console.log("markValue",val);
  let variantOptions = document.querySelectorAll('[data-role="variant"]');
  let variantValue = document.querySelector("#variantID").value;
  console.log("activeOptions",activeOptions);
  // console.log("variantValue", variantValue);
  var filteredOptions = activeOptions.filter((value) => { return verifyVariantId(value,variantValue)});
  // console.log("filteredOptions",filteredOptions);
  let optionIndex = filteredOptions
  .filter(el => {
    return (el).split(".").filter(x => {return x === val}).length > 0  
  })
  .map((el) => {return (el).split(".").indexOf(val)})[0]; 
  if(optionIndex === undefined) {    
    variantOptions.forEach(el => {
      el.classList.add("disabled");
    });

  } else {
    variantOptions.forEach(el => {
      el.classList.remove("disabled");
    });

    let workingArray = getOptions(filteredOptions.filter((value) => { return value.includes(val)}));
    // workingArray = workingArray.filter((item, idx) => idx !== optionIndex);
    workingArray = workingArray.reduce((result, value, key) => {
      value.map(el => {
        return result = [...result,el]
      });
      return result;
    })
    console.log("workingArray",workingArray);
    variantOptions.forEach(el => {
      let currentValue = el.attributes["data-value"].value;
      
      var isAvailable = workingArray.filter(x => x == currentValue).length > 0 ? true : false;
     
      if (!isAvailable) {     
          el.classList.add("disabled");
        // el.setAttribute("disabled","disabled");        
      } else {
        el.classList.remove("disabled");
        // el.removeAttribute("disabled");
      }
      // el.classList.remove("disabled");
    });
  }

  
}

let siblings = n => [...n.parentElement.children].filter(c=>c!=n);

function selectVariantOption(e){  
  let sibllingsArray = siblings(e.currentTarget); 

  sibllingsArray.map((elem) => {  
    elem.classList.remove("active");
  });
  e.target.classList.add("active");
}

function updateVariantOption(val){    
  let optionIndex = activeOptions
    .filter(el => {
      return (el).split(".").filter(x => {return x === val}).length > 0  
    })
    .map((el) => {return (el).split(".").indexOf(val)})[0]; 
  if (optionIndex !== undefined) {
    let variantInput = document.querySelector("#variantID");
    var variantValueArray = (variantInput.value).split(".");
    // if(variantValueArray[optionIndex] == val) {
    //   variantValueArray[optionIndex] = "";
    //   variantInput.value = variantValueArray.join(".");   
    //   target.classList.remove("active");
      // let sibllingsArray = siblings(target); 
      
      // sibllingsArray.map((elem) => {  
      //   elem.classList.remove("active");
      //   elem.classList.remove("disabled");
      // });
      // target.classList.remove("disabled");
      // target.classList.remove("active")
    //   return;
    // }
    // console.log("variantArray",variantValueArray);
    // console.log("optionIndex", optionIndex);
    // console.log("val",val);
    variantValueArray[optionIndex] = val;
    variantInput.value = variantValueArray.join(".");    
  }  
}

function getOptions(arr) {
  let options = arr.reduce((result, value, key) => {
    let valueArray = value.split(".");  
    let optionObject = [];
    for (let i = 0; i < dynamicVariantLength; i++) {    
      optionObject[i] = result[i] !== undefined ? result[i] : [];    
    }  
    for (let i = 0; i < valueArray.length; i++) {    
      optionObject[i].push(valueArray[i]);
    }
    result = [optionObject[0].reduce((x, y) => x.includes(y) ? x : [...x, y], []),optionObject[1].reduce((x, y) => x.includes(y) ? x : [...x, y], []),optionObject[2].reduce((x, y) => x.includes(y) ? x : [...x, y], [])]  
    return result;
  },[]);

  return options
}

function verifyVariantId(combination, variant){
  // let combination = "a.b.c";
  // let variant = ".b.";
  var foundArray = variant.split(".").reduce((result, value, key) => {
    combinationOption = combination.split(".")[key];
    if (value == "") {
      result.push(true);
    } else {
      if(value == combinationOption) {
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

// verifyVariantId()
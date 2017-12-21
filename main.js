let variantsPlaceholder = [
  {
    "title": "Variant 1",
    "id":"A01.B01.C02",
    "stock": 2,
    "isFavorite": false,
    "addToFavoritesLink": "/favorite-api&favorite=true",
    "removeFromFavoritesLink": "/favorite-api&favorite=false",
    "addToCartLink": "/cart?ProductID=PRODTEST&VariantID=A01.B01.C02&Quantity="
  },
  {
    "title": "Variant 2",
    "id":"A01.B02.C01",
    "stock": 0,
    "addToCartLink": "/cart?ProductID=PRODTEST&VariantID=A01.B02.C01&Quantity=",
    "isFavorite": false,
    "addToFavoritesLink": "/favorite-api&favorite=true",
    "removeFromFavoritesLink": "/favorite-api&favorite=false",
    "addToCartLink": "/cart?ProductID=PRODTEST&VariantID=A01.B02.C01&Quantity="
  },
  {
    "title": "Variant 3",
    "id":"A01.B02.C02",
    "stock": 2,
    "isFavorite": false,
    "addToFavoritesLink": "/favorite-api&favorite=true",
    "removeFromFavoritesLink": "/favorite-api&favorite=false",
    "addToCartLink": "/cart?ProductID=PRODTEST&VariantID=A01.B02.C02&Quantity="
  },
  {
    "title": "Variant 4",
    "id":"A02.B01.C02",
    "stock": 2,
    "isFavorite": true,
    "addToFavoritesLink": "/favorite-api&favorite=true",
    "removeFromFavoritesLink": "/favorite-api&favorite=false",
    "addToCartLink": "/cart?ProductID=PRODTEST&VariantID=A02.B01.C02&Quantity="
  },
  {
    "title": "Variant 5",
    "id":"A03.B02.C01",
    "stock": 2,
    "isFavorite": false,
    "addToFavoritesLink": "/favorite-api&favorite=true",
    "removeFromFavoritesLink": "/favorite-api&favorite=false",
    "addToCartLink": "/cart?ProductID=PRODTEST&VariantID=A03.B02.C01&Quantity="
  }
]; 

let optionsObj = {
  "variants": variantsPlaceholder,
  "unavailableCombinationText": "This option is not available for the current combination"
}
function HandleVariants(options){
  // console.log(options);
  let activeOptions = options.variants;
  let unavailableCombinationText = options.unavailableCombinationText;
  let dynamicVariantLength = activeOptions[0] !== undefined ? activeOptions[0].id.split(".").length : 0;
  let variantOptions = document.querySelectorAll('[data-role="variant"]');

  function markSelectedVariant() {
    let variantSelected = document.querySelector("#VariantID").value;
    if(variantSelected !== "") {
      let variantSelectedArray = variantSelected.split(".");
      variantSelectedArray.map(val=>{
        let option = document.getElementById(val);
        option.classList.add("active");
      });
      markAvailableOptions();
    }
  }

  function getVariantOptionIndex(arr,val){
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
        return verifyCombination(el.id,combination) && el.stock > 0;
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
        obj.index = getVariantOptionIndex(activeOptions, el.value) !== undefined ? getVariantOptionIndex(activeOptions, el.value) : null;
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
      document.querySelector("#VariantID").value = getVariantOption(e).join(".");
    } else {
      e.currentTarget.classList.remove("active");
      document.querySelector("#VariantID").value = removeVariantOption(e).join(".");
    }
    
  }
  function getVariantOption(e) {
    let val = e.currentTarget.value;
    let optionIndex = getVariantOptionIndex(activeOptions, val);  
    let variantValueArray = document.querySelector("#VariantID").value.split(".");    
    if (optionIndex !== undefined) {           
      if(variantValueArray.length < dynamicVariantLength) {     
        variantValueArray = createEmptyVariantId(dynamicVariantLength);      
      }   
      variantValueArray[optionIndex] = val;
      return variantValueArray;
    } else {
      return [];
    }
  } 
  function removeVariantOption(e){
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
  function createEmptyVariantId(arrayLength) {
    let arr = [];
    for (let i = 0; i < arrayLength; i++) {
      arr = [...arr,""];
    }
    return arr;
  }

  function verifyCombination(variant, combination){  
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

  //init
  markAvailableOptions();
  markSelectedVariant();

  //register events
  variantOptions.forEach((el)=>{  
    el.addEventListener("click", (e) => {  
      e.stopPropagation();  
      if(combinationIsAvailable(getVariantOption(e).join("."))) {    
        selectVariantOption(e); 
        markAvailableOptions();
      } else {        
        alert (unavailableCombinationText);
      } 
    });
  });
}

function RegisterGlobalEventsProductDetail(options) {
  // let activeOptions = options.variants;  

  let activeOptions = options !== undefined ? options.variants : [];
  //order submit
  document.getElementById("addToCart").addEventListener("click", function(e){
    e.preventDefault();
    let variantSelected = document.getElementById("VariantID").value;
    let dynamicVariantLength = activeOptions[0] !== undefined ? activeOptions[0].id.split(".").length : 0;
    let variantIsValid = variantSelected !== "" && variantSelected.split(".").filter(x=>{ return x !== ""}).length === dynamicVariantLength;    
    let currentValue = document.querySelector(".quantity").value;   
    if(variantIsValid) {
      let variant = activeOptions.filter(x => { return x.id === variantSelected})[0];
      if (currentValue > variant.stock) {
        let confirmAlert = confirm("Quantity selected is unavaialable. The maximum stock is " + variant.stock + ". Do you want to order the maximum amount ?");
        if (confirmAlert === true) {          
          document.querySelector(".quantity").value = variant.stock;
          alert(variant.addToCartLink + variant.stock);
        } 
      } else {
        alert(variant.addToCartLink + currentValue);
      }
    } else {
      alert("Please select variant options");
    }
  });

  //add to favorites
  document.querySelector(".addToFavorites").addEventListener("click", (e) => {
    let variantSelected = document.getElementById("VariantID").value;  
    let filteredVariantSelected = activeOptions.filter(x => {return x.id === variantSelected})[0];
    let filteredVariantSelectedIndex = activeOptions.findIndex(x => x.id === variantSelected);
    let updatedFilteredVariantSelected = {...filteredVariantSelected};
    if (filteredVariantSelected.hasOwnProperty('isFavorite')) {
      updatedFilteredVariantSelected = {...filteredVariantSelected, "isFavorite": true};
    } else {
      throw new Error("isFavorite property does not exist");      
    }
    alert(filteredVariantSelected.addToFavoritesLink);  
    
    let updatedActiveOptions = [
      ...activeOptions.slice(0, filteredVariantSelectedIndex),
      updatedFilteredVariantSelected,
      ...activeOptions.slice(filteredVariantSelectedIndex + 1)
    ];
    console.log(activeOptions);
    activeOptions = [...updatedActiveOptions];
    console.log(activeOptions);
    document.querySelector(".addToFavorites").classList.add("hidden");
    document.querySelector(".removeFromFavorites").classList.remove("hidden");    
  });

  //remove from favorites 
  document.querySelector(".removeFromFavorites").addEventListener("click", (e) => {
    let variantSelected = document.getElementById("VariantID").value;  
    let filteredVariantSelected = activeOptions.filter(x => {return x.id === variantSelected})[0];
    let filteredVariantSelectedIndex = activeOptions.findIndex(x => x.id === variantSelected);
    let updatedFilteredVariantSelected = {...filteredVariantSelected};
    if (filteredVariantSelected.hasOwnProperty('isFavorite')) {
      updatedFilteredVariantSelected = {...filteredVariantSelected, "isFavorite": false};
    } else {
      throw new Error("isFavorite property does not exist");      
    }
    alert(filteredVariantSelected.removeFromFavoritesLink);  
    
    let updatedActiveOptions = [
      ...activeOptions.slice(0, filteredVariantSelectedIndex),
      updatedFilteredVariantSelected,
      ...activeOptions.slice(filteredVariantSelectedIndex + 1)
    ];
    activeOptions = [...updatedActiveOptions];
    document.querySelector(".addToFavorites").classList.remove("hidden");
    document.querySelector(".removeFromFavorites").classList.add("hidden");   
  });
  
  //favorite container display
  let variantOptions = document.querySelectorAll('[data-role="variant"]');
  variantOptions.forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      let variantSelected = document.getElementById("VariantID").value;
      let dynamicVariantLength = activeOptions[0] !== undefined ? activeOptions[0].id.split(".").length : 0;
      let variantIsValid = variantSelected !== "" && variantSelected.split(".").filter(x=>{ return x !== ""}).length === dynamicVariantLength;  
      if(variantIsValid) {
        let filteredVariantSelected = activeOptions.filter(x => {return x.id === variantSelected})[0];
        let isFavorite = filteredVariantSelected.isFavorite;
        if(!isFavorite) {
          document.querySelector(".addToFavorites").classList.remove("hidden");
          document.querySelector(".removeFromFavorites").classList.add("hidden");
        } else {
          document.querySelector(".addToFavorites").classList.add("hidden");
          document.querySelector(".removeFromFavorites").classList.remove("hidden");
        }
        document.getElementById("favorite-container").classList.remove("hidden");
      } else {
        document.getElementById("favorite-container").classList.add("hidden");
      }
    });
  });


}






function OnLoadProductDetail(optionsOnLoad) {  
  this.data = optionsOnLoad; 
  HandleVariants(this.data);  
  RegisterGlobalEventsProductDetail(this.data);
}

// var newState = [
//   ...state.slice(0, index),
//   state[index] + 1,
//   ...state.slice(index + 1)
// ];

//init
OnLoadProductDetail(optionsObj);


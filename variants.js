let variantsAvailability = [
  {   
    "variantId": "A1.B1.C1",
    "stock": 10,
  },
  {   
    "variantId": "A1.B1.C3",
    "stock": 10,
  },
  {   
    "variantId": "A1.B3.C3",
    "stock": 10,
  },
  {   
    "variantId": "A2.B1.C1",
    "stock": 10,
  },
  {   
    "variantId": "A2.B2.C2",
    "stock": 10,
  },
  {   
    "variantId": "A2.B2.C2",
    "stock": 10,
  },
  {   
    "variantId": "A2.B3.C2",
    "stock": 10,
  },
  {   
    "variantId": "A2.B3.C3",
    "stock": 0,
  },
  {   
    "variantId": "A3.B3.C3",
    "stock": 10,
  }
]

//replace at index
const replaceAt = (array, index, value) => {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

const siblings = n => [...n.parentElement.children].filter(c=>c!=n);

const VariantsClickable = node => {
  const getCombinations = () => {
    return variantsAvailability;  //[...,{"variantID": "A1.B1.C1", "stock": 10},...]
  } 

  const optionIsValid = (option) => {       
    let variantArray = node.querySelector("#VariantId").value.split(".");       
    let optionIndex = combinations.filter(o=>o.variantId.includes(option))[0].variantId.split(".").indexOf(option);  
    variantArray = optionIsSelected(option) ? replaceAt(variantArray, optionIndex, "") : replaceAt(variantArray, optionIndex, option);   
    variantArray = variantArray.filter(v=>v!==""); //removig empty options ["","B1","C1"] => ["B1","C1"]   
    return combinationIsValid(variantArray);    
  }  

  const optionIsSelected = (option) => {
    return node.querySelector("#VariantId").value.split(".").indexOf(option) >= 0;    
  }

  const fillInCombination = (option) => {
    let variantArray = node.querySelector("#VariantId").value.split(".");    
    let optionIndex = combinations.filter(({variantId})=>variantId.includes(option))[0].variantId.split(".").indexOf(option);    
    variantArray = optionIsSelected(option) ? replaceAt(variantArray, optionIndex, "") : replaceAt(variantArray, optionIndex, option);   
    node.querySelector("#VariantId").value = variantArray.join(".");
  }

  const combinationIsValid = (arr) => {
    return combinations.filter(({variantId,stock})=> variantId.split(".").filter(v=>arr.includes(v)).length === arr.length && stock > 0).length > 0;
  }

  const getAvailableOptions = () => {
    let variantArray = node.querySelector("#VariantId").value.split("."); 
    let variantArrayReduced= variantArray.filter(v=>v!=="");
    // console.log(variantArray);   
    // let options = combinations.reduce((r,{variantId})=> [...r,...variantId.split(".")],[]).reduce((r,v)=> r.includes(v) ? [...r] : [...r,v],[]).sort((a,b)=>a-b);
    // let availableOptions = variantArray.filter(v=>v!=="").reduce((r,v)=>{
    //   let optionIndex = combinations.filter(({variantId})=>variantId.includes(v))[0].variantId.split(".").indexOf(v);
    //   let optionsWithTheSameIndex = combinations.reduce((r,{variantId,stock})=> {
    //     if(stock > 0 && combinationIsValid(replaceAt(variantArray,optionIndex,variantId.split(".")[optionIndex]))) {
    //       r = [...r,...variantId.split(".")[optionIndex]];
    //     } else {
    //       r = [...r]
    //     }
    //     return r;
    //   },[]);
    //   console.log(v,optionIndex,optionsWithTheSameIndex);
      
    //   return r;
    // },[]);
     availableOptions = combinations.filter(({variantId,stock})=> variantId.split(".").filter(v=>variantArrayReduced.includes(v)).length === variantArrayReduced.length && stock > 0).reduce((r,{variantId}) => [...r,...variantId.split(".")],[]).reduce((r,v)=> r.includes(v) ? [...r] : [...r,v],[]).sort((a,b)=>a-b);    
     let allOptions = combinations.reduce((r,{variantId})=> [...r,...variantId.split(".")],[]).reduce((r,v)=> r.includes(v) ? [...r] : [...r,v],[]).sort((a,b)=>a-b);
     let availableAlternativeOptions = variantArrayReduced.reduce((r,v)=>{
      let optionIndex = combinations.filter(({variantId})=>variantId.includes(v))[0].variantId.split(".").indexOf(v); //index of option ex: B3 -> 1
      let allOptionsFiltered = allOptions.filter(v2=>combinations.filter(({variantId})=>variantId.includes(v2))[0].variantId.split(".").indexOf(v2) === optionIndex && v2!==v);
      r = [...r,...allOptionsFiltered];      //gets all options on the same level as all the selected options
      return r;
     },[]).reduce((r,v)=>{
        let optionIndex = combinations.filter(({variantId})=>variantId.includes(v))[0].variantId.split(".").indexOf(v); //index of same level option ex: B1 -> 1
        let posibleVariantArrayReduced = replaceAt(variantArray,optionIndex,v).filter(v=>v!==""); 
        //loops through all filtered options and verifies the combination of the possible variant by replacing the option
        //ex: option: B2, variant A1.B1.C1, replaces B1 with B2 => A1.B2.C1 -> if true B2 = valid option if not it removes it from array
        if(combinationIsValid(posibleVariantArrayReduced)) {
          r = [...r,v]
        }        
      return r;
     },[]);
     
    return [...availableOptions,...availableAlternativeOptions].reduce((r,v)=> r.includes(v) ? [...r] : [...r,v],[]).sort((a,b)=>a-b);
  }  

  const markUnavailableOptions__Clickable = () => {
    let options = getAvailableOptions();
    document.querySelectorAll('[data-role="option"]').forEach(el=>{
      el.classList.add("disabled");
    })
    options.map(v=>{      
      document.querySelector(`#${v}`).classList.remove("disabled");
    });    
  }

  const markSelectedOption__Clickable = () =>{
    let variantArray = node.querySelector("#VariantId").value.split("."); 
    variantArray = variantArray.filter(v=>v!==""); 
    node.querySelectorAll('[data-role="option"]').forEach(el=>{
      el.classList.remove("active");
    });
    variantArray.map(option=> {      
      node.querySelector(`#${option}`).classList.add('active')
    });    
  }

  //init
  let combinations = getCombinations();
  let combinationLength = node.querySelectorAll('[data-role="option-group"]').length; 
  //fill in variant input with the selected combination or with an empty variant combination ex: .. for 3 dimention variant 
  node.querySelector("#VariantId").value = node.querySelector("#VariantId").value !== "" ? node.querySelector("#VariantId").value : Array(combinationLength).fill(null).join(".");  


}

export default Variants;

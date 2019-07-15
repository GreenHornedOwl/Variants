let variantsAvailability = [
  {   
    "variantId": "A1.B1.C1",
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
    "variantId": "A2.B3.C3",
    "stock": 0,
  },
  {   
    "variantId": "A3.B3.C3",
    "stock": 10,
  }
]


//get the length of the variant

const VariantsClickable = node => {
  let optionDimention = node.querySelectorAll('[data-role="option-group"]').length;  
  node.querySelector("#VariantId").value = node.querySelector("#VariantId").value !== "" ? node.querySelector("#VariantId").value : Array(optionDimention).fill(null).join(".");  
  node.querySelectorAll('[data-role="option"]').forEach(el=>{
    el.addEventListener("click",(e)=>{
      console.log(e.target.value);
    });
  });
}

//init
document.querySelectorAll('[data-role="option-content"]').forEach(el=>{
  VariantsClickable(el);
});
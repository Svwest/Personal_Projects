const code = document.querySelector("#code");
const name = document.querySelector("#name");
const description =  document.querySelector("#description");
const price = document.querySelector("#price");
const category =  document.querySelector("#category");
const inventory = document.querySelector("#inventory");

 const keys = ["sid","code","name","description","price","category","inventory", "active"];
const formSubmit = () => {
	const valid = true;
	if(true) 
	const formSubmit = () =>{
		axios.post("/users/newProduct",{
			params:{
				sid: sid.value,
				code: code.value,
				name: name.value,
				description: description.value,
				price:price.value,
				category: category.value,
				inventory: inventory.value,
				active:1
			}
		})
		.then(response => {
	        console.log(response.data);
			if(response.data.success){

			} else {
				renderErrors(response.data);
			}
	    })
	   
};

function renderErrors(valid){
	for(key in valid){
		if(key != "success"){
			const tmp = document.querySelector("#" + key);
			tmp.classList.remove("hide");
			tmp.classList.add("hide");
			if(valid[key]){
				tmp.classList.toggle("hide");
				tmp.innerHTML = valid[key];
			}
		}
	}
}

function ValidateEmail(input) {
  let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return input.match(validRegex);
}

function ValidatePass(input) {
  let validRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  return input.match(validRegex);
}	

const isValidForm = () => {
	const ret = {
		ecode: null,
		ename: null,
		edescription: null,
		eprice: null,
		ecategory: null,
		einventory: null,
		success: true
	};

	  if(code.value.length != 8){
	    ret.ecode = "Code must be 8";
	    ret.success = false;
  	}
	

	return ret;
};


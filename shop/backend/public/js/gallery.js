const email = document.querySelector("#email");
const pass1 = document.querySelector("#pass1");


// const keys = ["user","email","pass1","pass2"];
const formSubmit = (url,params ) => {
	const valid = isValidForm();
	if(valid.success){
		axios.post(url,params)
		.then(response => {
	        console.log(response);
	    })
	    .catch(error => {
	        console.log(error);
	    });
	} else {
		for(key in valid){
			if(key != "success"){
				const tmp = document.querySelector("#e" + key);
				tmp.classList.remove("hide");
				tmp.classList.add("hide");
				if(valid[key]){
					tmp.classList.toggle("hide");
					tmp.innerHTML = valid[key];
				}
			}
		}
	}
};

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
		user: null,
    	password: null,
    	repassword: null,
    	email: null,
		success: true
	};
	if(!ValidateEmail(email.value)){
	    ret.email = "Email not valid";
	    ret.success = false;
  	}
	  if(user.value.length > 30||user.value.length<3){
		if(user.value.length > 30){
			ret.user = "User name to long";
			ret.success = false;
		}
		else{
			ret.user = "Error User name must to be 3 - characters";
			ret.success = false;
		}
	  
	    
  	}
	  if(!ValidatePass(pass1.value)){
	    ret.password = "Password not valid";
	    ret.success = false;
  	}
	  if(!ValidatePass(pass2.value) || pass2.value != pass1.value){
	    ret.repassword = "Validation password not valid";
	    ret.success = false;
  	}
	return ret;
};




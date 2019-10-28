function getElement (id) {
	return document.getElementById(id)
}

let allUsers
fetch("https://garevna-rest-api.glitch.me/users/all")
	.then(response => response.json())
		.then(users => {
			allUsers = users
			for(let user in allUsers) {
				let optionDelete = getElement("selectDeleteUser").appendChild(document.createElement("option")) 
				optionDelete.innerHTML = user
				let optionChange = getElement("changeUser").appendChild(document.createElement("option")) 
				optionChange.innerHTML = user
			}
		})

getElement("showAllUser").onclick = function (event) {
	console.log(allUsers)
	for(var user in allUsers) {
		let p = document.getElementsByClassName("user-info")[0].
			appendChild(document.createElement("p"))
		p.style = `width: 300px; border: 1px solid black; padding: 5px; margin: 10px 0;`	
		p.innerHTML = `User ID : ${user} <br> `
		for(var prop in allUsers[user]) {
			if (prop === "name" || 
				prop === "user-name" ||
				prop === "age" ||
				prop === "speciality" ||
				prop === "user-email") {
				p.innerHTML +=  `${prop} : ${allUsers[user][prop]} <br> `
			}
			
		}
	}
}

function validationLoginOrName (idElem) {
	if (getElement(idElem).value.length === 0) {
		getElement(idElem).style = "border: 1px solid red"
		return false
	} else {
		getElement(idElem).removeAttribute("style")
	}
}

function validationUserEmail (idElem) {
	var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (!regEmail.test(String(getElement(idElem).value).toLowerCase()) ) {
		getElement(idElem).style = "border: 1px solid red"
		return regEmail.test(String(getElement(idElem).value).toLowerCase())
	} else {
		getElement(idElem).removeAttribute("style")
	}
}

getElement("newUserPhoto").onchange = function (event) {
	let img = event.target.files[0]
	if (img.type.split("/")[0] === "image" && img.size < 100000) {
		event.target.removeAttribute("style")
		let avatar = new FileReader(img)
		avatar.onload = function (event) {
			getElement("newUserPhotoHidden").value = event.target.result
		}	
		avatar.readAsDataURL(img)
		getElement("newUserImg-photo").src = URL.createObjectURL(img)
	} else {
		event.target.style = "border: 1px solid red"
		return false
	}	
}

function validationUserPhoto (hiddenElem, visiblElem) {
	if (!getElement(hiddenElem).value) {
		getElement(visiblElem).style = "border: 1px solid red;"
		return false
	} else {
		getElement(visiblElem).removeAttribute("style")
		null
	}
}

function validatinNewUserForm () {
	return validationLoginOrName("newUserLogin"),
		   validationLoginOrName("newUserName"),
		   validationUserEmail("newUserEmail"),
		   validationUserPhoto("newUserPhotoHidden", "newUserPhoto")
}

getElement("addNewUser").onclick = function (event) {
	if (validatinNewUserForm() !== false) {
		let formData = new FormData(getElement("form-newUser"))
		let userData = {}
		formData.forEach (
	      ( val, key ) => Object.assign ( userData, { [key]: val } )
	    )
	    console.log(userData)
	    fetch(`https://garevna-rest-api.glitch.me/user/${getElement("newUserLogin").value}`, {
	    	method: "POST",
	    	headers: {
	    		"Content-Type" : "application/json"
	    	},
	    	body: JSON.stringify(userData)
	    })
	    	.then(response => response.json())
	    		.then(newUser => console.log(newUser))	    
	} else {
		null
	}
}

getElement("deleteUser").onclick = function (event) {
	fetch(`https://garevna-rest-api.glitch.me/user/${getElement("selectDeleteUser").value}`, {
	    	method: "DELETE",
	    	headers: {
	    		"Content-Type" : "application/json"
	    	}
	    })
	    	.then(response => response.status)
	    		
}

getElement("changeUser").onchange = function (event) {
	if (event.target.value !== 0) {
		fetch(`https://garevna-rest-api.glitch.me/user/${event.target.value}`)
			.then(response => response.json())
				.then(user => {
					if ( user.hasOwnProperty("user-name") || user.hasOwnProperty("name") ) {
						getElement("changeUserName").value = user["user-name"] || user["name"]
					}if ( user.hasOwnProperty("user-email") ) {
						getElement("changeUserEmail").value = user["user-email"]
					} else {
						getElement("changeUserEmail").value = ""
					}if ( user.hasOwnProperty("user-photo") ) {
						getElement("changeUserImg-photo").src = user["user-photo"]
						getElement("changeUserPhotoHidden").value = user["user-photo"]
					} else {
						getElement("changeUserImg-photo").src = `#`
					}
				})
		getElement("conteiner-changeUser").style.display = "block"
		
		getElement("conteiner-btn").style.display = "block"
		
	}
}

getElement("changeUserPhoto").onchange = function (event) {
	let img = event.target.files[0]
	if (img.type.split("/")[0] === "image" && img.size < 100000) {
		event.target.removeAttribute("style")
		let avatar = new FileReader(img)
		avatar.onload = function (event) {
			getElement("changeUserPhotoHidden").value = event.target.result
		}	
		avatar.readAsDataURL(img)
		getElement("changeUserImg-photo").src = URL.createObjectURL(img)
	} else {
		event.target.style = "border: 1px solid red"
		return false
	}	
}

function validationChangeUserForm() {
	return validationLoginOrName("changeUserName"),
		   validationUserEmail("changeUserEmail"),	
		   validationUserPhoto("changeUserPhotoHidden", "changeUserPhoto")
		   	
}

getElement("partiallyСhange").onclick = function (event) {
	if (validationChangeUserForm() !== false) {
		let formData = new FormData(getElement("form-changeUser"))
		let userData = {}
		formData.forEach (
	      ( val, key ) => Object.assign ( userData, { [key]: val } )
	    )
	    // console.log(userData)
	    fetch ( `https://garevna-rest-api.glitch.me/user/${getElement("changeUser").value }`, {
		    method: "PATCH",
		    headers: {
		        "Content-Type": "application/json"
		    },
		    body: JSON.stringify (userData)
		} )
	    .then( response => response.json() )
	        .then ( response => console.log ( response ) )    				
		} else {
			null
	}
}

getElement("сompletelyСhange").onclick = function (event) {
	if (validationChangeUserForm() !== false) {
		let formData = new FormData(getElement("form-changeUser"))
		let userData = {}
		formData.forEach (
	      ( val, key ) => Object.assign ( userData, { [key]: val } )
	    )
	    fetch ( `https://garevna-rest-api.glitch.me/user/${getElement("changeUser").value }`, {
		    method: "PUT",
		    headers: {
		        "Content-Type": "application/json"
		    },
		    body: JSON.stringify (userData)
		} )
	    	.then( response => response.json() )
	        	.then ( response => console.log ( response ) )    				
		} else {
			null
	}
}  

getElement("btn-open-registrationForm").onclick = function(event) {
	getElement("wrap-conteinerRegistration").style.display = "block"
	event.target.style.display = "none"
}

getElement("closeForm").onclick = function (event) {
	getElement("wrap-conteinerRegistration").style.display = "none"
	getElement("btn-open-registrationForm").style.display = "block"
} 

getElement("photo").onchange = function (event) {
	let img = event.target.files[0]
	if (img.type.split("/")[0] === "image" && img.size < 100000) {
		event.target.removeAttribute("style")
		let avatar = new FileReader(img)
		avatar.onload = function (event) {
			getElement("photoHidden").value = event.target.result
		}	
		avatar.readAsDataURL(img)
		getElement("img-photo").src = URL.createObjectURL(img)
	} else {
		event.target.style = "border: 1px solid red"
		return false
	}	
}

function validationPassword () {
	let regPass = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
	let checkPassword = regPass.test( String(getElement("password").value) )
	if (checkPassword === true && getElement("password").value === getElement("passwordRepeat").value) {
		getElement("password").removeAttribute("style")
		getElement("passwordRepeat").removeAttribute("style")
		getElement("userPass").value = Sha256.hash ( getElement("passwordRepeat").value ) 
	}else {
		getElement("password").style = "border: 1px solid red"
		getElement("passwordRepeat").style = "border: 1px solid red"
		return false
	}	
}	

function validator () {
	return validationLoginOrName("login"),
		   validationLoginOrName("name"), 
		   validationUserEmail("email"),
		   validationUserPhoto("photoHidden", "photo"),
		   validationPassword()	
}	

getElement("btn-registration").onclick = function (event) {
	if (validator() !== false) {
		let formData = new FormData(getElement("form-registration"))
		let userData = {}
		formData.forEach (
	      ( val, key ) => Object.assign ( userData, { [key]: val } )
	    )
	    fetch(`https://garevna-rest-api.glitch.me/user/${getElement("login").value}`, {
	    	method: "POST",
	    	headers: {
	    		"Content-Type" : "application/json"
	    	},
	    	body: JSON.stringify(userData)
	    })
	    	.then(response => response.json())
	    		.then(newUser => console.log(newUser))
		document.cookie = `id=${getElement("login").value}`
		document.cookie = `pass=${getElement("userPass").value}`    				
	} else {
		null
	}	
}






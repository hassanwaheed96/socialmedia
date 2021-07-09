// Sign up fields 
let signupForm = document.getElementById("signup-form");
let signupButton = document.getElementById("signupbtn");
let registerName = document.getElementById("register-name");
let registerEmail = document.getElementById("register-email");
let registerPassword = document.getElementById("register-password");
let registerPasswordRepeat = document.getElementById("register-password-repeat");
let passwordMismatch = document.getElementById('mismatch-password');
let emailExists = document.getElementById('email-exists');

// Login Firlds 
let loginForm = document.getElementById("login-form");
let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");
let incorrectEmailPassword = document.getElementById('incorrect-email-password');

// Initializations
let postInput = document.getElementById('post-input');
let postButton = document.getElementById('post-button');
let chatInput = document.getElementById('chat-input');
let sendButton = document.getElementById('send-button');

// Get data from local storage
let Users = localStorage.getItem('Users');
let loggedinUser = localStorage.getItem("loggedinUser")

// Parse string into array
let _Users = JSON.parse(Users);
let _loggedinUser = JSON.parse(loggedinUser);

// Display login form
const toLogin = () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
}

// Display signup form
const toSignup = () => {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
}

// To Signup
const onSignupButton = () => {

    let obj = {
        name: registerName.value,
        email: registerEmail.value,
        password: registerPassword.value,
        passwordRepeat: registerPasswordRepeat.value,
        friendRequestsList: [],
        friendsList: [],
        messageBox: [],
        posts: []
    }

    const userFound = () => {
        let userExists = _Users.find(el => obj.email === el.email)
        if (!userExists) {
            _Users.push(obj)
            localStorage.setItem('Users', JSON.stringify(_Users));
            emailExists.style.display = 'none';
        } else {
            emailExists.style.display = 'block';
        }
    }

    if (obj.name && obj.email && obj.password && obj.passwordRepeat) {
        if (obj.password === obj.passwordRepeat) {
            passwordMismatch.style.display = 'none';
            if (Users) {
                userFound();
            } else {
                localStorage.setItem('Users', JSON.stringify([obj]));
            }
        } else {
            passwordMismatch.style.display = 'block';
        }
    }
}

// To Login
const onLoginButton = () => {
    const userFound = _Users.find(el => loginEmail.value === el.email && loginPassword.value === el.password);
    if (userFound) {
        location.href = "index.html";
        localStorage.setItem("loggedinUser", JSON.stringify(userFound));
        console.log('User Found: ', userFound);
    } else {
        incorrectEmailPassword.style.display = 'block';
    }
}

// Saved password Login 
const savedUser = () => {
    if (_loggedinUser) {
        location.href = "index.html";
    }
}

const signOut = () => {
    localStorage.removeItem("loggedinUser");
    location.href = "loginSignup.html";
}

const addAsFriend = () => {

    _Users.forEach((el) => {
        let cardDiv = document.createElement('div');
        let title = document.createElement('h5');
        let cardButtonDiv = document.createElement('div');
        let btn = document.createElement('button');

        user = {
            email: _loggedinUser.email,
            name: _loggedinUser.name
        }

        // Filter out logged in user
        if (el.email !== _loggedinUser.email) {
            // Populate People you may know list
            cardDiv.classList.add('card');
            cardButtonDiv.classList.add('card-button');
            title.innerHTML = el.name;
            btn.innerHTML = "Add as friend";
            btn.classList.add('add-friend-btn', 'btn-primary');
            document.querySelector('.add-as-friens').appendChild(cardDiv).appendChild(title);
            document.querySelector('.add-as-friens').appendChild(cardDiv).appendChild(cardButtonDiv).appendChild(btn);
        }


        // Send friend request to another user
        btn.addEventListener('click', () => {
            // debugger
            if (el.email) {

                let userIndex = _Users.findIndex(user => user.email == el.email)
                if (userIndex => 0) {
                    let check = _Users[userIndex].friendRequestsList.find(req => req.email == user.email)
                    console.log('check: ', check);
                    if (check) {
                        btn.innerHTML = 'Request Sent';
                        return;
                    }
                    _Users[userIndex].friendRequestsList.push(user);
                    localStorage.setItem('Users', JSON.stringify(_Users));
                }
            }
        })
    });
}

const friendRequests = () => {
    _loggedinUser.friendRequestsList.forEach((el) => {
        let cardDiv = document.createElement('div');
        let title = document.createElement('h5');
        let cardButtonDiv = document.createElement('div');
        let btnAccept = document.createElement('button');
        let btnCancel = document.createElement('button');

        cardDiv.classList.add('card');
        cardButtonDiv.classList.add('card-button');
        title.innerHTML = el.name;
        btnAccept.innerHTML = "Accept";
        btnAccept.classList.add('add-friend-btn', 'btn-primary');
        btnCancel.innerHTML = "Cancel";
        btnCancel.classList.add('add-friend-btn', 'btn-light');
        document.querySelector('.friend-request').appendChild(cardDiv).appendChild(title);
        document.querySelector('.friend-request').appendChild(cardDiv).appendChild(cardButtonDiv).appendChild(btnAccept);
        document.querySelector('.friend-request').appendChild(cardDiv).appendChild(cardButtonDiv).appendChild(btnCancel);

        btnAccept.addEventListener('click', () => {
            console.log('email: ', el.email);

            let friendIndex = _Users.findIndex(user => user.email == el.email)
            let selfIndex = _Users.findIndex(user => user.email == _loggedinUser.email)

            let friendCheck = _Users[friendIndex].friendsList.find(user => user.email == _loggedinUser.email)
            let selfCheck = _Users[selfIndex].friendsList.find(user => user.email == el.email)

            if (!friendCheck && !selfCheck) {
                _Users[friendIndex].friendsList.push(_loggedinUser.email);
                _Users[selfIndex].friendsList.push(el.email);
                localStorage.setItem('Users', JSON.stringify(_Users));

                _loggedinUser.friendsList.push(el.email);
                localStorage.setItem('loggedinUser', JSON.stringify(_loggedinUser));
            }
        })
    })
}

const friendsList = () => {
    _loggedinUser.friendsList.forEach((el) => {

        let userIndex = _Users.findIndex(user => user.email == el)
        let userCheck = _Users[userIndex].name

        let cardDiv = document.createElement('div');
        let title = document.createElement('h5');
        let cardButtonDiv = document.createElement('div');
        let btnAccept = document.createElement('button');

        cardDiv.classList.add('card');
        cardButtonDiv.classList.add('card-button');
        title.innerHTML = userCheck;
        btnAccept.innerHTML = 'Do nothing';
        btnAccept.classList.add('add-friend-btn', 'btn-primary');
        document.querySelector('.friends-list').appendChild(cardDiv).appendChild(title);
        document.querySelector('.friends-list').appendChild(cardDiv).appendChild(cardButtonDiv).appendChild(btnAccept);
    })
}

// const messages = () => {
//     _loggedinUser.friendsList.forEach((el) => {

//         let messages = {
//             messageTo: el,
//             messageFrom: _loggedinUser.email,
//             message: ""
//         }

// const clickOnChat = () => {
//     document.querySelector('.start-conversation').style.display = 'none';
//     document.querySelector('.chat').style.display = 'block'

//     let userIndex = _Users.findIndex(user => user.email == el)
//     let userCheck = _Users[userIndex].name

//     let cardDiv = document.createElement('div');
//     let title = document.createElement('h5');
//     // let cardButtonDiv = document.createElement('div');
//     // let btnMessage = document.createElement('button');

//     cardDiv.classList.add('card');
//     // cardButtonDiv.classList.add('card-button');
//     title.innerHTML = userCheck;
//     // btnMessage.innerHTML = "Message"
//     // btnMessage.classList.add('add-friend-btn', 'btn-primary');
//     // cardDiv.addEventListener('click', clickOnChat);
//     document.querySelector('.chat-title').appendChild(cardDiv).appendChild(title);
// }

//         const chat = () => {
//             let userIndex = _loggedinUser.friendsList.findIndex(user => user == el);
//             // console.log('userIndex: ', userIndex);

//             // let userCheck = _loggedinUser.friendsList[userIndex]
//             console.log('el.email: ', el);
//             // console.log('user check: ', userCheck);
//             console.log('logged in user: ', _loggedinUser.email);

//             // _Users[userIndex].messageBox.push(el);
//             _Users[userIndex].messageBox.push(messages);
//             localStorage.setItem('Users', JSON.stringify(_Users));
//         }

//         let userIndex = _Users.findIndex(user => user.email == el)
//         let userCheck = _Users[userIndex].name

//         let cardDiv = document.createElement('div');
//         let title = document.createElement('h5');
//         // let cardButtonDiv = document.createElement('div');
//         // let btnMessage = document.createElement('button');

//         cardDiv.classList.add('card', 'open-chat-btn');
//         // cardButtonDiv.classList.add('card-button');
//         title.innerHTML = userCheck;
//         // btnMessage.innerHTML = "Message"
//         // btnMessage.classList.add('add-friend-btn', 'btn-primary');
//         cardDiv.addEventListener('click', clickOnChat);
//         // cardDiv.onclick = 'clickOnChat()';
//         document.querySelector('.message-user').appendChild(cardDiv).appendChild(title);
//         // document.querySelector('.message-user').appendChild(cardDiv).appendChild(cardButtonDiv).appendChild(btnMessage);
//     })
//     // document.querySelector('.open-chat-btn').addEventListener('click', clickOnChat);

// }

const messages = () => {
    _loggedinUser.friendsList.forEach((el) => {

        console.log('el: ', el);
        console.log('_loggedinUser.email: ', _loggedinUser.email);

        const clickOnChat = () => {
            document.querySelector('.start-conversation').style.display = 'none';
            document.querySelector('.chat').style.display = 'block'

            let userIndex = _Users.findIndex(user => user.email == el)
            let userName = _Users[userIndex].name;
            let userChat = _Users[userIndex].messageBox;

            let cardDiv = document.createElement('div');
            let title = document.createElement('h5');
            let chat = document.createElement('p');

            cardDiv.classList.add('card');
            title.innerHTML = userName;
            chat.innerHTML = userChat;

            document.querySelector('.chat-title').appendChild(cardDiv).appendChild(title);
            document.querySelector('.chat-receiver').appendChild(title);
            document.querySelector('.message-user').appendChild(cardDiv).appendChild(chat);
        }

        const onChat = () => {

            let messagesObject = {
                messageTo: el,
                messageFrom: _loggedinUser.email,
                message: chatInput.value
            }

            console.log('input: ', chatInput.value);
            let userIndex = _Users.findIndex(user => user.email == _loggedinUser.email);

            _Users[userIndex].messageBox.push(messagesObject);
            localStorage.setItem('Users', JSON.stringify(_Users));
        }

        sendButton.addEventListener('click', onChat);

        let userIndex = _Users.findIndex(user => user.email == el);
        let userName = _Users[userIndex].name;
        

        let cardDiv = document.createElement('div');
        let title = document.createElement('h5');

        title.innerHTML = userName;

        document.querySelector('.message-user').appendChild(cardDiv).appendChild(title);

        cardDiv.classList.add('card', 'open-chat-btn');
        cardDiv.addEventListener('click', () => {
            clickOnChat();
        });

    });
}

const posts = () => {
    const onPost = () => {
        console.log('input: ', postInput.value);
        let userIndex = _Users.findIndex(user => user.email == _loggedinUser.email);

        _Users[userIndex].posts.push(postInput.value);
        localStorage.setItem('Users', JSON.stringify(_Users));
    }
    postButton.addEventListener('click', onPost);

    _Users.forEach((user) => {
        user.posts.forEach((el) => {
            console.log('el.posts: ', el);
            // console.log('postInput.value: ', postInput.value);
            // console.log('el: ', el);

            let cardDiv = document.createElement('div');
            let cardBody = document.createElement('div');
            let post = document.createElement('p');
            let title = document.createElement('h5');
            // let cardButtonDiv = document.createElement('div');
            // let btnMessage = document.createElement('button');

            cardDiv.classList.add('card');
            cardBody.classList.add('card-body')
            // cardButtonDiv.classList.add('card-button');
            title.innerHTML = user.name;
            post.innerHTML = el;
            // btnMessage.innerHTML = "Message"
            // btnMessage.classList.add('add-friend-btn', 'btn-primary');
            // cardDiv.onclick = 'clickOnChat()';
            document.querySelector('.post-output').appendChild(cardDiv).appendChild(cardBody).appendChild(title);
            document.querySelector('.post-output').appendChild(cardDiv).appendChild(cardBody).appendChild(post);
        })
    })
}
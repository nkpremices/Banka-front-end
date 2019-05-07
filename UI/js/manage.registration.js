/* eslint-disable no-return-assign */
// fetching a variable comming from the home page
const params = location.search.substring(1).split('&'); // eslint-disable-line
const fromHome = params[0].split('=');
const hide = fromHome[1];

// A variable to fetch actions on the registration page
let registration;
let state;
/* a variable to fetch variables coming
    from the reset password page */
let resetSuccess;
let fromReset;
if (params[1]) {
    fromReset = params[1].split('=');
    resetSuccess = fromReset[1]; // eslint-disable-line
}
// Functions to validate inputs
const validate = (email, firstName, lastName, password) => {
    const retobj = {
        validEmail: false,
        validFirstName: false,
        validLastName: false,
        validPassWord: false,
    };

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
    const nameRegex = /^[A-Za-z]+$/;

    if (email.length >= 5) retobj.validEmail = true;
    if (firstName.length >= 3 && nameRegex.test(firstName)) {
        retobj.validFirstName = true;
    }
    if (lastName.length >= 3 && nameRegex.test(lastName)) {
        retobj.validLastName = true;
    }
    if (passwordRegex.test(password)) {
        retobj.validPassWord = true;
    }

    return retobj;
};

// Function to dismiss and create the alert messages
const destroyMessageBox = () => {
    const alert = document.querySelector('.alert');
    alert.style.opacity = '0';
    setTimeout(() => alert.style.display = 'none', 1000);
};

const createMessageBox = () => {
    const alert = document.querySelector('.alert');
    alert.style.display = 'inline-block';
    alert.style.opacity = '1';
};

// A function to create an alert message
const createAlert = (message, color) => {
    document.querySelector('.alert .message').innerHTML = message;
    document.querySelector('.alert').style.background = color;
    setTimeout(createMessageBox, 800);
};
// creating the alert message on success
const createMessageSucces = () => {
    const message = 'A new password has been sent to the email,'
    + ' please login with that password';
    document.querySelector('.alert .message').innerHTML = message;
    setTimeout(createMessageBox, 800);
};


// Functions to shift the sign in and sign up parts
const signIn = () => {
    // changing the navigation display
    document.getElementById('home-nav').className = 'li nav-inactive';
    document.getElementById('signin-nav').className = 'li nav-active';
    document.getElementById('signup-nav').className = 'li nav-inactive';

    // shifting to the sign in part
    if (document.querySelector('.signup-form')) {
        document.querySelector('.signup-form').className = 'hide';
    }
    document.querySelector('.signin-form').className = 'signin-form';
    state = 'signin';

    registration = true;

    // Attempting to signin
    document.querySelector('.signin-form')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document
                .querySelector('.signin-form .form-body .email-field').value;
            const password = document
                .querySelector('.signin-form .form-body .password-field')
                .value;

            if (email && password) {
                const signInTemp = {
                    email,
                    password,
                };

                const verify = validate(email, '', '', password);

                const requestServer = async () => {
                    // eslint-disable-next-line no-undef
                    const SIGNINURL = `${HOST}/api/v2/auth/signin`;

                    // eslint-disable-next-line
                    const resultLogin = await sendRequestData('POST', SIGNINURL, signInTemp);
                    if (resultLogin) {
                        if (resultLogin.status === 200) {
                            window.localStorage
                                .setItem('token', resultLogin.data.token);
                            window.localStorage
                                .setItem('userInfo',
                                    JSON.stringify(resultLogin.data));
                            window.location = './dashboard.html';
                        } else {
                            const { message } = resultLogin.error;
                            createAlert(message, 'brown');
                        }
                    } else {
                        const { message } = resultLogin.error;
                        createAlert(message, 'brown');
                    }
                };

                if (verify.validEmail) {
                    if (verify.validPassWord) {
                        await requestServer();
                    } else {
                        const message = 'Password must contain at '
                        + 'least numbers Lowercase letters and '
                        + 'Uppercase letters and must be at least'
                        + '6 characters';
                        createAlert(message, 'brown');
                    }
                } else {
                    const message = 'Invalid email provided';
                    createAlert(message, 'brown');
                }
            }
        });
};

const signUp = () => {
    // changing the display of the navigation
    document.getElementById('home-nav').className = 'li nav-inactive';
    document.getElementById('signin-nav').className = 'li nav-inactive';
    document.getElementById('signup-nav').className = 'li nav-active';

    // shifting to the signup part
    if (state === 'signin') {
        document.querySelector('.form .hide').className = 'signup-form';
        document.querySelector('.signin-form').className = 'signin-form hide';
    }
    state = 'signup';
    registration = true;

    // Attempting to signup
    document.querySelector('.signup-form')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document
                .querySelector('.signup-form .form-body .email-field').value;
            const firstName = document
                .querySelector('.signup-form .form-body .first-name-field')
                .value;
            const lastName = document
                .querySelector('.signup-form .form-body .last-name-field')
                .value;
            const password = document
                .querySelector('.signup-form .form-body .password-field')
                .value;

            if (email && firstName && lastName && password) {
                const signUpTemp = {
                    email,
                    firstName,
                    lastName,
                    password,
                };
                const signInTemp = {
                    email,
                    firstName,
                    lastName,
                    password,
                };

                const verify = validate(email, firstName, lastName, password);

                const requestServer = async () => {
                    // eslint-disable-next-line
                    const SIGNUPURL = `${HOST}/api/v2/auth/signup`;
                    // eslint-disable-next-line no-undef
                    const SIGNINURL = `${HOST}/api/v2/auth/signin`;
                    // eslint-disable-next-line
                    const resultSignup = await sendRequestData('POST', SIGNUPURL, signUpTemp);

                    if (resultSignup) {
                        if (resultSignup.status === 201) {
                            // eslint-disable-next-line
                            const resultLogin = await sendRequestData('POST', SIGNINURL, signInTemp);
                            if (resultLogin.status === 200) {
                                localStorage
                                    .setItem('userInfo',
                                        JSON.stringify(resultLogin.data));
                                window.location = './dashboard.html';
                            } else {
                                const { message } = resultSignup.error;
                                createAlert(message, 'brown');
                            }
                        } else if (resultSignup.status === 205) {
                            const message = 'Email address already in use';
                            createAlert(message, 'brown');
                        } else {
                            const { message } = resultSignup.error;
                            createAlert(message, 'brown');
                        }
                    }
                };

                if (verify.validEmail) {
                    if (verify.validFirstName) {
                        if (verify.validLastName) {
                            if (verify.validPassWord) {
                                await requestServer();
                            } else {
                                const message = 'Password must contain at '
                                + 'least numbers Lowercase letters and '
                                + 'Uppercase letters and must be at least'
                                + '6 characters';
                                createAlert(message, 'brown');
                            }
                        } else {
                            const message = 'last name must not contain '
                            + 'spaces and must be at least 3 characters';
                            createAlert(message, 'brown');
                        }
                    } else {
                        const message = 'First name must not contain '
                        + 'spaces and must be at least 3 characters';
                        createAlert(message, 'brown');
                    }
                } else {
                    const message = 'Invalid email provided';
                    createAlert(message, 'brown');
                }
            }
        });
};

const admin = () => {
    window.location = './admin.login.html';
};

const staff = () => {
    window.location = './staff.login.html';
};

// a funtion to return back on the home page
const backToHome = () => {
    window.location = '../index.html';
};

// Going to sign in from the form
document.getElementById('go-to-signin').addEventListener('click', signIn);

// Going to sign up from the form
document.getElementById('go-to-signup').addEventListener('click', signUp);

// Going to the home page
document.getElementById('home-nav').addEventListener('click', backToHome);
document.getElementById('logo').addEventListener('click', backToHome);
document.getElementById('app-name').addEventListener('click', backToHome);

// Going to sign up from the navigation
document.getElementById('signup-nav').addEventListener('click', signUp);

// Going to sign in from the navigation
document.getElementById('signin-nav').addEventListener('click', signIn);

// Going to the admin login page in from the navigation
document.getElementById('admin-nav').addEventListener('click', admin);

// Going to the staff login page in from the navigation
document.getElementById('staff-nav').addEventListener('click', staff);


// Creating the success message on creation of an account
if (resetSuccess) createMessageSucces();

// destroying the alert message
document.querySelector('.alert .to-right')
    .addEventListener('click', destroyMessageBox);

// Trynig to see which form will be hide
if (!registration) {
    if (hide) signIn();
    else signUp();
}

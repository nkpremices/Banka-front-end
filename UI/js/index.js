let HOST = 'https://banka-heroku.herokuapp.com/';

// See if the file is loaded locally
if (window.location.href.includes('localhost')
    || window.location.href.includes('127.0.0.1')) {
    HOST = 'localhost:3000';
}

console.log(HOST);

// A function to get data from the API (GET)
// eslint-disable-next-line no-unused-vars
const fetchData = async (URL, resType, token) => {
    try {
        const request = new Request(URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'reload',
            headers: {
                token,
            },
        });

        let result;
        const response = await fetch(request);

        if (resType === 'json') {
            result = await response.json();
            return result;
        }
        result = await response.text();
        return result;
    } catch (e) {
        throw Error(e);
    }
};

// A function to send data
// eslint-disable-next-line no-unused-vars
const sendRequestData = async (METHOD, URL, data, token) => {
    const request = new Request(URL, {
        method: METHOD,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token,
        },
        body: JSON.stringify(data),
    });

    const response = await fetch(request);
    let result;

    if (response.status === 205) {
        result = response;
    } else result = await response.json();

    return result;
};

// A function to reformat timestamp
// eslint-disable-next-line no-unused-vars
const reformatDateTime = (timestamp) => {
    // Convertig the timestamp
    const d = new Date(timestamp);
    // A template for months
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June',
        'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
    ];

    // A template for week days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Adding a sub string on the day number
    const subStrNumbers = [1, 2, 3, 21, 22, 23, 31];
    const subStrValues = ['st', 'nd', 'rd', 'st', 'nd', 'rd', 'st'];

    let subStr;
    if (subStrNumbers.find(el => el === d.getDate())) {
        subStr = subStrValues[subStrNumbers.indexOf(d.getDate())];
    } else subStr = 'th';

    // Formating the date
    const day = days[d.getDay()];
    const month = months[d.getMonth()];
    const date = `${d.getDate()}${subStr}`;
    const year = d.getFullYear();
    const hour = d.getHours();
    const minutes = d.getMinutes();

    const fullDate = `${day} ${month} ${date} ${year} -- ${hour}H : ${minutes}`;

    return fullDate;
};

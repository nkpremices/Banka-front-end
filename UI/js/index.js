let HOST = 'http://localhost:3000';

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
                authorization: token,
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

    let result;


    try {
        const response = await fetch(request);
        result = response.status === 205 ? response : await response.json();
        console.log(result);
    } catch (error) {
        console.log('======>', error);
    }

    return result;
};

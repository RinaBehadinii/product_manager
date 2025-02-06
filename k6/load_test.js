import http from 'k6/http';
import {check, sleep} from 'k6';

const BASE_URL = 'http://backend:8000/api/v1';
const USERNAME = '';
const PASSWORD = '';

function getToken() {
    let loginPayload = JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
    });

    let loginHeaders = {'Content-Type': 'application/json'};

    let res = http.post(`${BASE_URL}/token/`, loginPayload, {headers: loginHeaders});

    check(res, {'Token request successful': (r) => r.status === 200});

    return res.status === 200 ? res.json().access : null; // Extract JWT token
}

export let options = {
    stages: [
        {duration: '30s', target: 2},
        {duration: '1m', target: 3},
        {duration: '30s', target: 0},
    ],
};

export default function () {
    let token = getToken();
    if (!token) {
        return;
    }

    let authHeaders = {Authorization: `Bearer ${token}`};

    let res = http.get(`${BASE_URL}/categories/`, {headers: authHeaders});
    check(res, {'Categories request success': (r) => r.status === 200});

    res = http.get(`${BASE_URL}/brands/`, {headers: authHeaders});
    check(res, {'Brands request success': (r) => r.status === 200});

    res = http.get(`${BASE_URL}/sizes/`, {headers: authHeaders});
    check(res, {'Sizes request success': (r) => r.status === 200});

    res = http.get(`${BASE_URL}/colors/`, {headers: authHeaders});
    check(res, {'Colors request success': (r) => r.status === 200});

    res = http.get(`${BASE_URL}/products/`, {headers: authHeaders});
    check(res, {'Products request success': (r) => r.status === 200});

    res = http.get(`${BASE_URL}/orders/`, {headers: authHeaders});
    check(res, {'Orders request success': (r) => r.status === 200});

    res = http.get(`${BASE_URL}/reports/`, {headers: authHeaders});
    check(res, {'Reports request success': (r) => r.status === 200});

    sleep(1);
}

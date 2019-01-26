import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllCodes(username) {
    username = username || '';

    const req_codes = request({
        url: API_BASE_URL + "/code/codes",
        method: 'GET'
    })
    return req_codes
}

export function getAllUsers(username) {
    username = username || '';

    const req_users = request({
        url: API_BASE_URL + "/users",
        method: 'GET'
    })
    return req_users
}

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function signupModify(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup/modify",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function signupDelete(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup/delete",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function saveCode(saveCodeRequest) {
    return request({
        url: API_BASE_URL + "/code/codes/savecode",
        method: 'POST',
        body: JSON.stringify(saveCodeRequest)
    });
}

export function saveCodeModify(saveCodeRequest) {
    return request({
        url: API_BASE_URL + "/code/codes/modifycode",
        method: 'POST',
        body: JSON.stringify(saveCodeRequest)
    });
}

export function saveCodeDelete(saveCodeRequest) {
    return request({
        url: API_BASE_URL + "/code/codes/deletecode",
        method: 'POST',
        body: JSON.stringify(saveCodeRequest)
    });
}

export function getAllMenu(username) {
    username = username || '';

    const menu = request({
        url: API_BASE_URL + "/menu/menu",
        method: 'GET'
    })
    return menu
}

export function saveMenu(menuRequest) {
    return request({
        url: API_BASE_URL + "/menu/menu/savemenu",
        method: 'POST',
        body: JSON.stringify(menuRequest)
    });
}

export function saveMenuModify(menuRequest) {
    return request({
        url: API_BASE_URL + "/menu/menu/modifymenu",
        method: 'POST',
        body: JSON.stringify(menuRequest)
    });
}

export function saveMenuDelete(menuRequest) {
    return request({
        url: API_BASE_URL + "/menu/menu/deletemenu",
        method: 'POST',
        body: JSON.stringify(menuRequest)
    });
}

export function getKategorie(username) {
    return request({
        url: API_BASE_URL + "/menu/menu/getkat",
        method: 'GET'
            });

}

export function funcfindByKategoria(menuByKatRequest) {

    const bykat =  request({
        url: API_BASE_URL + "/menu/menu/getbykat/" + menuByKatRequest,
        method: 'GET'
            });

            return bykat;

}

export function getAllStolik(username) {
    username = username || '';

    const stolik = request({
        url: API_BASE_URL + "/stolik/all",
        method: 'GET'
    })
    return stolik
}

export function modRoom(roomModRequest) {
    return request({
        url: API_BASE_URL + "/stolik/akt/modify",
        method: 'POST',
        body: JSON.stringify(roomModRequest)
    });
}

export function createMenuTmp(stnr) {
    return request({
        url: API_BASE_URL + "/menu/menu/tmp/create",
        method: 'POST',
        body: JSON.stringify(stnr)
    });
}

export function getAllMenuTmp(stnr) {

    const menu = request({
        url: API_BASE_URL + "/menu/menu/tmp/get/"+ stnr,
        method: 'GET'
    })
    return menu
}

export function deleteTmpMenu(stnr) {
    return request({
        url: API_BASE_URL + "/menu/menu/tmp/del",
        method: 'POST',
        body: JSON.stringify(stnr)
    });
}

export function incTmp(id) {
    return request({
        url: API_BASE_URL + "/menu/menu/tmp/inc",
        method: 'POST',
        body: JSON.stringify(id)
    });
}

export function createTmpItem(menuTmpRequest) {
    return request({
        url: API_BASE_URL + "/menu/menu/tmp/item",
        method: 'POST',
        body: JSON.stringify(menuTmpRequest)
    });
}

export function deleteRachMenu(stnr) {
    return request({
        url: API_BASE_URL + "/menu/menu/tmp/rach",
        method: 'POST',
        body: JSON.stringify(stnr)
    });
}

export function getAllReser(username) {
    username = username || '';

    const reser = request({
        url: API_BASE_URL + "/reser/all",
        method: 'GET'
    })
    return reser
}

export function getReserData(data) {

    const menu = request({
        url: API_BASE_URL + "/reser/data/"+ data,
        method: 'GET'
    })
    return data
}


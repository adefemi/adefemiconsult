export function setActiveLink(state = "/", action) {
    switch(action.type){
        case "SET_ACTIVE_LINK":
            return action.payload;
            break;
    }
    return state
}

export function setAboutContent(state = [], action) {
    switch(action.type){
        case "SET_ABOUT_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setPortfolioContent(state = [], action) {
    switch(action.type){
        case "SET_PORTFOLIO_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setSkillContent(state = [], action) {
    switch(action.type){
        case "SET_SKILL_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setStoreContent(state = [], action) {
    switch(action.type){
        case "SET_STORE_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setBlogContent(state = [], action) {
    switch(action.type){
        case "SET_BLOG_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setUserContent(state = [], action) {
    switch(action.type){
        case "SET_USER_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setServiceContent(state = null, action) {
    switch(action.type){
        case "SET_SERVICE_CONTENT":
            return action.payload;
            break;
    }
    return state
}
export function setTeamContent(state = null, action) {
    switch(action.type){
        case "SET_TEAM_CONTENT":
            return action.payload;
            break;
    }
    return state
}
export function setSettingContent(state = [], action) {
    switch(action.type){
        case "SET_SETTING_CONTENT":
            return action.payload;
            break;
    }
    return state
}
export function setAdminActive(state = null, action) {
    switch(action.type){
        case "SET_USER_ACTIVE":
            return action.payload;
            break;
    }
    return state
}

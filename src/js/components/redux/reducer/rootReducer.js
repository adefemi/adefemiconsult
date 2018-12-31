import React from 'react'
import {combineReducers} from 'redux'

//import reducers
import {backEndLinks} from './extras';
import {setAdminActive, setAboutContent, setPortfolioContent, setActiveLink, setSettingContent,
    setSkillContent, setUserContent, setServiceContent, setStoreContent, setTeamContent, setBlogContent} from './contentReducer';


const ReducerAll = combineReducers({
    backEndLinks : backEndLinks,
    userStatus : setAdminActive,
    userContent : setUserContent,
    aboutContent : setAboutContent,
    skillContent : setSkillContent,
    portfolioContent : setPortfolioContent,
    serviceContent : setServiceContent,
    storeContent : setStoreContent,
    blogContent : setBlogContent,
    teamContent : setTeamContent,
    settingContent : setSettingContent,
    activeLink: setActiveLink,
});

export default ReducerAll
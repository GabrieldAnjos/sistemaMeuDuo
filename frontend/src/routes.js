import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login_user';
import Main from './pages/Main_user';

export default function Routes() {
    return(
        <BrowserRouter>
            <Route path="/" exact component={Login} />
            <Route path="/user/:id" component={Main} />
        </BrowserRouter>
    );
}
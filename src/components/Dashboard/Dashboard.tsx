import React, { useContext } from 'react';
import { 
    BrowserRouter as Router,
    Switch, 
    Route,
 } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import PageHeaderBar from '../Header/PageHeaderBar';
import SideMenu from './Menu/SideMenu';
import DashboardHome from './DashboardHome/DashboardHome';
import Classroom from './Classroom/Classroom';
import ProfileLink from './Menu/ProfileLink';
import StudentLinks from './Menu/StudentLinks';
import Profile from './Profile/Profile';

const Dashboard: React.FC = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <Router basename="/dashboard">
            <div className={`w-full h-full flex`}>
                <SideMenu>
                    <ProfileLink />
                    <StudentLinks />
                </SideMenu>
                <div className={`flex-grow`}>
                    <Switch>
                        <Route 
                            exact
                            path="/"
                            render={() => (
                                <DashboardHome />
                            )}
                            
                        />
                        <Route 
                            path="/classroom"
                            render={() => (
                                <Classroom />
                            )}
                        />
                        <Route 
                            path="/profile"
                            render={() => (
                                <Profile />
                            )}
                        />
                    </Switch>
                </div>
            </div>
        </Router>
    )
}

export default Dashboard;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CustomerLayout from "./CustomerLayout";
import AdminLayout from "./AdminLayout";
import AddGoal from "./Components/AddGoal";
import MentorLayout from "./MentorLayout";
import AdminLogin from "./Components/AdminLogin";
import MainPage from "./Components/MainPage";
import Registration from "./Components/Registration";
import Customerlogin from "./Components/Customerlogin";
import Mentorlogin from "./Components/Mentorlogin";
import Userinterface from "./Components/Userinterface";
import Mentorinterface from "./Components/Mentorinterface";
import CoursesPage from "./Components/CoursePage";
import Python from "./Components/CourseTables/python";
import GoalSetting from "./Components/GoalSetting";
import MentorPosts from "./Components/MentorPosts";
import Userjobalerts from "./Components/Userjobalerts";

import UserFeedback from "./Components/UserFeedback";
import Admininterface from "./Components/Admininterface";
import ASFB from "./Components/ASFB";
import AMFB from "./Components/AMFB";
import CreateAssignment from "./Components/CreateAssignment";
import SubmitAssignment from "./Components/SubmitAssignment";
import ViewSubmissions from "./Components/ViewSubmissions";
import PrivateRoute from "./Components/PrivateRoute"; 
import Profile from "./Components/Profile";// Import Private Route

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes (Login & Registration) */}
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/Customerlogin" element={<Customerlogin />} />
          <Route path="/Mentorlogin" element={<Mentorlogin />} />

          {/* Protected Routes (Require Authentication) */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<MainPage />} />
              <Route path="set-goal" element={<GoalSetting />} />
              <Route path="Profile" element={<Profile/>} />
              <Route path="Userinterface" element={<Userinterface />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="python" element={<Python />} />
              <Route path="Userjobalerts" element={<Userjobalerts />} />
              <Route path="Userfeedback" element={<UserFeedback />} />
              <Route path="Submitassignments" element={<SubmitAssignment />} />
            </Route>
            </Route>

            <Route element={<PrivateRoute />}>
            <Route path="/" element={<MentorLayout/>}>
            <Route path="Profile" element={<Profile/>} /> 
            <Route index element={<MainPage />} />
              <Route path="assignments" element={<CreateAssignment />} />
              <Route path="addgoal" element={<AddGoal/>} />
              <Route path="Mentorinterface" element={<Mentorinterface />} />
              <Route path="viewassignment" element={<ViewSubmissions />} />
              <Route path="MentorFeedBack" element={<ASFB/>} />
              <Route path="Mentorposts" element={<MentorPosts />} />
              <Route path="courses1" element={<CoursesPage />} />
              <Route path="python" element={<Python />} />
              
            </Route>
            </Route>

            <Route element={<PrivateRoute />}>
            <Route path="/" element={<AdminLayout/>}>
            <Route index element={<MainPage />} />
            <Route path="Admininterface" element={<Admininterface />} />
           
            
            <Route path="StudentsDetails" element={<ASFB />} />
            <Route path="MentorDetails" element={<AMFB />} />
            <Route path="assignments" element={<CreateAssignment />} />
            
            </Route>
            </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;

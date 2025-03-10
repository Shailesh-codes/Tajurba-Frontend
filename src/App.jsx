import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddMember from "./pages/AddMember";
import SignIn from "./authentications/SignIn";
import Layout from "./layout/Layout";
import AssignCertificate from "./pages/AssignCertificate";
import Broadcast from "./pages/Broadcast";
import ChaptersList from "./pages/ChaptersList";
import CreativeList from "./pages/CreativeList";
import CertificateLists from "./pages/CertificateLists";
import MarkAttendance from "./pages/MarkAttendance";
import AttendanceVenueFee from "./pages/AttendanceVenueFee";
import MarkvenueFee from "./pages/MarkvenueFee";
import MemberList from "./pages/MemberList";
import EditMemberModal from "./components/EditMemberModal";
import MemberView from "./components/MemberView";
import ScheduleMeetings from "./pages/ScheduleMeetings";
import EditScheduleMeeting from "./components/EditScheduleMeeting";
import ViewScheduleMeeting from "./components/ViewScheduleMeeting";
import AddScheduleMeeting from "./pages/AddMeetings";
import VisitorList from "./pages/VisitorList";
import MonthlyReward from "./pages/MonthlyReward";
import MemberStatistics from "./components/MemberStatistics";
import "./styles/styles.css";
import BDM from "./pages/BDM";
import AddBDM from "./components/AddBDM";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/assign-certificates" element={<AssignCertificate />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/chapters-list" element={<ChaptersList />} />
        <Route path="/creative-list" element={<CreativeList />} />
        <Route path="/certificate-list" element={<CertificateLists />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/attendance-venue-fee" element={<AttendanceVenueFee />} />
        <Route path="/mark-venue-fee" element={<MarkvenueFee />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/edit-member/:id" element={<EditMemberModal />} />
        <Route path="/member-view/:id" element={<MemberView />} />
        <Route path="/meetings" element={<ScheduleMeetings />} />
        <Route path="/edit-schedule/:id" element={<EditScheduleMeeting />} />
        <Route path="/view-schedule/:id" element={<ViewScheduleMeeting />} />
        <Route path="/add-schedule" element={<AddScheduleMeeting />} />
        <Route path="/visitor-list" element={<VisitorList />} />
        <Route path="/monthly-reward" element={<MonthlyReward />} />
        <Route path="/member-levels" element={<MemberStatistics />} />
        {/* Members Routes */}
        <Route path="/bdm" element={<BDM />} />
        <Route path="/add-bdm" element={<AddBDM />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;

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
import ViewBDM from "./components/ViewBDM";
import BusinessGiven from "./pages/BusinessGiven";
import AddBusiness from "./components/AddBusiness";
import ViewBusiness from "./components/ViewBusiness";
import BusinessReceived from "./pages/BusinessReceived";
import ViewResBusiness from "./components/ViewReceivedBusiness";
import AddEditBusinessReceived from "./components/AddEditBusinessReceived";
import MemberCertificate from "./pages/MemberCertificate";
import ChapterMembers from "./pages/ChapterMembers";
import MeetingsMDP from "./pages/MeetingsMDP";
import MembersMDPEvents from "./components/MembersMDPEvents";
import MemberMonthlyReward from "./pages/MemberMonthlyReward";
import MemberReferGiven from "./pages/MemberReferGiven";
import MemberReferView from "./components/MemberReferView";
import MemberReferEditAdd from "./components/MemberReferEditAdd";
import ChapterMemberView from "./components/ChapterMemberView";
import MemberReqReceived from "./pages/MemberReqReceived";
import MemberVisitorsInvite from "./pages/MemberVisitorsInvite";
import VisitorInviteAddEdit from "./components/VisitorInviteAddEdit";
import ViewMemberVisitor from "./components/ViewMemberVisitor";
import MemberDashboard from "./pages/MemberDashboard";

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
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/bdm" element={<BDM />} />
        <Route path="/add-bdm" element={<AddBDM />} />
        <Route path="/view-bdm/:id" element={<ViewBDM />} />
        <Route path="/business-given" element={<BusinessGiven />} />
        <Route path="/add-business" element={<AddBusiness />} />
        <Route path="view-business/:id" element={<ViewBusiness />} />
        <Route path="business-received" element={<BusinessReceived />} />
        <Route path="view-res-business/:id" element={<ViewResBusiness />} />
        <Route path="add-res-business" element={<AddEditBusinessReceived />} />
        <Route path="member-certificate" element={<MemberCertificate />} />
        <Route path="chapter-members" element={<ChapterMembers />} />
        <Route path="view-chapter-member/:id" element={<ChapterMemberView />} />
        <Route path="meetings-mdp-socials" element={<MeetingsMDP />} />
        <Route path="members-mdp-events" element={<MembersMDPEvents />} />
        <Route path="member-monthly-reward" element={<MemberMonthlyReward />} />
        <Route path="ref-given" element={<MemberReferGiven />} />
        <Route path="view-ref-given/:id" element={<MemberReferView />} />
        <Route path="add-edit-ref-given" element={<MemberReferEditAdd />} />
        <Route path="add-edit-ref-given/:id" element={<MemberReferEditAdd />} />
        <Route path="request-received" element={<MemberReqReceived />} />
        <Route path="visitors-invited" element={<MemberVisitorsInvite />} />
        <Route path="add-visitor" element={<VisitorInviteAddEdit />} />
        <Route path="edit-visitor/:id" element={<VisitorInviteAddEdit />} />
        <Route path="view-visitor/:id" element={<ViewMemberVisitor />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;

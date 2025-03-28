import { Routes, Route } from "react-router-dom";
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
import Setting from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Calendar from "./pages/Calendar";
import LogoutModal from "./authentications/LogoutModal";
import PageTitle from "./layout/PageTitile";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Sign In | Tajurba" />
            <SignIn />
          </>
        }
      />
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="Dashboard | Tajurba" />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/add-member"
          element={
            <>
              <PageTitle title="Add Member | Tajurba" />
              <AddMember />
            </>
          }
        />
        <Route
          path="/assign-certificates"
          element={
            <>
              <PageTitle title="Assign Certificates | Tajurba" />
              <AssignCertificate />
            </>
          }
        />
        <Route
          path="/broadcast"
          element={
            <>
              <PageTitle title="Broadcast | Tajurba" />
              <Broadcast />
            </>
          }
        />
        <Route
          path="/chapters-list"
          element={
            <>
              <PageTitle title="Chapters List | Tajurba" />
              <ChaptersList />
            </>
          }
        />
        <Route
          path="/creative-list"
          element={
            <>
              <PageTitle title="Creative List | Tajurba" />
              <CreativeList />
            </>
          }
        />
        <Route
          path="/certificate-list"
          element={
            <>
              <PageTitle title="Certificate List | Tajurba" />
              <CertificateLists />
            </>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <>
              <PageTitle title="Mark Attendance | Tajurba" />
              <MarkAttendance />
            </>
          }
        />
        <Route
          path="/attendance-venue-fee"
          element={
            <>
              <PageTitle title="Attendance & Venue Fee | Tajurba" />
              <AttendanceVenueFee />
            </>
          }
        />
        <Route
          path="/mark-venue-fee"
          element={
            <>
              <PageTitle title="Mark Venue Fee | Tajurba" />
              <MarkvenueFee />
            </>
          }
        />
        <Route
          path="/member-list"
          element={
            <>
              <PageTitle title="Member List | Tajurba" />
              <MemberList />
            </>
          }
        />
        <Route
          path="/edit-member/:id"
          element={
            <>
              <PageTitle title="Edit Member | Tajurba" />
              <EditMemberModal />
            </>
          }
        />
        <Route
          path="/member-view/:id"
          element={
            <>
              <PageTitle title="Member Details | Tajurba" />
              <MemberView />
            </>
          }
        />
        <Route
          path="/meetings"
          element={
            <>
              <PageTitle title="Meetings | Tajurba" />
              <ScheduleMeetings />
            </>
          }
        />
        <Route
          path="/edit-schedule/:id"
          element={
            <>
              <PageTitle title="Edit Schedule | Tajurba" />
              <EditScheduleMeeting />
            </>
          }
        />
        <Route
          path="/edit-schedule/:type/:id"
          element={
            <>
              <PageTitle title="Edit Schedule | Tajurba" />
              <EditScheduleMeeting />
            </>
          }
        />
        <Route
          path="/view-schedule/:id"
          element={
            <>
              <PageTitle title="View Schedule | Tajurba" />
              <ViewScheduleMeeting />
            </>
          }
        />
        <Route
          path="/view-schedule/:type/:id"
          element={
            <>
              <PageTitle title="View Schedule | Tajurba" />
              <ViewScheduleMeeting />
            </>
          }
        />
        <Route
          path="/add-schedule"
          element={
            <>
              <PageTitle title="Add Schedule | Tajurba" />
              <AddScheduleMeeting />
            </>
          }
        />
        <Route
          path="/visitor-list"
          element={
            <>
              <PageTitle title="Visitor List | Tajurba" />
              <VisitorList />
            </>
          }
        />
        <Route
          path="/monthly-reward"
          element={
            <>
              <PageTitle title="Monthly Reward | Tajurba" />
              <MonthlyReward />
            </>
          }
        />
        <Route
          path="/member-levels"
          element={
            <>
              <PageTitle title="Member Levels | Tajurba" />
              <MemberStatistics />
            </>
          }
        />
        {/* Members Routes */}
        <Route
          path="/member-dashboard"
          element={
            <>
              <PageTitle title="Member Dashboard | Tajurba" />
              <MemberDashboard />
            </>
          }
        />
        <Route
          path="/bdm"
          element={
            <>
              <PageTitle title="BDM | Tajurba" />
              <BDM />
            </>
          }
        />
        <Route
          path="/add-bdm"
          element={
            <>
              <PageTitle title="Add BDM | Tajurba" />
              <AddBDM />
            </>
          }
        />
        <Route
          path="/edit-bdm/:id"
          element={
            <>
              <PageTitle title="Edit BDM | Tajurba" />
              <AddBDM />
            </>
          }
        />
        <Route
          path="/view-bdm/:id"
          element={
            <>
              <PageTitle title="View BDM | Tajurba" />
              <ViewBDM />
            </>
          }
        />
        <Route
          path="/business-given"
          element={
            <>
              <PageTitle title="Business Given | Tajurba" />
              <BusinessGiven />
            </>
          }
        />
        <Route
          path="/add-business"
          element={
            <>
              <PageTitle title="Add Business | Tajurba" />
              <AddBusiness />
            </>
          }
        />
        <Route
          path="/add-business/:id"
          element={
            <>
              <PageTitle title="Edit Business | Tajurba" />
              <AddBusiness />
            </>
          }
        />
        <Route
          path="view-business/:id"
          element={
            <>
              <PageTitle title="View Business | Tajurba" />
              <ViewBusiness />
            </>
          }
        />
        <Route
          path="business-received"
          element={
            <>
              <PageTitle title="Business Received | Tajurba" />
              <BusinessReceived />
            </>
          }
        />
        <Route
          path="view-res-business/:id"
          element={
            <>
              <PageTitle title="View Received Business | Tajurba" />
              <ViewResBusiness />
            </>
          }
        />
        <Route
          path="add-res-business"
          element={
            <>
              <PageTitle title="Add Received Business | Tajurba" />
              <AddEditBusinessReceived />
            </>
          }
        />
        <Route
          path="add-res-business/:id"
          element={
            <>
              <PageTitle title="Edit Received Business | Tajurba" />
              <AddEditBusinessReceived />
            </>
          }
        />
        <Route
          path="member-certificate"
          element={
            <>
              <PageTitle title="Member Certificate | Tajurba" />
              <MemberCertificate />
            </>
          }
        />
        <Route
          path="chapter-members"
          element={
            <>
              <PageTitle title="Chapter Members | Tajurba" />
              <ChapterMembers />
            </>
          }
        />
        <Route
          path="view-chapter-member/:id"
          element={
            <>
              <PageTitle title="View Chapter Member | Tajurba" />
              <ChapterMemberView />
            </>
          }
        />
        <Route
          path="meetings-mdp-socials"
          element={
            <>
              <PageTitle title="Meetings MDP & Socials | Tajurba" />
              <MeetingsMDP />
            </>
          }
        />
        <Route
          path="members-mdp-events"
          element={
            <>
              <PageTitle title="Members MDP Events | Tajurba" />
              <MembersMDPEvents />
            </>
          }
        />
        <Route
          path="member-monthly-reward"
          element={
            <>
              <PageTitle title="Member Monthly Reward | Tajurba" />
              <MemberMonthlyReward />
            </>
          }
        />
        <Route
          path="ref-given"
          element={
            <>
              <PageTitle title="References Given | Tajurba" />
              <MemberReferGiven />
            </>
          }
        />
        <Route
          path="view-ref-given/:id"
          element={
            <>
              <PageTitle title="View Reference | Tajurba" />
              <MemberReferView />
            </>
          }
        />
        <Route
          path="add-edit-ref-given"
          element={
            <>
              <PageTitle title="Add Reference | Tajurba" />
              <MemberReferEditAdd />
            </>
          }
        />
        <Route
          path="add-edit-ref-given/:id"
          element={
            <>
              <PageTitle title="Edit Reference | Tajurba" />
              <MemberReferEditAdd />
            </>
          }
        />
        <Route
          path="request-received"
          element={
            <>
              <PageTitle title="Requests Received | Tajurba" />
              <MemberReqReceived />
            </>
          }
        />
        <Route
          path="visitors-invited"
          element={
            <>
              <PageTitle title="Visitors Invited | Tajurba" />
              <MemberVisitorsInvite />
            </>
          }
        />
        <Route
          path="add-visitor"
          element={
            <>
              <PageTitle title="Add Visitor | Tajurba" />
              <VisitorInviteAddEdit />
            </>
          }
        />
        <Route
          path="edit-visitor/:id"
          element={
            <>
              <PageTitle title="Edit Visitor | Tajurba" />
              <VisitorInviteAddEdit />
            </>
          }
        />
        <Route
          path="view-visitor/:id"
          element={
            <>
              <PageTitle title="View Visitor | Tajurba" />
              <ViewMemberVisitor />
            </>
          }
        />

        {/* Other Routes */}
        <Route
          path="settings"
          element={
            <>
              <PageTitle title="Settings | Tajurba" />
              <Setting />
            </>
          }
        />
        <Route
          path="privacy-policy"
          element={
            <>
              <PageTitle title="Privacy Policy | Tajurba" />
              <PrivacyPolicy />
            </>
          }
        />
        <Route
          path="calendar"
          element={
            <>
              <PageTitle title="Calendar | Tajurba" />
              <Calendar />
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

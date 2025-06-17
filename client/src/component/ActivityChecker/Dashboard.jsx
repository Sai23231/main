import LiveVisitors from "./LiveVisitors";
import UserActivity from "./UserActivity";
const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <LiveVisitors />
      <UserActivity />
    </div>
  );
};

export default Dashboard;

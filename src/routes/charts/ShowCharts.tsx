import { useAppSelector } from "../../hooks/hooks";
export default function ShowCharts() {
  const role = useAppSelector((state) => state.auth.role);
  return (
    <div className="flex flex-col mx-0  bg-green-200">
      <div className="text-5xl font-bold mt-2 text-center">
        Charts dashboard
      </div>
      {(role === "ADMIN_USER" || role === "EDITOR_USER") && (
        <button className="btn btn-neutral w-36 ml-5">Upload new</button>
      )}
      <div className="flex bg-red-200 h-screen">
        <div id="chart1" className="w-1/2 bg-blue-200"></div>
        <div className="w-1/2 bg-orange-400"></div>
      </div>
    </div>
  );
}

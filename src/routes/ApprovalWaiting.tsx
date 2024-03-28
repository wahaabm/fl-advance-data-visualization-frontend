export default function ApprovalWaiting() {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-5xl font-bold mb-8 animate-pulse">
        Your request is pending approval
      </h1>
      <p className=" text-lg mb-8">
        We're processing your request. Thank you for your patience!
      </p>
    </div>
  );
}

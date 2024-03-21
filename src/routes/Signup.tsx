export default function Signup() {
  return (
    <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center bg-green-200">
      <div className="flex justify-center self-center  z-10 ">
        <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
          <div className="mb-4">
            <h3 className="font-semibold text-2xl text-gray-800">
              Registration{" "}
            </h3>
            <p className="text-gray-500">Please enter the following details</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">
                User name
              </label>
              <input
                className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type=""
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">
                Email
              </label>
              <input
                className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type=""
                placeholder="mail@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                Password
              </label>
              <input
                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type=""
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center"></div>
              <div className="text-sm"></div>
            </div>
            <div>
              <button className="w-full flex justify-center bg-red-400  hover:bg-red-700 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-200">
                Register
              </button>
              <p className="text-gray-500 text-center mt-2 text-sm">
                Already have an account? Sign in
              </p>

              <button className="mt-2 w-full flex justify-center bg-green-400  hover:bg-green-700 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-200">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

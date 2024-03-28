import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (email == "" || password == "" || userName == "") {
        throw new Error("All fields are required.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords don't match.");
      }
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username: userName }),
      });
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
      }
      const data = await response.json();
      setSuccessMessage(data.message);
      setUserName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };
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
          <form onSubmit={handleSignup}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  User name
                </label>
                <input
                  className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type=""
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="email"
                  placeholder="mail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  confirm password
                </label>
                <input
                  className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="password"
                  placeholder="confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-red-500 font-bold text-sm text-center">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 font-bold text-sm text-center">
                  {successMessage}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-red-400  hover:bg-red-700 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-200"
                >
                  Register
                </button>
                <p className="text-gray-500 text-center mt-2 text-sm">
                  Already have an account? Sign in
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="mt-2 w-full flex justify-center bg-green-400  hover:bg-green-700 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-200"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

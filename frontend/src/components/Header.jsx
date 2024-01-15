import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { SERVER_URL } from "../App";
import { useDispatch } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch(`${SERVER_URL}/api/auth/signout`,{
        credentials: "include"
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.nessage));
        return;
      }
      dispatch(signoutUserSuccess(data));
      navigate("/sign-in")
    } catch (error) {
      dispatch(signoutUserFailure(error.nessage));
    }
  };

  return (
    <div className="bg-slate-300 flex items-center justify-between px-8 py-4">
      <Link to={"/"}><div className="text-lg font-semibold">My Document</div></Link>
      {currentUser ? (
        <div className="flex items-center gap-4">
          <h2 className="text-lg">
            Hello,{" "}
            <span className="uppercase text-xl font-bold">
              {currentUser.username}
            </span>
          </h2>
          <button
            onClick={handleSignOut}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <>
        <div className="flex gap-6">
        <Link to={"/sign-up"}>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Sign up
          </button>
        </Link>
        <Link to={"/sign-in"}>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Sign In
          </button>
        </Link>
        </div>
        </>
      )}
    </div>
  );
};

export default Header;

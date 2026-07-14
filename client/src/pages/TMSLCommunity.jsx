// src/pages/Community.jsx
// import { useState } from "react";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Community() {
  const { user } = useAuth();
const currentUserRole = user?.role;

  // const members = [
  //   { name: "Aditya Raj", role: "Driver" },
  //   { name: "Amit Das", role: "Driver" },
  //   { name: "Rohit Sharma", role: "Driver" },
  //   { name: "Sourav Sen", role: "Driver" },
  //   { name: "Ankit Verma", role: "Driver" },
  //   { name: "Rahul Kumar", role: "Passenger" },
  //   { name: "Sneha Singh", role: "Passenger" },
  //   { name: "Priya Das", role: "Passenger" },
  // ];

  const [memberSearch, setMemberSearch] = useState("");
  const [members, setMembers] = useState([]);
  

const [posts, setPosts] = useState([]);
  

const [commentInputs, setCommentInputs] = useState({});
  
  const [newPost, setNewPost] = useState("");
  const loadPosts = async () => {
  try {
    const res = await api.get("/community/posts/tmsl");
    setPosts(res.data);
  } catch (err) {
    console.error(err);
  }
};
  
useEffect(() => {

  api.get("/community/tmsl-members")
    .then((res) => {
      setMembers(res.data.members || []);
    })
    .catch(console.error);

  loadPosts();

}, []);

  const createPost = async () => {

  if (!newPost.trim()) return;

  try {

    await api.post("/community/post", {
      message: newPost,
      community: "tmsl"
    });

    setNewPost("");

    loadPosts();

  } catch (err) {
    console.error(err);
  }

};

const addComment = async (postId) => {

  const text = commentInputs[postId];

  if (!text?.trim()) return;

  try {

    await api.post(`/community/comment/${postId}`, {
      text,
    });

    setCommentInputs({
      ...commentInputs,
      [postId]: "",
    });

    loadPosts();

  } catch (err) {
    console.error(err);
  }

};

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const drivers = members.filter(m => m.role === "driver").length;
const passengers = members.filter(m => m.role === "passenger").length;
// -------------------------------------------------------------------------------
  return (
    // <div className="bg-slate-50 min-h-screen py-10">
    <div className="min-h-screen py-10 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        {/* <h1 className="text-2xl font-bold mb-6"> */}
        <h1 className="text-3xl font-bold mb-6 text-slate-800">
          Techno Main Salt Lake Community
        </h1>

        {/* MAIN LAYOUT */}
        <div className="grid md:grid-cols-4 gap-6">

          {/* LEFT SIDE */}
          <div className="md:col-span-3">

            {/* STATS */}
            {/* <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl">Total Members: 8</div>
              <div className="bg-white p-4 rounded-xl">Drivers: 5</div>
              <div className="bg-white p-4 rounded-xl">Passengers: 3</div>
            </div> */}
            {/* <div className="grid sm:grid-cols-3 gap-4 mb-6">
  <div className="bg-white p-4 rounded-xl">
    Total Members: {members.length}
  </div>
  <div className="bg-white p-4 rounded-xl">
    Drivers: {drivers}
  </div>
  <div className="bg-white p-4 rounded-xl">
    Passengers: {passengers}
  </div>
</div> */}
<div className="grid sm:grid-cols-3 gap-4 mb-6">

  <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-3">
    <div className="text-2xl">👥</div>
    <div>
      <p className="text-xs text-gray-500">Total Members</p>
      <p className="text-lg font-bold">{members.length}</p>
    </div>
  </div>

  <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-3">
    <div className="text-2xl">🚗</div>
    <div>
      <p className="text-xs text-gray-500">Drivers</p>
      <p className="text-lg font-bold">{drivers}</p>
    </div>
  </div>

  <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-3">
    <div className="text-2xl">🧍</div>
    <div>
      <p className="text-xs text-gray-500">Passengers</p>
      <p className="text-lg font-bold">{passengers}</p>
    </div>
  </div>

</div>

            {/* SHARE */}
            {/* <div className="bg-white rounded-xl p-4 mb-6"> */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow border border-slate-100">
             <textarea
rows="3"
value={newPost}
onChange={(e)=>setNewPost(e.target.value)}
placeholder="Share something with community..."
className="w-full border rounded-lg p-2 text-sm"
/>
              <button
onClick={createPost}
className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm"
>
Post
</button>
            </div>

            {/* POSTS */}
            <div className="bg-white rounded-xl p-5">
              {/* <h2 className="font-semibold mb-4">💬 Community Posts</h2> */}
              <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
  💬 Active Discussions
</h2>

              {posts.map((p) => (
                <div
  key={p._id}
  className="bg-white rounded-2xl p-4 mb-4 shadow border border-slate-100 hover:shadow-lg transition"
>
                  <p className="text-sm font-medium">
                    {p.user?.name} ({p.user?.role})
                  </p>
                  <p className="text-sm text-slate-600">{p.message}</p>
                  <p className="text-xs text-slate-400 mb-3">{new Date(p.createdAt).toLocaleString()}</p>

                  {/* COMMENTS */}
                  <div className="ml-3 space-y-2">
                    {p.comments?.map((c, ci) => (
                      <p key={ci} className="text-xs text-slate-600">
                        <span className="font-medium">{c.user?.name}:</span> {c.text}
                      </p>
                    ))}
                  </div>

                  {/* ADD COMMENT */}
                  <div className="mt-3 flex gap-2">
                    <input
                      value={commentInputs[p._id] || ""}
                      onChange={(e) =>
  setCommentInputs({
    ...commentInputs,
    [p._id]: e.target.value,
  })
}
                      placeholder="Comment..."
                      className="flex-1 border rounded-lg px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => addComment(p._id)}
                      className="px-3 py-1 bg-slate-800 text-white rounded text-xs"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE – MEMBERS (FIXED + SCROLL) */}
          {/* <div className="bg-white rounded-xl p-5 h-[520px] sticky top-24"> */}
          {/* <div className="bg-white rounded-2xl p-5 h-[520px] sticky top-24 shadow border border-slate-100"> */}
          <div className="bg-white rounded-2xl p-5 h-[500px] sticky top-24 shadow border border-slate-100 flex flex-col">
            <h2 className="font-semibold mb-3">👥 Members</h2>

            {/* SEARCH */}
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search member..."
              className="w-full mb-3 border rounded-lg px-2 py-1 text-sm"
            />

            {/* SCROLL AREA */}
            {/* <div className="space-y-3 overflow-y-auto h-[420px] pr-1"> */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {filteredMembers.length === 0 ? (
  <p className="text-sm text-gray-500 text-center mt-4">
    No members yet. Join community 🚀
  </p>
) : (
  filteredMembers.map((m) => (
              
                // <div
                //   key={i}
                //   className="flex justify-between items-center border-b pb-2"
                // >
                //   <div>
                //     <p className="text-sm font-medium">{m.name}</p>
                //     <p className="text-xs text-slate-500">{m.role}</p>
                //   </div>

                //   {currentUserRole === "passenger" && m.role === "driver" && (
                //     <button
                //       onClick={() =>
                //         alert("Future: Redirect to booking page")
                //       }
                //       className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-full"
                //     >
                //       Book Ride
                //     </button>
                //   )}

                //   {currentUserRole === "driver" && m.role === "passenger" && (
                //     <button
                //       onClick={() =>
                //         alert("Future: Offer ride flow")
                //       }
                //       className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-full"
                //     >
                //       Offer Ride
                //     </button>
                //   )}
                // </div>
                <div
  key={m._id}
  className="bg-white rounded-xl p-3 shadow hover:shadow-md transition"
>
  <div className="flex items-center gap-3">

    {/* Avatar */}
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
      👤
    </div>

    {/* Info */}
    <div className="flex-1">
      <p className="text-sm font-semibold">{m.name}</p>
      <p className="text-xs text-slate-500">{m.role}</p>
    </div>

    {/* Status dot */}
    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
  </div>

  {/* Button */}
  {currentUserRole === "passenger" && m.role === "driver" && (
    <button
      onClick={() => alert("Future: Redirect to booking")}
      className="mt-3 w-full text-xs bg-indigo-600 text-white py-1 rounded-full hover:bg-indigo-700 transition"
    >
      Book Ride
    </button>
  )}

  {currentUserRole === "driver" && m.role === "passenger" && (
    <button
      onClick={() => alert("Future: Offer ride")}
      className="mt-3 w-full text-xs bg-emerald-600 text-white py-1 rounded-full hover:bg-emerald-700 transition"
    >
      Offer Ride
    </button>
  )}
</div>
      ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

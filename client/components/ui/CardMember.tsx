'use client'
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

type Member = {
  name: string;
  role: string;
  avatar: string;
  title?: string;
  facebook?: string;
  github?: string;
  linkedin?: string;
};


const MEMBERS: Member[] = [
  {
    title: "Leader",
    name: "Nguyễn Thành Tiến",
    role: "Frontend Dev",
    avatar: "/images/avatar1.jpg",
    facebook: "#",
    github: "#",
    linkedin: "#",
  },
  {
    title: "Member",
    name: "Nguyễn Vĩnh Tài",
    role: "Backend Dev",
    avatar: "/images/avatar2.jpg",
    facebook: "#",
    github: "#",
    linkedin: "#",
  },
  {
    title: "Designer",
    name: "Lê Văn C",
    role: "UI/UX Designer",
    avatar: "/images/avatar3.jpg",
    facebook: "#",
    github: "#",
    linkedin: "#",
  },
  {
    title: "Manager",
    name: "Phạm Văn D",
    role: "Project Manager",
    avatar: "/images/avatar4.jpg",
    facebook: "#",
    github: "#",
    linkedin: "#",
  },
];

export default function MemberCard() {
  return (
    <div className="container mx-auto px-4 py-16">

      <h2 className="text-3xl font-bold text-center mb-10">
        Team Members
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {MEMBERS.map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 text-center 
            transition-all duration-300 
            hover:shadow-2xl hover:scale-110 hover:-translate-y-2"
          >

            {/* Title */}
            <p className="text-xs uppercase tracking-widest text-blue-500 font-bold mb-2">
              {m.title}
            </p>

            {/* Avatar */}
            <img
              src={m.avatar}
              alt={m.name}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-100 mb-4"
            />

            {/* Name */}
            <h3 className="text-lg font-bold text-slate-800">{m.name}</h3>

            {/* Role */}
            <p className="text-sm text-gray-500 mb-4">{m.role}</p>

            {/* Social */}
            <div className="flex justify-center gap-4 text-gray-500">
              
              {m.facebook && (
                <a href={m.facebook} target="_blank" className="hover:text-blue-600">
                  <FaFacebook size={18} />
                </a>
              )}

              {m.github && (
                <a href={m.github} target="_blank" className="hover:text-black">
                  <FaGithub size={18} />
                </a>
              )}

              {m.linkedin && (
                <a href={m.linkedin} target="_blank" className="hover:text-blue-700">
                  <FaLinkedin size={18} />
                </a>
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
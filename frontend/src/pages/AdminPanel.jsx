import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus  } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

const AdminPanel = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="grid grid-cols-2 gap-8">
                <div 
                    className="flex flex-col items-center bg-white p-6 rounded shadow-lg cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate("/search-user")}
                >
                    <FaUsersGear size={64} />
                    <button className="mt-4 bg-green-400 text-white px-4 py-2 rounded">
                        Buscar usuario
                    </button>
                </div>

                <div 
                    className="flex flex-col items-center bg-white p-6 rounded shadow-lg cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate("/register-user")}
                >
                    <FaUserPlus size={64} />
                    <button className="mt-4 bg-green-400 text-white px-4 py-2 rounded">
                        Registrar usuario
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;

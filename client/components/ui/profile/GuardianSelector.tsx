export const GuardianSelector = () => {
    const guardians = [
        { name: "Lumix (Light)", desc: "Radiates clarity and focus.", color: "bg-orange-100", img: "/pet1.png" },
        { name: "Terra (Earth)", desc: "Grounds your progress.", color: "bg-green-100", active: true, img: "/pet2.png" },
        { name: "Aero (Air)", desc: "Inspires swift movement.", color: "bg-blue-100", img: "/pet3.png" },
    ];

    return (
        <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-[#2b3674] mb-1">Choose Your Guardian</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">Select your initial pet companion.</p>

                <div className="space-y-4">
                    {guardians.map((g) => (
                        <div key={g.name} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${g.active ? 'border-blue-500 bg-blue-50/30' : 'border-slate-50 hover:border-slate-200'}`}>
                            <div className={`w-14 h-14 rounded-xl ${g.color} shrink-0`} />
                            <div>
                                <p className="text-sm font-black text-[#2b3674]">{g.name}</p>
                                <p className="text-[10px] text-slate-500 font-medium leading-tight">{g.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
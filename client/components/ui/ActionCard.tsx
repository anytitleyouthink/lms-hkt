export const ActionCard = () => (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-blue-100 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        <div className="relative z-10">
            <h3 className="font-bold text-xl">Onboarding Action</h3>
            <p className="text-blue-100 text-xs mt-2 leading-relaxed">Ready to curate your next team member's journey?</p>
        </div>
        <button className="relative z-10 mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-black py-3 px-6 rounded-2xl text-[11px] uppercase tracking-widest transition-all w-fit active:scale-95">
            Start Process Now
        </button>
    </div>
);
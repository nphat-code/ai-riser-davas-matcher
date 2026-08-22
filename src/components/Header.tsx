import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface HeaderProps {
    activeView: 'admin' | 'participant';
    setActiveView: (view: 'admin' | 'participant') => void;
    isMobileFrame?: boolean;
    setIsMobileFrame?: (val: boolean) => void;
    onRunMatchmaking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    activeView,
    setActiveView,
}) => {
    return (
        <header className="sticky top-0 z-40 w-full bg-[#010102]/90 backdrop-blur-md border-b border-[#23252a] px-4 lg:px-8 py-2.5">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Brand & DAVAS Title */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-2.5">
                        {/* Linear Logo Glyph */}
                        <div className="w-8 h-8 rounded-lg bg-[#0f1011] border border-[#23252a] flex items-center justify-center relative shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#5e6ad2] shadow-[0_0_8px_#5e6ad2]" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-medium tracking-tight text-[#f7f8f8]">
                                    DavaSync
                                </h1>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#141516] text-[#d0d6e0] border border-[#23252a]">
                                    DAVAS 2026
                                </span>
                            </div>
                            <p className="text-xs text-[#8a8f98] flex items-center gap-1.5 mt-0.5">
                                <span>Da Nang Venture & Angel Summit</span>
                            </p>
                        </div>
                    </div>

                    {/* Live Status Badge */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0f1011] border border-[#23252a] text-[11px] text-[#8a8f98]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                        <span className="text-[#d0d6e0] font-medium">LIVE</span>
                    </div>
                </div>

                {/* View Switcher Segment */}
                <div className="flex items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
                    <div className="flex items-center p-0.5 bg-[#0f1011] rounded-lg border border-[#23252a]">
                        <button
                            onClick={() => setActiveView('admin')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeView === 'admin'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516]/50 border border-transparent'
                                }`}
                        >
                            <Monitor className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Admin Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveView('participant')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeView === 'participant'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516]/50 border border-transparent'
                                }`}
                        >
                            <Smartphone className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Participant Portal</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

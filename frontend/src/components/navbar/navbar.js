import Navlinks from "./navlinks"

const Navbar = () => {
    return (
        <div className="min-w-[20%] border-r-[1px] border-gray h-[100vh] flex flex-col px-[21px] py-[20px] box-border font-Inter">
            {/* App name and logo */}
            <div className="flex flex-col gap-y-[8px] justify-center px-[16px] box-border">
                <div className="flex flex-row gap-x-[10px] text-[22px] font-medium font-Lexend">
                    <img src="/logo.svg" alt="logo"/>
                    assetMangaer.AI
                </div>
                <div className="flex flex-row gap-x-[5px] text-[#57534E] text-[10px] justify-end">
                    <div>built for</div>
                    <img src="/contentStackLogo.png" alt="content stack logo" className="w-[95px] h-[16px]"/>
                </div>
            </div>

            {/* main pages nav links */}
            <div className="flex flex-col gap-y-[12px] text-[14px] mt-[40px]">
                <Navlinks link="MyFiles" logo="myFiles.svg" text="My Files"/>
                <Navlinks link="Recent" logo="recent.svg" text="Recent"/>
                <Navlinks link="Search" logo="search.svg" text="Search media"/>
                <Navlinks link="Developer" logo="developer.svg" text="Developer"/>
            </div>

            <div className="w-full h-[1px] bg-gray my-[30px]"></div>
            <div className="flex flex-col gap-y-[12px] text-[14px]">
                <Navlinks link="settings" logo="settings.svg" text="Settings"/>
                <Navlinks link="Logout" logo="logout.svg" text="Logout"/>
            </div>
        </div>
    )
}

export default Navbar